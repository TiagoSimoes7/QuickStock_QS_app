import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../base.js";
import { AuthContext } from "../Auth.js";
import { Card, Form, Button, Image } from "react-bootstrap";
import { useToasts } from 'react-toast-notifications';
import { validateEmail } from "../utils/funcs.js";

const SignUp = ({history}) => {
    const { addToast } = useToasts();

    const handleSignUp = useCallback(
        async event => {
            event.preventDefault();         
            const { email, password, token } = event.target.elements;
            if(email.value === ""){
                addToast("Email field is required", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            if(password.value === ""){
                addToast("Password field is required", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            if(password.value.length < 6){
                addToast("Password must have at least six characters", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            if(token.value === ""){
                addToast("Token field is required", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            if(token.value.length !== 26){
                addToast("Invalid Token", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            try {
                // check if token exist
                const companyID = await app.database().ref('/token/' + token.value).get().then(snapshot => {
                    return snapshot.val();
                });
                if (companyID == undefined) {
                    addToast("Token not exists", { appearance: 'error', autoDismiss: 'true' });
                    return;
                }

                // get company
                const companyData = await app.database().ref(`/companyData/${companyID}/Information`).get().then(snapshot => {
                    return snapshot.val();
                });

                // verify new email
                if (!validateEmail(`${email.value}@quickstock.${companyData.name}.com`)) {
                    addToast("Email invalid", { appearance: 'error', autoDismiss: 'true' });
                    return;
                }
                const lastUserID = await app.database().ref(`/quickStockUsers`).limitToLast(1).get().then(snapshot => {
                    return Number(Object.keys(snapshot.val())[0]);
                });
                
                const newUser = {
                    companyId: Number(companyID),
                    email: `${email.value}@quickstock.${companyData.name}.com`,
                    id: Number(lastUserID + 1),
                    password: password.value,
                    role: "Manager",
                    username: email.value,
                }

                // create account
                await app.auth().createUserWithEmailAndPassword(`${email.value}@quickstock.${companyData.name}.com`, password.value);

                app.database().ref('quickStockUsers/' + Number(lastUserID + 1)).set(newUser);
                addToast(`User ${email.value}@quickstock.${companyData.name}.com created `, { appearance: 'success', autoDismiss: 'true' });
                history.push("/");
            } catch (error) {
                addToast(error.message, { appearance: 'error', autoDismiss: 'true' });
            }
        }, [history]
    );

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to="/" />;
    }

    return (
        <Card className="card bg-light" 
        style={{width: '555px', height: '490px', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, margin: 'auto'}}>
            <Card.Body>
            <div style={{display: 'grid'}}>
                <Image
                    style={{margin: 'auto', marginTop: '15px', marginBottom: '15px'}}
                    alt=""
                    src="../images/quickStockBlack.png"
                    width="400"
                    height="90"
                    className="d-inline-block align-top"
                    fluid 
                    />
            </div>
            <h3 className="text-secondary" style={{textAlign: 'center'}}>Sign Up</h3>
            <br />
            <Form onSubmit={handleSignUp}>
                <Form.Group controlId="inputEmail">
                    <Form.Label>Local part of Email</Form.Label>
                    <Form.Control name="email" type="text" placeholder="Enter your local part of the new email" />
                    <Form.Text style={{ float: 'right' }} className="text-muted">
                        Only input local part don't input domain
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="inputPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Enter your password" />
                </Form.Group>
                <Form.Group controlId="inputToken">
                    <Form.Label>Company Token</Form.Label>
                    <Form.Control name="token" type="text" placeholder="Enter your company token" />
                </Form.Group>
                <div style={{marginTop: '10px', textAlign: 'right'}}>
                    <Form.Text style={{float: 'left', fontSize: '100%'}} className="text-muted">
                        <a className="font-weight-bold" style={{cursor: "pointer",  marginLeft:'3px', color: 'black'}} onClick={() => history.push('/login')}>Back to login</a>
                    </Form.Text>
                    <Button style={{width: '150px'}}type="submit">
                        Sign Up
                    </Button>
                </div>
            </Form>
            </ Card.Body>
        </Card>
    );
};

export default withRouter(SignUp);