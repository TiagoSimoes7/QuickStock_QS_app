import { makeStyles } from '@material-ui/core';
import { useEffect, useContext, useState } from 'react';
import { Table, Button, FormControl, Row, Col } from 'react-bootstrap';
import app from "../../base.js";
import { AuthContext } from "../../Auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Asterisk } from 'react-bootstrap-icons';
import { Loading } from '../loading.js';

const useStyle = makeStyles({
    tableProductDiv: {
        width: '35%',
        overflowY: 'auto'
    },
    tableListDiv: {
        width: '55%',
        overflowY: 'auto'
    },
    selectedRow: {
        color: '#fff',
        backgroundColor: '#212529 !important',
        borderColor: '#32383e'
    },
    tableBody: {
        cursor: 'pointer'
    },
    rootDiv: {
        width: '100%',
        display: 'inline-flex',
        height: '35%',
        maxHeight: '342px'
    },
    buttonsDiv: {
        width: '10%',
        display: 'flex',
        justifyContent: 'center'
    },
    button: {
        margin: 'auto'
    },
    actionTD: {
        width: '100%',
        display: 'inline-flex'
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
});

const TablesCycle = (props) => {
    const classes = useStyle();
    const { currentUser } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [productsToAdd, setProductsToAdd] = useState([]);
    const [selectedProduct, setSelectProduct] = useState(null);
    const [listUpdated, setListUpdated] = useState(false);

    const getProductsData = (company) => {
        if (company) {
            app.database().ref('/companyData/' + company.id + '/Products').on('value', snapshot => {
                let allProducts = [];
                if(snapshot.val()){
                    snapshot.val().map((product) => {
                        if(product.isDeleted === 0){
                            allProducts.push({
                                id: product.id,
                                name: product.name,
                                quantStock: product.quantStock,
                                newQuantStock: null
                            });
                        } 
                        return null;
                    });
                    if (allProducts.length > 0 && !productsLoaded) {
                        setProducts(allProducts);
                        props.products(allProducts);
                        setProductsLoaded(true);
                    }
                }
                return;
            });
        }
    }

    const addProduct = () => {
        const newProducts = products.filter(function(item) {
            return item.id !== selectedProduct.id
        });
        setProducts(newProducts);
        const newList = [...productsToAdd, selectedProduct];
        setProductsToAdd(newList)
        setSelectProduct(null)
        props.newProductArray(newList);
    }

    const removeProduct = (product) => {
        const newProductsToAdd = productsToAdd.filter(function(item) {
            return item.id !== product.id
        });
        setProductsToAdd(newProductsToAdd);
        const newProducts = [...products, product];
        setProducts(newProducts)
        props.newProductArray(newProductsToAdd);
    }

    useEffect(() => {
        getProductsData(currentUser?.companyInfo);
    });

    useEffect(() => {
        if(products?.length && props.oldMovements?.length > 0 && !listUpdated && props.edit){
            let listProducts = products;
            const listProductsAdd = props.oldMovements.map((movement) => {
                const product = listProducts.filter(product => product.id === movement.idProduct);
                if(product.length){
                    listProducts = listProducts.filter(p => p.id !== movement.idProduct);
                    return {...product[0], newQuantStock: movement.quantity}
                }
            });
            setProducts(listProducts);
            if(listProductsAdd){
                setProductsToAdd(listProductsAdd);
            }
            setListUpdated(true);
            props.newProductArray(listProductsAdd);
        }
    },[products]);

    return (
        <>
            <Row>
                <Col sm={5}><h4>Select Products of invoice <Asterisk style={{marginBottom: '3px', color: '#bd2130'}} size={11} /></h4></Col>
                <Col sm={6} style={{marginLeft: '25px'}}><h4>{selectedProduct ? 'Product selected: ' + selectedProduct.name : 'No product Selected'}</h4></Col>
            </Row>
            <div className={classes.rootDiv}>
                <div className={classes.tableProductDiv}>
                    <Table striped bordered className={classes.table}>
                        <thead className={classes.header} style={{ width: '100%' }}>
                            <tr>
                                <th style={{textAlign: 'center'}}>ID</th>
                                <th style={{textAlign: 'center'}}>Name</th>
                                <th style={{textAlign: 'center'}}>Stock</th>
                            </tr>
                        </thead>
                        <tbody className={classes.tableBody}>
                            {!products ? <Loading /> : (
                            products.length > 0 ? products.map((product, key) => {
                                return (
                                    <tr 
                                        key={key} 
                                        className={selectedProduct?.id === product.id ? classes.selectedRow : null} 
                                        onClick={() => selectedProduct?.id !== product.id ? setSelectProduct(product) : setSelectProduct(null)}
                                    >
                                        <td style={{textAlign: 'end'}}>{product.id}</td>
                                        <td style={{textAlign: 'center'}}>{product.name}</td>
                                        <td style={{textAlign: 'end'}}>{product.quantStock}</td>
                                    </tr>)
                            }) : <tr><th style={{textAlign: 'center'}} colSpan={3}>There are no products created</th></tr>)}
                        </tbody>
                    </Table>
                </div>

                <div className={classes.buttonsDiv}>
                    <Button className={classes.button} variant="secondary" size="lg" disabled={selectedProduct ? false : true} onClick={() => addProduct()}>
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </Button>
                </div>
                <div className={classes.tableListDiv}>
                    <Table striped bordered hover className={classes.table}>
                        <thead className={classes.header}>
                            <tr>
                                <th style={{textAlign: 'center'}}>ID</th>
                                <th style={{textAlign: 'center'}}>Name</th>
                                <th style={{textAlign: 'center'}}>Quantity</th>
                                <th style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={classes.tableBody}>
                            {productsToAdd.length > 0 ? productsToAdd.map((product, key) => {
                                return (
                                    <tr 
                                        key={key}
                                    >
                                        <td style={{textAlign: 'end'}}>{product.id}</td>
                                        <td style={{textAlign: 'center'}}>{product.name}</td>
                                        <td style={{textAlign: 'end'}}>{product.quantStock}</td>
                                        <td className={classes.actionTD}>
                                            <FormControl
                                                type="number"
                                                id={'inputStock_' + product.id}
                                                placeholder={'Insert quantity of product ' + product.id}
                                                value={productsToAdd[key].newQuantStock}
                                                onChange={e => {
                                                    const index = productsToAdd.findIndex((obj => obj.id === product.id));
                                                    const newProductsToAddArray = productsToAdd;
                                                    newProductsToAddArray[index].newQuantStock = Number(e.target.value);
                                                    setProductsToAdd([...newProductsToAddArray])
                                                    props.newProductArray([...newProductsToAddArray]);
                                                }}
                                            />
                                            <Button style={{marginLeft: '20px',marginRight: '0'}} variant="danger" size="sm" onClick={() => removeProduct(product)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </td>
                                    </tr>
                                    );
                            }) : <tr><th style={{textAlign: 'center'}} colSpan={4}>There are no products selected</th></tr>}
                        </tbody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default TablesCycle;