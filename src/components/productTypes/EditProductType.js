import { useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import ProductTypeForm from '../../utils/forms/productTypes';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { useToasts } from 'react-toast-notifications';

const EditProductType = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    if (!props.location.state.selectedProductType) {
        return <Redirect to="/productTypes" />;
    }

    const editProductType = async (productType) => {
        console.log(productType)
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/ProductTypes').child(productType.id).set({id: Number(productType.id), type: String(productType.type)})
        .then(() => {props.history.push('/productTypes'); addToast('Product Type ' + productType.type + ' edited with success', { appearance: 'success', autoDismiss: 'true' })}).catch(error => console.log(error));
    }
    return (
        <>
            <h1>Edit product type: {props.location.state.selectedProductType.id}</h1>
            <ProductTypeForm productType={props.location.state.selectedProductType} companyID={currentUser?.companyInfo.id} onSubmit={editProductType}/>
        </>
    )
}

export default withRouter(EditProductType);