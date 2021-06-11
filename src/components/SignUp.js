import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../base.js";
import { AuthContext } from "../Auth.js";
import { Card, Form, Button, Image } from "react-bootstrap";
import { useToasts } from 'react-toast-notifications'

const SignUp = ({history}) => {
    const { addToast } = useToasts();
/*     const handleLogin = useCallback(
        async event => {
            event.preventDefault();
            const { email, password } = event.target.elements;
            if(email.value === ""){
                addToast("Email field is required", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            if(password.value === ""){
                addToast("Password field is required", { appearance: 'error', autoDismiss: 'true' });
                return;
            }

            try {
                await app.auth().signInWithEmailAndPassword(email.value, password.value);
                history.push("/");
            } catch (error) {
                addToast(error.message, { appearance: 'error', autoDismiss: 'true' });
            }
        }, [history]
    ); */
    const handleSignUp = () => {

    }
    const { currentUser } = useContext(AuthContext);

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
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group controlId="inputPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Enter your password" />
                </Form.Group>
                <Form.Group controlId="inputToken">
                    <Form.Label>Company Token</Form.Label>
                    <Form.Control name="token" type="token" placeholder="Enter your company token" />
                </Form.Group>
                <div style={{marginTop: '10px', textAlign: 'right'}}>
                    <Form.Text style={{float: 'left', fontSize: '100%'}} className="text-muted">
                        <a class="font-weight-bold" style={{cursor: "pointer",  marginLeft:'3px', color: 'black'}} onClick={() => history.push('/login')}>Back to login</a>
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