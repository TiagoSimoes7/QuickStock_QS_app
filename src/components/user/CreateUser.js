import { useContext, useEffect } from 'react';
import { withRouter } from 'react-router';
import UserForm from '../../utils/forms/user';
import { AuthContext } from "../../Auth";
import app from "../../base.js";
import { createUserService } from '../../utils/secondaryApp';
import { useToasts } from 'react-toast-notifications';

const CreateUser = (props) => {
    const {addToast} = useToasts();
    const { currentUser } = useContext(AuthContext);

    useEffect( () => {
        if(currentUser?.role === 'Manager'){
            props.history.push('/')
        }
    },[currentUser]);

    const createUser = (user) => {
        app.database().ref('/quickStockUsers').once('value', snapshot => {
            if(snapshot.val().some(u => u.email === user.email)){
                addToast('User already exist', { appearance: 'error', autoDismiss: 'true' })
                return;
            }
            const newId = snapshot.val()[snapshot.val().length - 1].id + 1;
            createUserService(user.email, user.password);
            delete user.confirmPassword;
            app.database().ref('/quickStockUsers').child(Number(newId)).set({...user, id: Number(newId), companyId: currentUser.companyInfo.id, username: user.username})
            .then(() => {props.history.push('/manageUsers'); addToast('User ' + user.email + ' created with success', { appearance: 'success', autoDismiss: 'true' })}).catch(error => console.log(error));
        });
    }

    return (
        <>
            <h1>Create new User</h1>
            <UserForm user={null} onSubmit={createUser}/>
        </>
    )
}

export default withRouter(CreateUser);