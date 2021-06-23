import { Button, Modal, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Auth";
import app from "../../base";
import { capitalizeFirstLetter } from "../../utils/funcs";
import { Loading } from "../../utils/loading";
import { useToasts } from 'react-toast-notifications';
import { InfoCircle } from "react-bootstrap-icons";

const Company = () => {
    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [changeLocation, setChangeLocation] = useState(false);
    const [locationData, setLocationData] = useState('');
    const [changeEmail, setChangeEmail] = useState(false);
    const [emailData, setEmailData] = useState('');
    const [validInput, setValidInput] = useState(false);

    {/*2. Const active serChanfeLocation (in bottom of the page) for true */}
    const handleShow = () => setChangeLocation(true);
    {/*2. Const disable setChangeLocation and parameter of setLocationData is null */}
    const handleClose = () => {setChangeLocation(false);setLocationData(null)};

     {/*Email */}
    const handleShowEmail = () => setChangeEmail(true);
    const handleCloseEmail = () => {setChangeEmail(false);setEmailData(null)};
   

    useEffect(() => {
        getCompanyData(currentUser?.companyInfo)
    });

    useEffect(() => {
        if (!locationData ) {
            setValidInput(true);
            return;
        } 
        setValidInput(false);
    }, [locationData]);

    useEffect(() => {
        if (!emailData ) {
            setValidInput(true);
            return;
        } 
        setValidInput(false);
    }, [emailData]);

    {/*Function updateLocation */}
    const updateLocation = () => {
        {/*If location is empty  */}
        if(locationData === ''){
            handleClose(); {/*Close text and visible Toast with error  */}
            addToast('The input of location is empty', { appearance: 'error', autoDismiss: 'true' });
        }{/*Else  */}
        {/*And in Firebase child with localization   */}
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('local').set(String(locationData));
        {/*Close Modal box */}
        handleClose();
        {/* Show Toast with message sucess*/}
        addToast('Location changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const updateEmail = () => {
        {/*If location is empty  */}
        if(emailData === ''){
            handleCloseEmail(); {/*Close text and visible Toast with error  */}
            addToast('The input of email is empty', { appearance: 'error', autoDismiss: 'true' });
        }{/*Else  */}
        {/*And in Firebase child with localization   */}
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('email').set(String(emailData));
        {/*Close Modal box */}
        handleCloseEmail();
        {/* Show Toast with message sucess*/}
        addToast('Email changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

     {/*Function for get data of company*/}
    const getCompanyData = (company) => {
        {/*If company not null*/}
        if(company){
            {/*Get values and*/}
            app.database().ref('/companyData/' + company.id + '/Information').on('value', snapshot => {
                if(companyInfo === null){
                     {/*Get add Company info*/}
                    setCompanyInfo(snapshot.val());
                }
            })
        }
    }

    return(
        <>
            {companyInfo ? 
                <>
                    
                    <div style={{display: 'inline-flex'}}>
                        {/*Title with name company*/}
                        <h1>Company {capitalizeFirstLetter(companyInfo.name)}</h1>
                        {/*Information on left title (OvelayTrigger)*/}
                        <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">If you want to change the company name please contact our support</Tooltip>}>
                            <InfoCircle size={30} style={{color: '#007bff', marginLeft: '5px', marginTop: '10px'}}/>
                        </OverlayTrigger>
                    </div>
                    
                    <br />
                    <br />

                    {/*Create card*/}
                    <Card style={{marginTop: '10px'}}>
                        {/*Create body*/}
                        <Card.Body>
                        <div style={{display: 'inline-flex'}}>
                            {/* Location of company               get local of company*/}
                            <h3>Location: {capitalizeFirstLetter(companyInfo.local)}</h3>
                             {/* Create button in left of location for change localization */}
                             {/*   ocupar td o espaço que pode       marginright   encostar a esquerda*/}     {/*1. onClick to const in toppage  a*/}
                            <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShow()}>Change Location</Button>
                        </div>
                        </Card.Body>
                    </Card>
                    {/*3. Show Modal to form chenge location*/}
                    <Modal show={changeLocation} onHide={handleClose}>
                        {/*Create header with close button*/}
                        <Modal.Header closeButton>
                        {/*Title */}
                        <Modal.Title>Input the name of the location</Modal.Title>
                        </Modal.Header>
                        {/*Create body of Modal*/}
                        <Modal.Body>
                            {/*Create Form with id = */}
                            <Form.Group controlId="inputLocation">
                                <Form.Label>Location</Form.Label>
                                {/*Create textfield with text ---------------   o valor = a variavel  onChange = deteta quando o valor na caixa de texto é alterado e adiciona lo a locationData*/}
                                <Form.Control placeholder="Enter the Location" value={locationData} onChange={e => setLocationData(e.target.value) } />
                            </Form.Group>
                        </Modal.Body>
                         {/*Create footer of Modal*/}
                        <Modal.Footer>
                        {/*Create button  style      1.onClick = close to top page*/}
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        {/*Button , desativo caso o campo esteija mal inserido    Onclick to function updateLocation*/}
                        <Button disabled={validInput} variant="success" onClick={updateLocation}>
                            Change Location
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Card style={{marginTop: '10px'}}>
                        {/*Create body*/}
                        <Card.Body>
                        <div style={{display: 'inline-flex'}}>
                            {/* Location of company               get local of company*/}
                            <h3>Email: {capitalizeFirstLetter(companyInfo.email)}</h3>
                             {/* Create button in left of location for change localization */}
                             {/*   ocupar td o espaço que pode       marginright   encostar a esquerda*/}     {/*1. onClick to const in toppage  a*/}
                            <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowEmail()}>Change Email</Button>
                        </div>
                        </Card.Body>
                    </Card>
                    <Modal show={changeEmail} onHide={handleCloseEmail}>
                        {/*Create header with close button*/}
                        <Modal.Header closeButton>
                        {/*Title */}
                        <Modal.Title>Input the email of the company</Modal.Title>
                        </Modal.Header>
                        {/*Create body of Modal*/}
                        <Modal.Body>
                            {/*Create Form with id = */}
                            <Form.Group controlId="inputEmail">
                                <Form.Label>Email</Form.Label>
                                {/*Create textfield with text ---------------   o valor = a variavel  onChange = deteta quando o valor na caixa de texto é alterado e adiciona lo a locationData*/}
                                <Form.Control placeholder="Enter the Email" value={emailData} onChange={e => setEmailData(e.target.value) } />
                            </Form.Group>
                        </Modal.Body>
                         {/*Create footer of Modal*/}
                        <Modal.Footer>
                        {/*Create button  style      1.onClick = close to top page*/}
                        <Button variant="secondary" onClick={handleCloseEmail}>
                            Close
                        </Button>
                        {/*Button , desativo caso o campo esteija mal inserido    Onclick to function updateLocation*/}
                        <Button disabled={validInput} variant="success" onClick={updateEmail}>
                            Change Email
                        </Button>
                        </Modal.Footer>
                    </Modal>

                </>
            : <Loading />}
        </>
    )
}

export default Company;