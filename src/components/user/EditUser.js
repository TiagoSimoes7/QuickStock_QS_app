import { useContext, useState } from 'react';
import ChangePasswordForm from '../../utils/forms/changePassword';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import firebase from 'firebase';
import { Loading } from '../../utils/loading';
import { Badge } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

const EditUser = () => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [ loading, setLoading ] = useState(false)
    const changePassword = (password) => {
        setLoading(true);
        app.database().ref('/quickStockUsers').once('value', snapshot => {
            const userExist = snapshot.val().filter(u => { return (u.email === currentUser.email) })[0];
            if (password === userExist.password) {
                setLoading(false);
                addToast('The password is the same', { appearance: 'error', autoDismiss: 'true' });
                return;
            }
            if (!userExist) {
                setLoading(false);
                addToast('Something whent wrong, please contact support', { appearance: 'error', autoDismiss: 'true' });
                return;
            }
            var credentials = firebase.auth.EmailAuthProvider.credential(userExist.email, userExist.password.toString());
            app.auth().currentUser.reauthenticateWithCredential(credentials).then(() => {
                app.auth().currentUser.updatePassword(password).then(() => {
                    app.database().ref(`/quickStockUsers`).child(userExist.id).child('password').set(password);
                    setLoading(false);
                    addToast('Password updadted with success', { appearance: 'success', autoDismiss: 'true' });
                }).catch((error) => { console.log(error); });
            });
        });

    }
    return (
        <>
            <h1>Edit your account</h1>
            <br />
            <br />
            <h5 style={{display: 'flex'}}>Email <Badge variant="primary" style={{marginLeft: '5px'}}>{currentUser?.email}</Badge></h5>
            <br />
            {loading ? <Loading /> : <ChangePasswordForm onSubmit={changePassword} /> }
            
        </>
    );
}

export default EditUser;