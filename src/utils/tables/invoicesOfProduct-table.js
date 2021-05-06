import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import {Table} from 'react-bootstrap';
import { withRouter } from "react-router";
import app from '../../base';
import { capitalizeFirstLetter } from '../funcs';
import { Loading } from '../loading';

const useStyles = makeStyles({
    thClear: {
      textAlign: 'center'
    },
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
})

const InvoicesOfProductTable = (props) => {
    const classes = useStyles();
    const [movements, setMovements] = useState(null);
    const [invoices, setInvoices] = useState(null);

    useEffect(async () => {
      if(props.companyID !== null){
        getInvoicesOfProducts(props?.companyID, props.productID);
        getInvoices(props?.companyID);
      }
      
    }, [props])

    const getInvoicesOfProducts = (companyID, productID) => {
      app.database().ref('/companyData/' + companyID + '/Movements').on('value', snapshot => {
        let allMovements = [];
        if(snapshot.val()){
          allMovements = snapshot.val().filter((movement) => movement.idProduct === productID)
          if(movements === null){
            setMovements(allMovements);
          }
        }else{
          if(!movements){
            setMovements(allMovements);
            return;
          }
            
          if(movements.length !== 0)
            setMovements(allMovements);
        }
      });
    };

    const getInvoices = (companyID) => {
      app.database().ref('/companyData/' + companyID + '/Invoices').on('value', snapshot => {
        let allInvoices = [];
        if(snapshot.val()){
          snapshot.val().map((invoice) => {
            allInvoices.push({ id: invoice.id, date: invoice.date, type: invoice.type });
          });
          if(invoices === null){
            setInvoices(allInvoices);
          }
          if(JSON.stringify(allInvoices) === JSON.stringify(invoices)){
            setInvoices(allInvoices);
          }
        }else{
          if(!invoices){
            setInvoices(allInvoices);
            return
          }
            
          
          if(invoices.length !== 0)
            setInvoices(allInvoices);
        }
      });
  };
    return ( movements && invoices ?
    <Table responsive striped bordered hover>
        <thead className={classes.header}>
            <tr>
            <th style={{textAlign: 'center'}}>ID Invoice</th>
            <th style={{textAlign: 'center'}}>Type Invoice</th>
            <th style={{textAlign: 'center'}}>Date</th>
            <th style={{textAlign: 'center'}}>Quantity</th>
            </tr>
        </thead>
        <tbody>
            {movements.length > 0 ? movements.map((movement, key) => {
              if(movement.idProduct === props.productID){
                return (
                  <tr key={key}>
                      <td style={{textAlign: 'end'}}>{movement.idInvoice}</td>
                      <td style={{textAlign: 'center'}}>{capitalizeFirstLetter(invoices.filter(i => i.id === movement.idInvoice)[0].type)  ?? '--'}</td>
                      <td style={{textAlign: 'center'}}>{invoices.filter(i => i.id === movement.idInvoice)[0].date ?? '--'}</td>
                      <td style={{textAlign: 'end'}}>{movement.quantity}</td>
                  </tr>)
              }
                
            }) : <tr><td colSpan={4} className={classes.thClear}>There are no movements in this product</td></tr>}
        </tbody>
    </Table> : <Loading />);
}

export default withRouter(InvoicesOfProductTable);