import { Button, Modal, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Auth";
import app from "../../base";
import { capitalizeFirstLetter } from "../../utils/funcs";
import { Loading } from "../../utils/loading";
import { useToasts } from 'react-toast-notifications';
import { InfoCircle } from "react-bootstrap-icons";
import Countries from "./countries.json";

const Company = () => {

    const { addToast } = useToasts();
    const { currentUser } = useContext(AuthContext);
    const [companyInfo, setCompanyInfo] = useState(null);
    const [changeLocation, setChangeLocation] = useState(false);
    const [locationData, setLocationData] = useState('');
    
    const [changeEmail, setChangeEmail] = useState(false);
    const [emailData, setEmailData] = useState('');
    
    const [changeCountry, setChangeCountry] = useState(false);
    const [countryData, setCountryData] = useState('');
    
    const [changeDistrict, setChangeDistrict] = useState(false);
    const [districtData, setDistrictData] = useState('');
    

    const [changeAddress, setChangeAddress] = useState(false);
    const [addressData, setAddressData] = useState('');

    const [changePostalCode, setChangePostalCode] = useState(false);
    const [postalcodeData, setPostalCodeData] = useState('');

    const [changePhoneNumber, setChangePhoneNumber] = useState(false);
    const [phonenumberData, setPhoneNumberData] = useState('');

    const [validInput, setValidInput] = useState(false);

    {/*2. Const active serChanfeLocation (in bottom of the page) for true */}
    const handleShow = () => setChangeLocation(true);
    {/*2. Const disable setChangeLocation and parameter of setLocationData is null */}
    const handleClose = () => {setChangeLocation(false);setLocationData(null)};

    {/*Email */}
    const handleShowEmail = () => setChangeEmail(true);
    const handleCloseEmail = () => {setChangeEmail(false);setEmailData(null)};
   
    {/*Country */}
    const handleShowCountry = () => setChangeCountry(true);
    const handleCloseCountry = () => {setChangeCountry(false);setCountryData(null)};

    {/*District*/}
    const handleShowDistrict = () => setChangeDistrict(true);
    const handleCloseDistrict = () => {setChangeDistrict(false);setDistrictData(null)};

    {/*Address*/}
    const handleShowAddress = () => setChangeAddress(true);
    const handleCloseAddress = () => {setChangeAddress(false);setAddressData(null)};

    {/*PostalCode*/}
    const handleShowPostalCode = () => setChangePostalCode(true);
    const handleClosePostalCode = () => {setChangePostalCode(false);setPostalCodeData(null)};

    {/*PhoneNumber*/}
    const handleShowPhoneNumber = () => setChangePhoneNumber(true);
    const handleClosePhoneNumber = () => {setChangePhoneNumber(false);setPhoneNumberData(null)};

    
    console.log(Countries.countries);
    
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

    useEffect(() => {
        if (!countryData ) {
            setValidInput(true);
            return;
        } 
        setValidInput(false);
    }, [countryData]);

    useEffect(() => {
        if (!districtData ) {
            setValidInput(true);
            return;
        } 
        setValidInput(false);
    }, [districtData]);

    useEffect(() => {
        if (!addressData ) {
            setValidInput(true);
            return;
        } 
        setValidInput(false);
    }, [addressData]);

    useEffect(() => {
        let isDisable= /^[0-9]*$/.test(phonenumberData);
        if (!phonenumberData ) {
            setValidInput(true);
            return;
        }else if(isDisable) {
            setValidInput(false);
            return;
        } 
        
    }, [phonenumberData]);

    useEffect(() => {
        let isAvalible = /^[0-9.-]*$/.test(postalcodeData);
        let isDisable= /^[0-9]*$/.test(postalcodeData);
        if (!postalcodeData || !isAvalible || isDisable ) {
            setValidInput(true);
            return;
        } else {
            setValidInput(false);
            return;
        }
        
    }, [postalcodeData]);

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

    const updateCountry = () => {
        if(countryData === ''){
            handleCloseCountry();
            addToast('The input of country is empty', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('pais').set(String(countryData));
        handleCloseCountry();
        addToast('Country changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const updateDistrict = () => {
        if(districtData === ''){
            handleCloseDistrict();
            addToast('The input of district is empty', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('distrito').set(String(districtData));
        handleCloseDistrict();
        addToast('District changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const updateAddress = () => {
        if(addressData === ''){
            handleCloseAddress();
            addToast('The input of address is empty', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('rua').set(String(addressData));
        handleCloseAddress();
        addToast('Address changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const updatePostalCode = () => {
        let isAvalible = /^[0-9.-]*$/.test(postalcodeData);
        let isDisable= /^[0-9]*$/.test(postalcodeData);
        if(postalcodeData === '' || !isAvalible || isDisable ){
            handleClosePostalCode();
            addToast('The input of Postal Code is empty and need contais', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('codpostal').set(String(postalcodeData));
        handleClosePostalCode();
        addToast('Postal Code changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const updatePhoneNumber = () => {
        if(phonenumberData === ''){
            handleClosePhoneNumber();
            addToast('The input of Phone Number is empty', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('telefone').set(String(phonenumberData));
        handleClosePhoneNumber();
        addToast('Phone Number changed with success', { appearance: 'success', autoDismiss: 'true' });
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
                    <Card style={{marginTop: '10px'}}>
                        <Card.Header>
                        <h5>Location</h5>
                        </Card.Header>
                     
                        {/*Pais*/}
                        <Card style={{margin: '10px'}}>
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                <h8>Country:&nbsp;</h8><h8> {capitalizeFirstLetter(companyInfo.pais)}</h8>
                                <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowCountry()}>Change Country</Button>
                            </div>
                            
                            </Card.Body>
                        </Card>
                        <Modal show={changeCountry} onHide={handleCloseCountry}>
                            <Modal.Header closeButton>
                            <Modal.Title>Input the name of the country</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="inputCountry">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control as="select" value={countryData} onChange={e => setCountryData(e.target.value)}>
                                        {Countries.countries.map((item, i) => (
                                            
                                                <option key={i} value={item.name}>{item.name}</option>
                                            
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCountry}>
                                Close
                            </Button>
                            <Button disabled={validInput} variant="success" onClick={updateCountry}>
                                Change Country
                            </Button>
                            </Modal.Footer>
                        </Modal>
                      
                        {/*Distrito*/}
                        <Card style={{margin: '10px'}}>
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                <h8>District:&nbsp;</h8><h8> {capitalizeFirstLetter(companyInfo.distrito)}</h8>
                                <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowDistrict()}>Change District</Button>
                            </div>
                            
                            </Card.Body>
                        </Card>
                        <Modal show={changeDistrict} onHide={handleCloseDistrict}>
                            <Modal.Header closeButton>
                            <Modal.Title>Input the name of the district</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="inputDistrict">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control placeholder="Enter the District" value={districtData} onChange={e => setDistrictData(e.target.value) } />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDistrict}>
                                Close
                            </Button>
                            <Button disabled={validInput} variant="success" onClick={updateDistrict}>
                                Change District
                            </Button>
                            </Modal.Footer>
                        </Modal>
                           
                        {/*Rua*/}
                        <Card style={{margin: '10px'}}>
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                <h8>Address:&nbsp;</h8><h8>  {capitalizeFirstLetter(companyInfo.rua)}</h8>
                                <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowAddress()}>Change Address</Button>
                            </div>
                            
                            </Card.Body>
                        </Card>
                        <Modal show={changeAddress} onHide={handleCloseAddress}>
                            <Modal.Header closeButton>
                            <Modal.Title>Input the name of the address</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="inputAddress">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control placeholder="Enter the Address" value={addressData} onChange={e => setAddressData(e.target.value) } />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseAddress}>
                                Close
                            </Button>
                            <Button disabled={validInput} variant="success" onClick={updateAddress}>
                                Change Address
                            </Button>
                            </Modal.Footer>
                        </Modal>


                        {/*CodPostal*/}
                        <Card style={{margin: '10px'}}>
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                <h8>Postal Code:&nbsp;</h8><h8>  {capitalizeFirstLetter(companyInfo.codpostal)}</h8>
                                <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowPostalCode()}>Change Postal Code</Button>
                            </div>
                            
                            </Card.Body>
                        </Card>
                        <Modal show={changePostalCode} onHide={handleClosePostalCode}>
                            <Modal.Header closeButton>
                            <Modal.Title>Input the name of the Postal Code</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="inputPostalCode">
                                    <Form.Label>Postal Code</Form.Label>
                                    <Form.Control placeholder="Enter the Postal Code" value={postalcodeData} onChange={e => setPostalCodeData(e.target.value) } />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClosePostalCode}>
                                Close
                            </Button>
                            <Button disabled={validInput} variant="success" onClick={updatePostalCode}>
                                Change Postal Code
                            </Button>
                            </Modal.Footer>
                        </Modal>
     
                    </Card>
                    <Card style={{marginTop: '10px'}}>
                        <Card.Header>
                        <h5>Contact</h5>
                        </Card.Header>
                     
                        {/*Email*/}
                        <Card style={{margin: '10px'}}>
                            {/*Create body*/}
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                {/* Location of company               get local of company*/}
                                <h8>Email:&nbsp;</h8><h8>  {capitalizeFirstLetter(companyInfo.email)}</h8>
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
                    
                        {/*Telefone*/}
                        <Card style={{margin: '10px'}}>
                            <Card.Body>
                            <div style={{display: 'inline-flex'}}>
                                <h8>Phone number:&nbsp;</h8><h8> {capitalizeFirstLetter(companyInfo.telefone)}</h8>
                                
                                
                                <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShowPhoneNumber()}>Change Phone Number</Button>
                            </div>
                            </Card.Body>
                            </Card>
                        <Modal show={changePhoneNumber} onHide={handleClosePhoneNumber}>
                            <Modal.Header closeButton>
                            <Modal.Title>Input the Phone Number of the company</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group controlId="inputPhoneNumber">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control placeholder="Enter the Phone Number" value={phonenumberData} onChange={e => setPhoneNumberData(e.target.value) } />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleClosePhoneNumber}>
                                Close
                            </Button>
                            <Button disabled={validInput} variant="success" onClick={updatePhoneNumber}>
                                Change Phone Number
                            </Button>
                            </Modal.Footer>
                        </Modal>
                     
                    </Card>
                </>
            : <Loading />}
        </>
    )
}

export default Company;