import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { withRouter } from "react-router";
import app from '../../base';
import { Loading } from '../loading';

const useStyles = makeStyles({
  thClear: {
    textAlign: 'center'
  },
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
})

const ProductsOfInvoiceTable = (props) => {
  const classes = useStyles();
  const [movements, setMovements] = useState(null);
  const [products, setProducts] = useState(null);
  const [productsType, setProductsType] = useState(null);

  useEffect(async () => {
    if (props.companyID !== null) {
      getProductsOfInvoice(props.companyID, props.invoiceID);
      getProducts(props.companyID)
      getProductsType(props.companyID)
    }
  }, [props])

  const getProductsOfInvoice = (companyID, invoiceID) => {
    app.database().ref('/companyData/' + companyID + '/Movements').on('value', snapshot => {
      if (movements === null) {
        setMovements(snapshot.val().filter((movement) => movement.idInvoice === invoiceID));
      }
    })
  };

  const getProducts = (companyID) => {
    app.database().ref('/companyData/' + companyID + '/Products').on('value', snapshot => {
      let allProducts = [];
      snapshot.val().map((product) => {
        allProducts.push({
          id: product.id,
          name: product.name,
          localization: product.localization ? product.localization : null,
          productType: product.productType,
        });
      });
      if (products === null) {
        setProducts(allProducts);
      }
    })
  };

  const getProductsType = (companyID) => {
    app.database().ref('/companyData/' + companyID + '/ProductTypes').on('value', snapshot => {
        if (productsType === null) {
          setProductsType(snapshot.val());
        }
    })
};

  return ( movements && products && productsType ?
    <Table responsive striped bordered hover>
      <thead className={classes.header}>
        <tr>
          <th style={{textAlign: 'center'}}>Product ID</th>
          <th style={{textAlign: 'center'}}>Product name</th>
          <th style={{textAlign: 'center'}}>Product type</th>
          <th style={{textAlign: 'center'}}>Product localization</th>
          <th style={{textAlign: 'center'}}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {movements.length > 0 ? movements.map((movement, key) => {
          if (movement.idInvoice === props.invoiceID) {
            return (
              <tr key={key}>
                <td style={{textAlign: 'end'}}>{movement.idProduct}</td>
                <td style={{textAlign: 'center'}}>{products.filter(p => p.id === movement.idProduct)[0].name ?? '--'}</td>
                <td style={{textAlign: 'center'}}>{productsType.filter(t => t.id === products.filter(p => p.id === movement.idProduct)[0].productType)[0].type ?? '--'}</td>
                <td style={{textAlign: 'center'}}>{products.filter(p => p.id === movement.idProduct)[0].localization ?? '--'}</td>
                <td style={{textAlign: 'end'}}>{movement.quantity}</td>
              </tr>)
          }

        }) : <tr><td colSpan={5} className={classes.thClear}>There are no movements in this invoice</td></tr>}
      </tbody>
    </Table> : <Loading />);
}

export default withRouter(ProductsOfInvoiceTable);