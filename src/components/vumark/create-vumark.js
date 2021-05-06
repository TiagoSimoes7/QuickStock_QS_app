import axios from 'axios';
const CreateVuMark = () => {
    const md5 = require('md5');
    const base64 = require('base-64');
    const hmacsha1 = require('hmacsha1');
    const contentType = "image/png";
    const accessKey = "b5437a0773b56b43f0bae5f813193e2e25549df5";
    const secretKey = "7d82504944f5e6bdc6d300dfc14e227a590ecdb5";
    const targetId = 'b32067ca5b83487482d5f4ae9db8e198';
    const date = new Date().toUTCString();
    const data = {
        instance_id : 'TAR-0003' 
      };
    const bodyE = md5(JSON.stringify(data));
    const url = `https://vws.vuforia.com/targets/${targetId}/instances`;
    const StringToSign = 'POST' + "\n" + bodyE + "\n" + contentType + "\n" + date + "\n" + url;
    const signature = base64.encode(hmacsha1(secretKey, StringToSign));
    axios(
        url,
        {
            body: JSON.stringify(data),
            headers: {
                'Authorization': `VWS ${accessKey}:${signature}`,
                'Date': date,
                'Content-Type' : 'application/json',
                'Accept': 'image/png'
            },
            method: 'POST'
        }
        ).then(json => console.log(json))
        .catch(error => console.log(error));
    /* axios.post(
        url, 
        data, 
        { headers: 
            { 'Authorization': `VWS ${accessKey}:${signature}`, 'Access-Control-Allow-Origin': '*', 'crossDomain': true, 'Content-type' : contentType }, 
        }
    ) */

    return (
        <h1>VuMark</h1>
    );
}

export default CreateVuMark;
