import { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Form, Button, Card } from 'react-bootstrap';

const ChangePasswordForm = (props) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [validInputs, setValidInputs] = useState(false);

    useEffect(() => {
        if (!newPassword || !confirmNewPassword) {
            setValidInputs(true);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setValidInputs(true);
            return;
        }
        if (newPassword.length < 5) {
            setValidInputs(true);
            return;
        }
        setValidInputs(false);
    }, [newPassword, confirmNewPassword])

    return (
        <>
        <h4 style={{ marginTop: '10px' }}>Change password</h4>
        <Card>
            <Card.Body>
                <Form>
                    
                    <Form.Group controlId="inputPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control placeholder="Enter the new password" type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="inputConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control placeholder="Confirm the new password" type='password' value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
                    </Form.Group>
                    <div style={{ float: 'right' }}>
                        <Button style={{ width: '150px' }} disabled={validInputs} onClick={() => props.onSubmit(newPassword)} variant="primary">
                            Submit
                        </Button>
                    </div>
                    <br />
                    <br />
                    <Form.Text style={{ float: 'right' }} className="text-muted">
                        The change password button will be available when the required fields are filled correctly
                    </Form.Text>
                </Form>
            </Card.Body>
        </Card>
        </>
    );
}

export default withRouter(ChangePasswordForm)