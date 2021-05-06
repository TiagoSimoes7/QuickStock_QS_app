import { useContext, useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router';
import FirebaseImage from '../../utils/firebaseImage';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import InvoicesOfProductTable from '../../utils/tables/invoicesOfProduct-table';
import { Card, Col, Row } from 'react-bootstrap';

const ViewProduct = (props) => {
    const [product, setProduct] = useState(props.location.state.selectedProduct); 
    const { currentUser } = useContext(AuthContext);
    const [productType, setProductType] = useState(null);

    useEffect(() => {
        if(currentUser){
            getProduct(currentUser?.companyInfo.id, product.id)
            getProductsType(currentUser?.companyInfo.id);
        }
    }, [currentUser]);
    
    if (!product) {
        return <Redirect to="/products" />;
    }
    const getProductsType = (companyID) => {
        app.database().ref('/companyData/' + companyID + '/ProductTypes').on('value', snapshot => {
            setProductType(snapshot.val().filter(m => m !== undefined));
        });
    };

    const getProduct = (companyID, productID) => {
        app.database().ref('/companyData/' + companyID + '/Products/' + productID).on('value', snapshot => {
            if(snapshot.val()){
                const newProduct = { 
                    id: snapshot.val().id, 
                    name: snapshot.val().name, 
                    description: snapshot.val().description ? snapshot.val().description : null, 
                    quantStock: snapshot.val().quantStock, 
                    isDeleted:snapshot.val().isDeleted, 
                    localization: snapshot.val().localization ? snapshot.val().localization : null,
                    productType: snapshot.val().productType,
                    image: snapshot.val().image ? snapshot.val().image : null
                };
                if(JSON.stringify(newProduct) !== JSON.stringify(product)){
                    setProduct(newProduct);
                }
            }
        });  
    }

    return(
        <>
        <h1>Product {product.name}</h1>
        <Card style={{marginTop: '10px', minHeight: '820px', maxHeight: '820px'}}>
            <Card.Body>
            <Row>
                <Col sm={3}>
                    <FirebaseImage imageName={product.image} />
                </Col>
                <Col sm={9}>
                    <blockquote className="blockquote" style={{padding: '31px 0'}}>
                        <p className="mb-0">ID: {product.id}</p>
                        <p className="mb-0">Name: {product.name}</p>
                        <p className="mb-0">Description: {product.description ? product.description : '--'}</p>
                        <p className="mb-0">Stock quantity: {product.quantStock}</p>
                        <p className="mb-0">Localization: {product.localization ? product.localization : '--'}</p>
                        {/* <p className="mb-0">Type: {product.productType !== null && productType !== null ? productType.find(type => type.id === product.productType).type : '--'}</p> */}
                    </blockquote>
                </Col>
            </Row>
            <h4>Movements of the product</h4>
            <InvoicesOfProductTable productID={product.id} companyID={currentUser?.companyInfo.id} />
            </Card.Body>
        </Card>
        </>
    );
}

export default withRouter(ViewProduct);