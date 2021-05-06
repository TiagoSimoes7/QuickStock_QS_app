import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form, Button, Card } from 'react-bootstrap';
import app from "../../base.js";
import FirebaseImage from '../firebaseImage.js';
import { Asterisk } from 'react-bootstrap-icons';

const ProductForm = (props) => {
    const [newProduct, setNewProduct] = useState(props.product ? props.product : {productType: 0});
    const [validInputs, setValidInputs] = useState(false);
    const [productType, setProductType] = useState([]);

    useEffect(() => {
        if (!newProduct) {
            setValidInputs(true);
            return;
        }
        if (!newProduct?.name || !newProduct?.quantStock) {
            setValidInputs(true);
            return;
        }
        if (isNaN(newProduct.quantStock)) {
            setValidInputs(true);
            return;
        }
        setValidInputs(false);
    }, [newProduct]);

    useEffect(async () => {
        if (props.companyID !== null) {
            getProductsType(props.companyID);
        }
    }, [props.companyID])

    const getProductsType = (companyID) => {
        app.database().ref('/companyData/' + companyID + '/ProductTypes').on('value', snapshot => {
            if (snapshot.val()) {
                setProductType(snapshot.val());
                if (!newProduct?.productType) {
                    setNewProduct({ ...newProduct, productType: snapshot.val().filter(m => m !== undefined)[0].id })
                }
            }
        })
    };

    return (
        <Card style={{marginTop: '10px'}}>
            <Card.Body>
                <Form>
                    <Form.Group controlId="inputName">
                        <Form.Label>Name <Asterisk style={{marginBottom: '3px', color: '#bd2130'}} size={11} /></Form.Label>
                        <Form.Control placeholder="Enter the Name" value={newProduct?.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="inputDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control placeholder="Enter a Description" value={newProduct?.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="inputQuantStock">
                        <Form.Label>Stock quantity <Asterisk style={{marginBottom: '3px', color: '#bd2130'}} size={11} /></Form.Label>
                        <Form.Control placeholder="Enter the Stock Quantity" value={newProduct?.quantStock} onChange={e => setNewProduct({ ...newProduct, quantStock: e.target.value })} />
                    </Form.Group>
                    {/* <Form.Group controlId="inputTypeProduct">
                        <Form.Label>Product Type <Asterisk style={{marginBottom: '3px', color: '#bd2130'}} size={11} /> </Form.Label>
                        <Form.Control as="select" selected={newProduct?.productType} value={newProduct?.productType} onChange={e => setNewProduct({ ...newProduct, productType: e.target.value })}>
                            {productType?.length > 0 ?
                                <>
                                    {productType.map((pType, key) => { return <option key={key} value={pType.id}>{pType.type}</option> })}
                                </> : <option value={null} disabled>There are no product types inserted</option>}
                        </Form.Control>
                    </Form.Group> */}
                    <Form.Group controlId="inputLocalization">
                        <Form.Label>Localization</Form.Label>
                        <Form.Control placeholder="Enter the Localization" value={newProduct?.localization} onChange={e => setNewProduct({ ...newProduct, localization: e.target.value })} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Image</Form.Label>
                        {newProduct?.image && !newProduct?.newImage ?
                            <>
                                <Button size="sm" style={{ marginLeft: '50px' }} onClick={() => setNewProduct({ ...newProduct, image: null, newImage: true })} variant="info">Change Image</Button>
                                <br />
                                <br />
                                <FirebaseImage changeProduct={true} imageName={newProduct?.image} />
                            </> :
                            <Form.File id="inputImage" accept='image/*' onChange={e => setNewProduct({ ...newProduct, image: e.target.files[0], newImage: true })} />}
                    </Form.Group>
                    <div style={{float: 'right'}}>
                        <Button style={{marginRight: '20px', width:'150px'}} disabled={validInputs} onClick={() => props.onSubmit(newProduct)} variant="primary">
                            Submit
                        </Button>
                        <Button style={{width:'150px'}} onClick={() => props.history.push('/products')} variant="danger">
                            Cancel
                        </Button>
                    </div>
                    <br />
                    <br />
                    <Form.Text style={{float: 'right'}} className="text-muted">
                        The submit button will be available when the required fields are filled correctly
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default withRouter(ProductForm)