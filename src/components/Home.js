import { withRouter } from "react-router";
import { InfoCircle } from "react-bootstrap-icons";

const Home = () => {
    return (
        <div style={{textAlign: 'center', width: '100%', height: '100%'}}>
            <h1>Welcome</h1>
            <br /><br />
            <h2>Select the operations in the sidebar that you want to do in your application</h2>
            <div style={{display: 'inline-flex', position: 'absolute', left:'290px', bottom: 0}}>
                <InfoCircle size={30} style={{marginRight: '5px'}}/><h4> In case of issue, please contact our support team</h4>
            </div>
        </div>
    );
};

export default withRouter(Home);