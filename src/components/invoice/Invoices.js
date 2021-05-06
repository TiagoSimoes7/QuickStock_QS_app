import React, {useContext,  useEffect,  useState} from "react";
import { withRouter } from "react-router";
import app from "../../base.js";
import { AuthContext } from "../../Auth";
import InvoicesTable from "../../utils/tables/invoices-table";
import { Loading } from "../../utils/loading";

const Invoices = () => {    
    const { currentUser } = useContext(AuthContext);
    const [ invoices, setInvoices] = useState(null);

    const getInvoicesData = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Invoices').on('value', snapshot => {
                let allInvoices = [];
                if(snapshot.val()){
                    snapshot.val().filter(i => i !== undefined).map((invoice) => {
                        allInvoices.push({ id: invoice.id, date: invoice.date, description: invoice.description, type: invoice.type });
                    });
                    if(invoices === null){
                        setInvoices(allInvoices);
                        return
                    }
                    if(allInvoices.join() !== invoices.join()){
                        setInvoices(allInvoices);
                    }
                }else{
                    if(invoices === null){
                        setInvoices(allInvoices);
                        return
                    }
                    if(invoices.length !== 0)
                        setInvoices(allInvoices);
                }
            });
        }
    }

    useEffect(() => {
        getInvoicesData(currentUser?.companyInfo);
    })
        
    return (
        <>
            <h1>List of Invoices</h1>
            {invoices === null ? <Loading /> : <InvoicesTable invoices={invoices} /> }
        </>
    );
};

export default withRouter(Invoices);