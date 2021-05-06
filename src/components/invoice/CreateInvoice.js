import { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import InvoiceForm from '../../utils/forms/invoice';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { Loading } from '../../utils/loading';
import { useToasts } from 'react-toast-notifications';

const CreateInvoice = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [lastInvoiceKey, setLastInvoiceKey] = useState(0);
    const [lastMovementKey, setLastMovementKey] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLastInvoiceKey(currentUser?.companyInfo);
        getLastMovementsKey(currentUser?.companyInfo);
    });

    const getLastInvoiceKey = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Invoices').limitToLast(1).on('child_added', function(childSnapshot) {
                setLastInvoiceKey(childSnapshot.key);
            });
        }
    }
    const getLastMovementsKey = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Movements').limitToLast(1).on('child_added', function(childSnapshot) {
                setLastMovementKey(childSnapshot.key);
            });
        }
    }

    const createInvoice = async (invoice, movements, updatedProducts) => {
        setLoading(true);
        const newID = Number(lastInvoiceKey) + 1;
        var newMovementID = Number(lastMovementKey) + 1;
        const newInvoice = {
            id: Number(newID), 
            description: invoice?.description ? String(invoice?.description) : null,
            date: invoice?.date ? String(invoice?.date) : null,
            type: String(invoice.type)
        };
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Invoices').child(Number(newID)).set(newInvoice);
        await movements.map((movement) => {
            const newMovement = {
                idInvoice: Number(newID),
                idMovement: Number(newMovementID),
                idProduct: Number(movement.id),
                quantity: Number(movement.newQuantStock)
            }
            const newQuantity = invoice.type === "IN" ? movement.quantStock + movement.newQuantStock : movement.quantStock - movement.newQuantStock;
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Movements').child(Number(newMovementID)).set(newMovement);
            if(updatedProducts){
                app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(movement.id)).child('quantStock').set(Number(newQuantity));
            }
            newMovementID++;
        });
        setLoading(false);
        props.history.push('/invoices')
        addToast('Invoice ' + newInvoice.id + ' created with success', { appearance: 'success', autoDismiss: 'true' });
    }
    return ( loading ? <Loading /> :
        <>
            <h1>Create new Invoice</h1>
            <InvoiceForm invoice={null} edit={false} onSubmit={createInvoice}/>
        </>
    )
}

export default withRouter(CreateInvoice);