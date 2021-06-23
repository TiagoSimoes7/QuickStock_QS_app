import { makeStyles } from '@material-ui/core/styles';
import { useContext, useEffect, useState } from 'react';
import { Table, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { withRouter } from "react-router";
import { AuthContext } from "../../Auth";
import app from '../../base';
import { useToasts } from 'react-toast-notifications';
import { capitalizeFirstLetter } from '../funcs';

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

const ProductsTable = (props) => {
    const { addToast } = useToasts();
    const classes = useStyle();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [productType, setProductType] = useState(null);

    useEffect(async () => {
        if (currentUser) {
            getProductsType(currentUser.companyInfo.id);
        }
    }, [currentUser])

    const getProductsType = (companyID) => {
        app.database().ref('/companyData/' + companyID + '/ProductTypes').on('value', snapshot => {
            if (snapshot.val()) {
                setProductType(snapshot.val().filter(m => m !== undefined));
            }

        })
    };

    const handleShow = (product) => { setSelectedProduct(product) };

    const handleClose = () => setSelectedProduct(null);

    const changeView = (product, path) => {
        props.history.push({
            pathname: path === 'edit' ? '/editProduct' : '/viewProduct',
            state: { selectedProduct: product }
        })
    }

    const deleteProduct = () => {
        app.database().ref(`/companyData/${currentUser.companyInfo.id}/Products/${selectedProduct.id}`).set({ ...selectedProduct, isDeleted: 1 });
        setSelectedProduct(null);
        addToast('Product ' + capitalizeFirstLetter(selectedProduct.name) + ' deleted with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const changeStatusProduct = () => {
        app.database().ref(`/companyData/${currentUser.companyInfo.id}/Products/${selectedProduct.id}`).set({ ...selectedProduct, isDeleted: 0 });
        setSelectedProduct(null);
        addToast('Status of the product  ' + capitalizeFirstLetter(selectedProduct.name) + ' changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    return (
        <>
            <Table responsive striped bordered hover>
                <thead className={classes.header}>
                    <tr>
                        <th style={{ textAlign: 'center' }}>ID</th>
                        <th style={{ textAlign: 'center' }}>Name</th>
                        <th style={{ textAlign: 'center' }}>Description</th>
                        <th style={{ textAlign: 'center' }}>Localization</th>
                        <th style={{ textAlign: 'center' }}>Type</th>
                        <th style={{ textAlign: 'center' }}>Stock</th>
                        <th style={{ width: '250px', textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.products.filter(p => p.isDeleted === (props.deleted ? 1 : 0)).length > 0 ?
                        props.products.map((product, key) => {
                            return (!props.deleted ?
                                (product.isDeleted === 0 ?
                                    <tr key={key}>
                                        <td style={{ textAlign: 'end' }}>{product.id}</td>
                                        <td style={{ textAlign: 'center' }}>{product.name}</td>
                                        <td>{product.description !== null ? product.description : '--'}</td>
                                        <td style={{ textAlign: 'center' }}>{product.localization !== null ? product.localization : '--'}</td>
                                        <td style={{ textAlign: 'center' }}>{product.productType !== null && productType !== null ? productType.find(type => type.id === product.productType).type : '--'}</td>
                                        <td style={{ textAlign: 'end' }}>{product.quantStock}</td>
                                        <td>
                                            <ButtonGroup style={{ display: 'flex' }}>
                                                <Button variant="secondary" onClick={() => changeView(product, 'view')}>View</Button>
                                                <Button variant="info" onClick={() => changeView(product, 'edit')}>Edit</Button>
                                                <Button variant="danger" onClick={() => handleShow(product)}>Delete</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr> : null)
                                :
                                (product.isDeleted === 1 ?
                                    <tr key={key}>
                                        <td style={{ textAlign: 'end' }}>{product.id}</td>
                                        <td style={{ textAlign: 'center' }}>{product.name}</td>
                                        <td>{product.description !== null ? product.description : '--'}</td>
                                        <td style={{ textAlign: 'center' }}>{product.localization !== null ? product.localization : '--'}</td>
                                        <td style={{ textAlign: 'center' }}>{product.productType !== null && productType !== null ? productType.find(type => type.id === product.productType).type : '--'}</td>
                                        <td style={{ textAlign: 'end' }}>{product.quantStock}</td>
                                        <td>
                                            <ButtonGroup style={{ display: 'flex' }}>
                                                <Button variant="success" onClick={() => handleShow(product)}>Change Status</Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr> : null));
                        })
                        : <tr><td colSpan={7} className={classes.thClear}>There are no {props.deleted ? 'deleted' : null} products inserted</td></tr>}

                </tbody>
            </Table>
            <Modal show={selectedProduct} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{!props.deleted ? `Are you sure you want to delete product ${selectedProduct?.name}?` : `Are you sure you want to change status product ${selectedProduct?.name}?`}</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={!props.deleted ? deleteProduct : changeStatusProduct}>
                        {!props.deleted ? 'Delete Product' : 'Change Status'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>);
}

export default withRouter(ProductsTable);