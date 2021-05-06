import { makeStyles } from '@material-ui/core';
import { useState, useContext } from 'react';
import {Table, Button, ButtonGroup, Modal, Form} from 'react-bootstrap';
import { withRouter } from "react-router";
import { AuthContext } from '../../Auth.js';
import app from "../../base.js";
import { deleteUserService } from "../../utils/secondaryApp";
import { useToasts } from 'react-toast-notifications';
import { capitalizeFirstLetter } from '../funcs.js';

const useStyle = makeStyles({
    header: {
        '& tr': {
            '& th': {
                position: 'sticky',
                top: 0,
                backgroundColor: 'white',
                zIndex: 1,
            }
        }
    },
});
const UsersTable = (props) => {
    const { addToast } = useToasts();
    const classes = useStyle();
    const { currentUser } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [type, setType] = useState(null);

    const handleShow = (user, type) => {setSelectedUser(user); setType(type)};

    const handleClose = () => setSelectedUser(null);

    const changeRole = () => {
        app.database().ref(`/quickStockUsers`).child(selectedUser.id).set({...selectedUser, role: type });
        setSelectedUser(null);
        props.history.push('/manageUsers');
        addToast('User ' + capitalizeFirstLetter(selectedUser.username) + ' role changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const deleteUser = () => {
        deleteUserService(selectedUser.email, selectedUser.password);
        app.database().ref(`/quickStockUsers`).child(selectedUser.id).remove();
        setSelectedUser(null);
        props.history.push('/manageUsers');
        addToast('User ' + capitalizeFirstLetter(selectedUser.username) + ' deleted with success', { appearance: 'success', autoDismiss: 'true' });
    }

    return (
    <>
    <Table responsive striped bordered hover>
        <thead className={classes.header}>
            <tr>
            <th style={{textAlign: 'center'}}>Username</th>
            <th style={{textAlign: 'center'}}>Email</th>
            <th style={{textAlign: 'center'}}>Role</th>
            <th style={{width: '450px', textAlign: 'center'}}>Actions</th>
            </tr>
        </thead>
        <tbody>
            {props.users.map((user, key) => {
                return (
                    <tr key={key}>
                        <td style={{textAlign: 'center'}}>{user.username}</td>
                        <td style={{textAlign: 'center'}}>{user.email}</td>
                        <td style={{textAlign: 'center'}}>{user.role}</td>
                        <td>
                        <ButtonGroup style={{display: 'flex'}}>
                            <Button variant="info" disabled={user.role === 'Super Administrator' ? true : false} onClick={() => handleShow(user, user.role)}>Change Role</Button>
                            <Button variant="danger" disabled={user.role === 'Super Administrator' || currentUser?.email === user.email ? true : false} onClick={() => handleShow(user, 'delete')}>Delete User</Button>
                        </ButtonGroup>
                        </td>
                    </tr>)
            })}
        </tbody>
    </Table>
    <Modal show={selectedUser} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
              { type === 'delete' ? `Are you sure you want to delete user ${capitalizeFirstLetter(selectedUser?.username)}?` 
              : `Choose Role of user ${capitalizeFirstLetter(selectedUser?.username)}?`}
        </Modal.Title>
        </Modal.Header>
        {type !== 'delete' ?
            <Modal.Body>
                <Form>
                    <Form.Group controlId="control">
                        <Form.Label>Role:</Form.Label>
                        <Form.Control as="select" defaultValue={type} onChange={e => setType(e.target.value) }>
                        <option value={'Administrator'}>Administrator</option>
                        <option value={'Manager'}>Manager</option>
                        <option value={'Warehouse employee'}>Warehouse employee</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
        : null}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant={ type === 'delete' ? "danger" : "success"} onClick={type === 'delete' ? deleteUser : changeRole}>
            { type === 'delete' ? 'Delete User' : 'Change Role' }
          </Button>
        </Modal.Footer>
      </Modal>
    </>);
}

export default withRouter(UsersTable);