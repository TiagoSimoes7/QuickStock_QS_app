import React, {useContext,  useEffect,  useState} from "react";
import { withRouter } from "react-router";
import app from "../../base.js";
import { AuthContext } from "../../Auth";
import ProductsTable from "../../utils/tables/products-table";
import { Loading } from "../../utils/loading";

const DeletedProducts = () => {    
    const { currentUser } = useContext(AuthContext);
    const [products, setProducts] = useState(null);

    const getProductsData = (company) => {
        if(company){
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').on('value', snapshot => {
                let allProducts = [];
                if(snapshot.val()){
                    snapshot.val().map((product, key) => {
                        if(product.isDeleted === 1){
                            allProducts.push({ 
                                id: product.id, 
                                name: product.name, 
                                description: product.description ? product.description : null, 
                                quantStock: product.quantStock, 
                                isDeleted:product.isDeleted, 
                                localization: product.localization ? product.localization : null,
                                productType: product.productType 
                            });
                        }
                    });
                    if(products === null){
                        setProducts(allProducts);
                        return;
                    }
                    if(allProducts.join() !== products.join()){
                        setProducts(allProducts);
                    }
                }else{
                    if(products === null){
                        setProducts(allProducts);
                        return;
                    }
                    if(products.length !== 0)
                        setProducts(allProducts);
                }
                
            });
        }
    }

    useEffect(() => {
        getProductsData(currentUser?.companyInfo);
    })
        
    return (
        <>
            <h1>Deleted Products</h1>
            {products !== null ? <ProductsTable products={products} deleted={true} /> : 
                <Loading />
            }
        </>
    );
};

export default withRouter(DeletedProducts);