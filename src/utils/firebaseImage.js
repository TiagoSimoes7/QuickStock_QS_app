import React from 'react';
import { useEffect, useState } from 'react';
import { Loading } from './loading';
import { getImage } from '../components/file/file-func';
import { makeStyles } from '@material-ui/core/styles';

const notFoundImage = '../images/notFound.png';

const useStyles = makeStyles({
    productImage: {
        width: '180px',
        height: '180px',
        borderRadius: '50px'
    },
    image: {
        width: '250px',
        height: '250px',
        borderRadius: '50px',
        display: 'block',
        margin: 'auto'
    },
  });

const FirebaseImage = (props) => {

    const classes = useStyles();
    const [url, setUrl] = useState(null);
    

    useEffect(async () => {
        if(props.imageName)
            setUrl(await getImage(props.imageName));
    })
    return url || !props.imageName ? <img className={props.changeProduct ? classes.productImage : classes.image} src={url ? url : notFoundImage} /> : <Loading />;
}
export default FirebaseImage;