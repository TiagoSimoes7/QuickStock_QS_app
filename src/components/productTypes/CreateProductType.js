import { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import ProductTypeForm from '../../utils/forms/productTypes';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { useToasts } from 'react-toast-notifications';

const CreateProductType = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [lastProductTypeKey, setLastProductTypeKey] = useState(0);
    useEffect(() => {
        getLastProductTypeKey(currentUser?.companyInfo);
    });

    const getLastProductTypeKey = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/ProductTypes').limitToLast(1).on('child_added', function(childSnapshot) {
                setLastProductTypeKey(childSnapshot.key);
            });
        }
        
    }
    const createProductType = async (productType) => {
        const newID = Number(lastProductTypeKey) + 1;
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/ProductTypes').child(Number(newID)).set({id: Number(newID), type: productType.type})
        .then(() => {props.history.push('/productTypes'); addToast('Product Type ' + productType.type + ' created with success', { appearance: 'success', autoDismiss: 'true' })}).catch(error => console.log(error));
    }
    return (
        <>
            <h1>Create a new product type</h1>
            <ProductTypeForm productType={null} companyID={currentUser?.companyInfo.id} onSubmit={createProductType}/>
        </>
    )
}

export default withRouter(CreateProductType);