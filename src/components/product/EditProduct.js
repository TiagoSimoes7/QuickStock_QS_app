import { useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import ProductForm from '../../utils/forms/product';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { sendImage } from '../file/file-func';
import { useToasts } from 'react-toast-notifications';

const EditProduct = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    if (!props.location.state.selectedProduct) {
        return <Redirect to="/products" />;
    }

    const editProduct = async (product) => {
        const fileName = currentUser.companyInfo.id + '_' + product.id; 
        if(product.image && product?.newImage){
            const response = await sendImage(product.image, fileName);
            if (!response){
                return;
            }
        }
        const newProduct = {
            id: Number(product.id), 
            isDeleted: 0,
            description: product?.description ? String(product?.description) : null,
            image: product.image ? String(fileName) : null,
            localization: product?.localization ? String(product?.localization) : null,
            name: String(product.name),
            productType: Number(product.productType),
            quantStock: Number(product.quantStock)
        };
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(product.id).set(newProduct)
        .then(() => {props.history.push('/products'); addToast('Product ' + newProduct.name + ' edited with success', { appearance: 'success', autoDismiss: 'true' });})
        .catch(error => console.log(error));
    }
    return (
        <>
            <h1>Edit Product: {props.location.state.selectedProduct.id}</h1>
            <ProductForm product={props.location.state.selectedProduct} companyID={currentUser?.companyInfo.id} onSubmit={editProduct}/>
        </>
    )
}

export default withRouter(EditProduct);