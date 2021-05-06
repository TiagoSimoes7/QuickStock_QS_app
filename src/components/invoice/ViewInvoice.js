import { useContext, useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router';
import ProductsOfInvoiceTable from '../../utils/tables/productsOfInvoice-table';
import { AuthContext } from "../../Auth";
import { Card } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../../utils/funcs';
import app from '../../base';

const ViewInvoice = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [ invoice, setInvoice ] = useState(props.location.state.selectedInvoice);

    if (!invoice) {
        return <Redirect to="/invoices" />;
    }
    useEffect(() => {
        if(currentUser)
            getInvoice(currentUser?.companyInfo.id, invoice.id)
    }, [currentUser]);

    const getInvoice = (companyID, invoiceID) => {
        app.database().ref('/companyData/' + companyID + '/Invoices/' + invoiceID).on('value', snapshot => {
            if(snapshot.val()){
                const newInvoice = { id: snapshot.val().id, date: snapshot.val().date, description: snapshot.val().description, type: snapshot.val().type };

                if(JSON.stringify(newInvoice) !== JSON.stringify(invoice)){
                    setInvoice(newInvoice);
                }
            }
        });  
    }

    return(
        <>
            <h1>Invoice {invoice.id}</h1>
            <Card style={{marginTop: '10px', minHeight: '820px', maxHeight: '820px'}}>
                <Card.Body>
                <blockquote className="blockquote" style={{padding: '10px 0'}}>
                    <p className="mb-0">Date: {invoice.date}</p>
                    <p className="mb-0">Description: {invoice.description ? invoice.description : '--'}</p>
                    <p className="mb-0">Type: {capitalizeFirstLetter(invoice.type)}</p>
                </blockquote>
                <h4>Movements of the invoice</h4>
                <ProductsOfInvoiceTable invoiceID={invoice.id} companyID={currentUser?.companyInfo.id} />
            </Card.Body>
            </Card>
        </>
    );
}

export default withRouter(ViewInvoice);