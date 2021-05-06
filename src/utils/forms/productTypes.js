import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form, Button, Card } from 'react-bootstrap';
import { Asterisk } from 'react-bootstrap-icons';

const ProductTypeForm = (props) => {
    const [newProductType, setNewProductType] = useState(props.productType);
    const [validInputs, setValidInputs] = useState(false);

    useEffect(() => {
        if (!newProductType) {
            setValidInputs(true);
            return;
        }
        if (!newProductType?.type) {
            setValidInputs(true);
            return;
        }
        setValidInputs(false);
    }, [newProductType]);

    return (
        <Card style={{marginTop: '10px'}}>
            <Card.Body>
                <Form>
                    <Form.Group controlId="inputName">
                        <Form.Label>Type <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                        <Form.Control placeholder="Enter the type name" value={newProductType?.type} onChange={e => setNewProductType({ ...newProductType, type: e.target.value })} />
                    </Form.Group>

                    <div style={{ float: 'right' }}>
                        <Button style={{ marginRight: '20px', width: '150px' }} disabled={validInputs} onClick={() => props.onSubmit(newProductType)} variant="primary">
                            Submit
                        </Button>
                        <Button style={{ width: '150px' }} onClick={() => props.history.push('/productTypes')} variant="danger">
                            Cancel
                        </Button>
                    </div>
                    <br />
                    <br />
                    <Form.Text style={{ float: 'right' }} className="text-muted">
                        The submit button will be available when the required fields are filled correctly
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default withRouter(ProductTypeForm)