import { makeStyles } from '@material-ui/core/styles';
import { useContext, useState, useEffect } from 'react';
import {Table, Button, ButtonGroup, Modal} from 'react-bootstrap';
import { withRouter } from "react-router";
import { AuthContext } from "../../Auth";
import app from '../../base';
import { useToasts } from 'react-toast-notifications';

const useStyle = makeStyles ({
    header: {
        '& tr' : {
            '& th' : {
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

const ProductsTypesTable = (props) => {
    const { addToast } = useToasts();
    const classes = useStyle();
    const [selectedProductType, setSelectedProductType] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [products, setProducts] = useState(null);

    const handleShow = (productType) => {setSelectedProductType(productType)};

    const handleClose = () => setSelectedProductType(null);

    const changeView = (productType) => {
        props.history.push({
            pathname: '/editProductType' ,
            state: { selectedProductType: productType }
          })
    }

    const deleteProductType = () => {
        if(products){
            const isUsed = products.filter(p => p.productType === selectedProductType.id);
            if(isUsed.length > 0){
                setSelectedProductType(null);
                addToast('This product type is being used, if you want to delete him change the products with this type (Deleted products count too)', { appearance: 'error', autoDismiss: 'true' });
                return;
            }
        }
        app.database().ref(`/companyData/${currentUser.companyInfo.id}/ProductTypes/${selectedProductType.id}`).remove();
        setSelectedProductType(null);
        props.history.push('/productTypes');
        addToast('Product Type ' + selectedProductType.type + ' deleted with success', { appearance: 'success', autoDismiss: 'true' })
    }

    useEffect(() => {
        getProducts(currentUser?.companyInfo.id);
    },[currentUser]);

    const getProducts = (id) =>{
        if(id){
            app.database().ref('/companyData/' + id + '/Products').on('value', snapshot => {
                let allProducts = [];
                if(snapshot.val()){
                    snapshot.val().map((product) => {
                        allProducts.push({ 
                            productType: product.productType
                        });
                    });
                    if(products === null){
                        setProducts(allProducts);
                    }
                }
                
            });
        }
    }

    return (
    <>
    <Table responsive striped bordered hover>
        <thead className={classes.header}>
            <tr>
            <th style={{textAlign: 'center'}}>ID</th>
            <th style={{textAlign: 'center'}}>Type</th>
            <th style={{width: '300px', textAlign: 'center'}}>Actions</th>
            </tr>
        </thead>
        <tbody>
            {props.productTypes.length > 0 ? 
                props.productTypes.map((product, key) => {
                    return (<tr key={key}>
                        <td style={{textAlign: 'end'}}>{product.id}</td>
                        <td>{product.type}</td>
                        <td>
                        <ButtonGroup style={{display: 'flex'}}>
                            <Button variant="info" onClick={() => changeView(product, 'edit')}>Edit</Button>
                            <Button variant="danger" onClick={() => handleShow(product)}>Delete</Button>
                        </ButtonGroup>
                        </td>
                    </tr>);    
                })
            : <tr><td colSpan={7} className={classes.thClear}>There are no type of products inserted</td></tr>}
        </tbody>
    </Table>
    <Modal show={selectedProductType} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{`Are you sure you want to delete product type ${selectedProductType?.type}?`}</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={deleteProductType}>
            {'Delete Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
}

export default withRouter(ProductsTypesTable);