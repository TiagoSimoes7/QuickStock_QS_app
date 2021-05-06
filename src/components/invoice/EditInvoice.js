import { useContext, useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router';
import InvoiceForm from '../../utils/forms/invoice';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { Loading } from '../../utils/loading';
import { useToasts } from 'react-toast-notifications';

const EditInvoice = (props) => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [oldMovements, setOldMovements] = useState(null);
    const [lastMovementKey, setLastMovementKey] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getOldMovements(currentUser?.companyInfo);
        getLastMovementsKey(currentUser?.companyInfo);
    }, [currentUser]);

    const getOldMovements = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Movements').on('value', snapshot => {
                if(snapshot.val()){
                    setOldMovements(snapshot.val().filter((movement) => movement.idInvoice === props.location.state.selectedInvoice.id));
                }
            })
        }
    }

    const getLastMovementsKey = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Movements').limitToLast(1).on('child_added', function(childSnapshot) {
                setLastMovementKey(childSnapshot.key);
            });
        }
    }

    const createMovements = async (movements, newID, invoice, update) => {
        if(movements.length < 0){
            return;
        }
        await movements.map((movement) => {
            const newMovement = {
                idInvoice: Number(invoice),
                idMovement: Number(newID),
                idProduct: Number(movement.id),
                quantity: Number(movement.newQuantStock)
            }
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Movements').child(Number(newID)).set(newMovement);
            if(update){
                app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(movement.id)).child('quantStock').set(Number(movement.newQuantity));
            }
            newID++;
        });

    }

    const editMovements = async (movements, update) => {
        if(movements.length < 0){
            return;
        }
        await movements.map((movement) => {
            const newMovement = {
                idInvoice: Number(movement.idInvoice),
                idMovement: Number(movement.idMovement),
                idProduct: Number(movement.idProduct),
                quantity: Number(movement.quantity)
            }
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Movements').child(Number(movement.idMovement)).set(newMovement);
            if(update){         
                app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(movement.idProduct)).child('quantStock').set(Number(movement.newQuantity));
            }
        });
    }

    const deleteMovements = async (movements, update) => {
        if(movements.length < 0){
            return;
        }
        await movements.map((movement) => {
            app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Movements').child(Number(movement.idMovement)).remove();
            if(update){
                app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Products').child(Number(movement.idProduct)).child('quantStock').set(Number(movement.newQuantity));
            }
        });
    }
    const editInvoice = async (invoice, movementsToCreate, movementsToUpdate, movementsToDelete) => {
        setLoading(true);
        var newMovementID = Number(lastMovementKey) + 1;
        const newInvoice = {
            id: invoice.id, 
            description: invoice?.description ? String(invoice?.description) : null,
            date: invoice?.date ? String(invoice?.date) : null,
            type: String(invoice.type)
        };
        app.database().ref('/companyData/' + currentUser.companyInfo.id + '/Invoices').child(invoice.id).set(newInvoice);
        await createMovements(movementsToCreate, newMovementID, invoice.id, invoice.updateStock); 
        await editMovements(movementsToUpdate, invoice.updateStock);
        await deleteMovements(movementsToDelete, invoice.updateStock);
        setLoading(false);
        props.history.push('/invoices');
        addToast('Invoice ' + newInvoice.id + ' edited with success', { appearance: 'success', autoDismiss: 'true' });
    }

    if (!props.location.state.selectedInvoice) {
        return <Redirect to="/invoices" />;
    }

    return (oldMovements && !loading ?
        <>
            <h1>Edit Invoice: {props.location.state.selectedInvoice.id}</h1>
            <InvoiceForm invoice={props.location.state.selectedInvoice} edit={true} oldMovements={oldMovements} onSubmit={editInvoice}/>
        </> : <Loading />
    )
}

export default withRouter(EditInvoice);