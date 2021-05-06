import React, {useContext,  useEffect,  useState} from "react";
import { withRouter } from "react-router";
import app from "../../base.js";
import { AuthContext } from "../../Auth";
import ProductTypesTable from "../../utils/tables/productTypes-table";
import { Loading } from "../../utils/loading";
import { Button } from 'react-bootstrap';

const ProductTypes = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [productTypes, setProductTypes] = useState(null);

    const getProducTypesData = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/ProductTypes').on('value', snapshot => {
                let allProductTypes = [];
                if(snapshot.val()){
                    snapshot.val().map((productType) => {
                        allProductTypes.push({ 
                            id: productType.id, 
                            type: productType.type
                        });
                    });
                    if(productTypes === null){
                        setProductTypes(allProductTypes);
                        return;
                    }

                    if(allProductTypes.join() !== productTypes.join()){
                        setProductTypes(allProductTypes);
                    }
                }else{
                    if(productTypes === null){
                        setProductTypes(allProductTypes);
                        return;
                    }
                    if(productTypes.length !== 0)
                        setProductTypes(allProductTypes);
                }
                
                
            });
        }
    }

    useEffect(() => {
        getProducTypesData(currentUser?.companyInfo);
    })
        
    return (
        <>
            <div style={{display: 'inline-flex'}}>
                <h1>List of product types</h1>
                <div style={{float: 'right', marginTop: '7px', marginLeft: 'auto'}}>
                    <Button variant="success" onClick={() => props.history.push('/createProductType')}>Create a product type</Button>
                </div>
            </div>
            
            {productTypes !== null ? <ProductTypesTable productTypes={productTypes} /> : 
                <Loading />
            }
        </>
    );
};

export default withRouter(ProductTypes);