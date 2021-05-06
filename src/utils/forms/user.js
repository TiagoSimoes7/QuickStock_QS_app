import { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { Form, Button, InputGroup, Card } from 'react-bootstrap';
import { AuthContext } from '../../Auth';
import { Asterisk } from 'react-bootstrap-icons';

const UserForm = (props) => {
    const { currentUser } = useContext(AuthContext);
    const [newUser, setNewUser] = useState(props.user ? props.user : {role: 'Administrator'});
    const [validInputs, setValidInputs] = useState(false);
    const infoEmail = `@quickstock.${currentUser?.companyInfo.name}.com`;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    useEffect(() => {
        if (!newUser) {
            setValidInputs(true);
            return;
        }
        if (!newUser?.email || !newUser?.password || !newUser?.confirmPassword || !newUser?.role) {
            setValidInputs(true);
            return;
        }
        if (newUser?.password !== newUser?.confirmPassword || newUser?.password.length < 5) {
            setValidInputs(true);
            return;
        }
        if (!re.test(newUser?.email + infoEmail)) {
            setValidInputs(true);
            return;
        }
        setValidInputs(false);
    }, [newUser])

    return (
        <Card style={{marginTop: '10px'}}>
            <Card.Body>
            <Form>
                <Form.Group controlId="inputName">
                    <Form.Label>Email <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                    <InputGroup>
                        <Form.Control placeholder="Enter the username of the email" value={newUser?.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                        <InputGroup.Append>
                            <InputGroup.Text>{infoEmail}</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                        Just enter the email username, the domain will be inserted automatically
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="control">
                    <Form.Label>Role: <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                    <Form.Control as="select" defaultValue={newUser?.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value={'Administrator'}>Administrator</option>
                        <option value={'Manager'}>Manager</option>
                        <option value={'Warehouse employee'}>Warehouse employee</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="inputPassword">
                    <Form.Label>Password <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                    <Form.Control type='password' placeholder="Enter a Password" value={newUser?.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="inputDescription">
                    <Form.Label>Confirm Password <Asterisk style={{ marginBottom: '3px', color: '#bd2130' }} size={11} /></Form.Label>
                    <Form.Control type='password' placeholder="Confirm the Password" value={newUser?.confirmPassword} onChange={e => setNewUser({ ...newUser, confirmPassword: e.target.value })} />
                </Form.Group>
                <div style={{float: 'right'}}>
                        <Button style={{marginRight: '20px', width:'150px'}} disabled={validInputs} onClick={() => props.onSubmit({...newUser, email: newUser.email + infoEmail, username: newUser.email})} variant="primary">
                            Submit
                        </Button>
                        <Button style={{width:'150px'}} onClick={() => props.history.push('/manageUsers')} variant="danger">
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

export default withRouter(UserForm)