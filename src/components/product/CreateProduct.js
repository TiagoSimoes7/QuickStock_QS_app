import { useContext, useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import ProductForm from '../../utils/forms/product';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { sendImage } from '../file/file-func';
import { useToasts } from 'react-toast-notifications';

const CreateProduct = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [lastProductKey, setLastProductKey] = useState(0);
    useEffect(() => {
        getLastProductKey(currentUser?.companyInfo);
    });

    const getLastProductKey = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Products').limitToLast(1).on('child_added', function(childSnapshot) {
                setLastProductKey(childSnapshot.key);
            });
        }
        
    }
    const createProduct = async (product) => {
        const newID = Number(lastProductKey) + 1;
        const fileName = currentUser.companyInfo.id + '_' + newID; 
        if(product.image){
            const response = await sendImage(product.image, fileName);
            if (!response){
                return;
            }
        }
        const newProduct = {
            id: Number(newID), 
            isDeleted: 0,
            description: product?.description ? String(product?.description) : null,
            image: product.image ? String(fileName) : null,
            localization: product?.localization ? String(product?.localization) : null,
            name: String(product.name),
            productType: Number(product.productType),
            quantStock: Number(product.quantStock)
        };
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(newID)).set(newProduct)
        .then(() => {props.history.push('/products'); addToast('Product ' + newProduct.name + ' created with success', { appearance: 'success', autoDismiss: 'true' });})
        .catch(error => console.log(error));
    }
    return (
        <>
            <h1>Create new Product</h1>
            <ProductForm product={null} companyID={currentUser?.companyInfo.id} onSubmit={createProduct}/>
        </>
    )
}

export default withRouter(CreateProduct);