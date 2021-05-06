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
    const [validInput, setValidInput] = useState(false);

    const handleShow = () => setChangeLocation(true);

    const handleClose = () => {setChangeLocation(false);setLocationData(null)};

    useEffect(() => {
        getCompanyData(currentUser?.companyInfo)
    });

    useEffect(() => {
        if (!locationData) {
            setValidInput(true);
            return;
        }
        setValidInput(false);
    }, [locationData]);

    const updateLocation = () => {
        if(locationData === ''){
            handleClose();
            addToast('The input of location is empty', { appearance: 'error', autoDismiss: 'true' });
        }
        app.database().ref('/companyData/' + currentUser?.companyInfo.id + '/Information').child('local').set(String(locationData));
        handleClose();
        addToast('Location changed with success', { appearance: 'success', autoDismiss: 'true' });
    }

    const getCompanyData = (company) => {
        if(company){
            app.database().ref('/companyData/' + company.id + '/Information').on('value', snapshot => {
                if(companyInfo === null){
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
                        <h1>Company {capitalizeFirstLetter(companyInfo.name)}</h1>
                        <OverlayTrigger placement="right" overlay={<Tooltip id="tooltip-disabled">If you want to change the company name please contact our support</Tooltip>}>
                            <InfoCircle size={30} style={{color: '#007bff', marginLeft: '5px', marginTop: '10px'}}/>
                        </OverlayTrigger>
                    </div>
                    
                    <br />
                    <br />
                    <Card style={{marginTop: '10px'}}>
                        <Card.Body>
                        <div style={{display: 'inline-flex'}}>
                            <h3>Location: {capitalizeFirstLetter(companyInfo.local)}</h3>
                            <Button style={{position: 'absolute', right: '20px', left: 'auto'}} variant='info' onClick={() => handleShow()}>Change Location</Button>
                        </div>
                        </Card.Body>
                    </Card>
                    <Modal show={changeLocation} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Input the name of the location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="inputLocation">
                                <Form.Label>Location</Form.Label>
                                <Form.Control placeholder="Enter the Location" value={locationData} onChange={e => setLocationData(e.target.value) } />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={validInput} variant="success" onClick={updateLocation}>
                            Change Location
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            : <Loading />}
        </>
    )
}

export default Company;