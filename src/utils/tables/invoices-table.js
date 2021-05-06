import { makeStyles } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { Table, Button, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { withRouter } from "react-router";
import { AuthContext } from "../../Auth";
import app from '../../base';
import { capitalizeFirstLetter } from '../funcs';
import { useToasts } from 'react-toast-notifications';

const useStyle = makeStyles({
  header: {
      '& tr': {
          '& th': {
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1,
          }
      }
  },
  thClear: {
      textAlign: 'center'
  },
});

const InvoicesTable = (props) => {
  const { addToast } = useToasts();
  const classes = useStyle();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [updateStock, setUpdateStock] = useState(true);
  const [movementsToDelete, setMovementsToDelete] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts(currentUser?.companyInfo);
  })

  useEffect(() => {
    if (selectedInvoice) {
      getMovementsOfInvoice(currentUser?.companyInfo, selectedInvoice.id)
    }
  }, [selectedInvoice])

  const handleShow = (invoice) => { setSelectedInvoice(invoice) };

  const handleClose = () => { setSelectedInvoice(null); setUpdateStock(true) };

  const changeView = (invoice, path) => {
    props.history.push({
      pathname: path === 'edit' ? '/editInvoice' : '/viewInvoice',
      state: { selectedInvoice: invoice }
    })
  }

  const deleteInvoice = () => {
    const type = selectedInvoice.type;
    if(updateStock && movementsToDelete.length > 0){
      let valid = true;
      movementsToDelete.map(movement => {
        const product = products.filter(p => p.id === movement.idProduct);
        const newQuantity = type === "IN" ? product[0].quantStock - movement.quantity : product[0].quantStock + movement.quantity;
        if(newQuantity < 0){
          valid = false;
        }
      });
      if(!valid){
        setSelectedInvoice(null);
        addToast('There are not enough products to delete the invoice and update the stock', { appearance: 'error', autoDismiss: 'true' });
        return;
      }
    }
    app.database().ref(`/companyData/${currentUser.companyInfo.id}/Invoices/${selectedInvoice.id}`).remove();
    movementsToDelete.map(movement => {
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Movements').child(Number(movement.idMovement)).remove();
        if(updateStock){
            const product = products.filter(p => p.id === movement.idProduct);
            const newQuantity = type === "IN" ? product[0].quantStock - movement.quantity : product[0].quantStock + movement.quantity;
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(movement.idProduct)).child('quantStock').set(Number(newQuantity));
        }
    });
    setSelectedInvoice(null);
    addToast('Invoice ' + selectedInvoice.id + ' deleted with success', { appearance: 'success', autoDismiss: 'true' });
  }

  const getProducts = (company) => {
    if (company) {
      app.database().ref('/companyData/' + company.id + '/Products').on('value', snapshot => {
        let allProducts = [];
        if (snapshot.val()) {
          snapshot.val().map((product) => {
            allProducts.push({
              id: product.id,
              name: product.name,
              description: product.description,
              quantStock: product.quantStock,
              isDeleted: product.isDeleted,
              localization: product.localization,
              productType: product.productType,
              image: product.image ? product.image : null
            });
          });
          if (products.length === 0) {
            setProducts(allProducts);
          }
        }
      });
    }
  }

  const getMovementsOfInvoice = (company, id) => {
    if (company) {
      app.database().ref('/companyData/' + company.id + '/Movements').on('value', snapshot => {
        if (snapshot.val()) {
          setMovementsToDelete(snapshot.val().filter((movement) => movement.idInvoice === id));
        }
      })
    }
  }

  return (
    <>
      <Table responsive striped bordered hover>
        <thead className={classes.header}>
          <tr>
            <th style={{textAlign: 'center'}}>ID</th>
            <th style={{textAlign: 'center'}}>Date</th>
            <th style={{textAlign: 'center'}}>Description</th>
            <th style={{textAlign: 'center'}}>Type</th>
            <th style={{ width: '450px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.invoices.length > 0 ? 
          props.invoices.map((invoice, key) => {
            return (
              <tr key={key}>
                <td style={{textAlign: 'end'}}>{invoice.id}</td>
                <td style={{textAlign: 'center'}}>{invoice.date}</td>
                <td>{invoice.description ? invoice.description : '--'}</td>
                <td style={{textAlign: 'center'}}>{capitalizeFirstLetter(invoice.type)}</td>
                <td>
                  <ButtonGroup style={{ display: 'flex' }}>
                    <Button variant="secondary" onClick={() => changeView(invoice, 'view')}>View</Button>
                    <Button variant="info" onClick={() => changeView(invoice, 'edit')}>Edit</Button>
                    <Button variant="danger" onClick={() => handleShow(invoice)}>Delete</Button>
                  </ButtonGroup>
                </td>
              </tr>)
          })
          : <tr><td colSpan={5} className={classes.thClear}>There are no invoices inserted</td></tr>}
        </tbody>
      </Table>
      <Modal show={selectedInvoice} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete invoice {selectedInvoice?.id}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="inputUpdateStock">
            <Form.Check
              type="checkbox"
              label="I want to update the stock of the products"
              checked={updateStock}
              onChange={e => setUpdateStock(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteInvoice}>
            Delete Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
}

export default withRouter(InvoicesTable);