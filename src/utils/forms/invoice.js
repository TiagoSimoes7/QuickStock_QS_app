import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form, Button, Card } from 'react-bootstrap';
import TablesCycle from '../tables/tablesCycle';
import { useToasts } from 'react-toast-notifications';
import { Asterisk } from 'react-bootstrap-icons';

const InvoiceForm = (props) => {
    const { addToast } = useToasts();
    const [newInvoice, setNewInvoice] = useState(props.invoice ? { ...props.invoice, updateStock: true } : { type: 'OUT', updateStock: true });
    const [validInputs, setValidInputs] = useState(false);
    const [movements, setMovements] = useState(props.oldMovements ? props.oldMovements : []);
    const [products, setProducts] = useState([]);
    const getDataOfProduct = (data) => setMovements(data);
    const getFullProducts = (data) => setProducts(data);

    useEffect(() => {
        if (!newInvoice) {
            setValidInputs(true);
            return;
        }
        if (!newInvoice?.date || !newInvoice?.type || movements.length === 0) {
            setValidInputs(true);
            return;
        }
        if (movements.lenght === 0){
            setValidInputs(true);
            return;
        }
        setValidInputs(false);
    }, [newInvoice, movements]);

    const checkValueOfInputs = () => {
        let movementsToCreate = [];
        let movementsToDelete = props.oldMovements;
        let movementsToUpdate = [];
        let withNull = false;
        let validQuantity = true;
        if (!props.edit) {
            if (newInvoice.type === "OUT") {
                movements.map(movement => {
                    if (!movement.newQuantStock || movement.newQuantStock <= 0 || newInvoice.updateStock ? movement.newQuantStock > movement.quantStock : false) {
                        withNull = true;
                    }
                });
            }else{
                movements.map(movement => {
                    if (!movement.newQuantStock || movement.newQuantStock <= 0) {
                        withNull = true;
                    }
                });
            }
        }
        if (props.edit && (newInvoice.type === props.invoice.type)) {
            movementsToUpdate = movements.map(movement => {
                if(!movement.newQuantStock || movement.newQuantStock <= 0){
                    withNull = true;
                }
                const product = movementsToDelete.filter(m => m.idProduct === movement.id);
                if (product.length) {
                    movementsToDelete = movementsToDelete.filter(m => (m.idProduct !== movement.id));
                    if (product[0].quantity !== movement.newQuantStock) {
                        const newQuantity = newInvoice.type === "IN" ? (movement.quantStock - product[0].quantity) + movement.newQuantStock : (movement.quantStock + product[0].quantity) - movement.newQuantStock;
                        if (newQuantity < 0)
                            validQuantity = false;
                        return { ...product[0], newQuantity: newQuantity, quantity: movement.newQuantStock };
                    }
                } else {
                    const newQuantity = newInvoice.type === "IN" ? movement.quantStock + movement.newQuantStock : movement.quantStock - movement.newQuantStock;
                    if (newQuantity < 0)
                        validQuantity = false;
                    movementsToCreate.push({ ...movement, newQuantity: newQuantity });
                }
            });
            movementsToUpdate = movementsToUpdate.filter(m => m !== undefined);
            movementsToDelete = movementsToDelete.map((movement) => {
                const product = products.filter(m => m.id === movement.idProduct);
                const newQuantity = newInvoice.type === "IN" ? product[0].quantStock - movement.quantity : product[0].quantStock + movement.quantity;
                if (newQuantity < 0)
                    validQuantity = false;

                return { ...product[0], newQuantity: newQuantity };
            });
        }

        if (props.edit && (newInvoice.type !== props.invoice.type)) {
            movementsToUpdate = movements.map(movement => {
                if(!movement.newQuantStock || movement.newQuantStock <= 0){
                    withNull = true;
                }
                const product = movementsToDelete.filter(m => m.idProduct === movement.id);
                if (product.length) {
                    movementsToDelete = movementsToDelete.filter(m => (m.idProduct !== movement.id));
                    const newQuantity = newInvoice.type === "IN" ? movement.quantStock + movement.newQuantStock : movement.quantStock - movement.newQuantStock;
                    if (newQuantity < 0)
                        validQuantity = false;
                    return { ...product[0], newQuantity: newQuantity, quantity: movement.newQuantStock };
                } else {
                    const newQuantity = newInvoice.type === "IN" ? movement.quantStock + movement.newQuantStock : movement.quantStock - movement.newQuantStock;
                    if (newQuantity < 0)
                        validQuantity = false;
                    movementsToCreate.push({ ...movement, newQuantity: newQuantity });
                }
            });
            movementsToUpdate = movementsToUpdate.filter(m => m !== undefined);
            movementsToDelete = movementsToDelete.map((movement) => {
                const product = products.filter(m => m.id === movement.idProduct);
                const newQuantity = newInvoice.type === "IN" ? product[0].quantStock - movement.quantity : product[0].quantStock + movement.quantity;
                if (newQuantity < 0)
                    validQuantity = false;

                return { ...product[0], newQuantity: newQuantity };
            });
        }
        if(!withNull){
            if (!newInvoice.updateStock && props.edit) {
                props.onSubmit(newInvoice, movementsToCreate, movementsToUpdate, movementsToDelete);
                return;
            }
            if (validQuantity && props.edit) {
                props.onSubmit(newInvoice, movementsToCreate, movementsToUpdate, movementsToDelete);
                return;
            }
            if (validQuantity) {
                props.onSubmit(newInvoice, movements, newInvoice.updateStock);
                return;
            }
        }
        addToast('The quantity insert in the products is greater than the stock, null, or is smaller than 1, please verify the fields', { appearance: 'error', autoDismiss: 'true' });
    }

    return (
        <Card style={{marginTop: '10px', minHeight: '820px', maxHeight: '820px'}}>
            <Card.Body>
                <Form>
                    <Form.Group controlId="inputDate">
                        <Form.Label>Date <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                        <Form.Control placeholder="Enter the Date" type="date" value={newInvoice?.date} onChange={e => setNewInvoice({ ...newInvoice, date: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="inputDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control placeholder="Enter a Description" value={newInvoice?.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} />
                    </Form.Group>
                    <Form.Group controlId="inputType">
                        <Form.Label>Type <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                        <Form.Check
                            name="typeInvoice"
                            id={"OUT"}
                            label={"Out"}
                            type={'radio'}
                            checked={newInvoice?.type === 'OUT' ? true : false}
                            onChange={e => setNewInvoice({ ...newInvoice, type: e.target.id })}
                        />
                        <Form.Check
                            name="typeInvoice"
                            id={"IN"}
                            label={"In"}
                            type={'radio'}
                            checked={newInvoice?.type === 'IN' ? true : false}
                            onChange={e => setNewInvoice({ ...newInvoice, type: e.target.id })}
                        />
                    </Form.Group>
                    <Form.Group controlId="inputUpdateStock">
                        <Form.Check
                            type="checkbox"
                            label="I want to update the stock of the products"
                            checked={newInvoice?.updateStock}
                            onChange={e => setNewInvoice({ ...newInvoice, updateStock: e.target.checked })}
                        />
                    </Form.Group>
                    {movements ? <TablesCycle oldMovements={props.oldMovements} newProductArray={getDataOfProduct} products={getFullProducts} edit={props.edit} /> : null}
                    <br />
                    <br />
                    <div style={{float: 'right'}}>
                        <Button style={{marginRight: '20px', width:'150px'}} disabled={validInputs} onClick={() => checkValueOfInputs()} variant="primary">
                            Submit
                        </Button>
                        <Button style={{width:'150px'}} onClick={() => props.history.push('/invoices')} variant="danger">
                            Cancel
                        </Button>
                    </div>
                    <br />
                    <br />
                    <Form.Text style={{float: 'right'}} className="text-muted">
                        The submit button will be available when the required fields are filled correctly
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default withRouter(InvoiceForm)