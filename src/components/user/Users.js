import {useContext,  useEffect,  useState} from "react";
import { withRouter } from "react-router";
import app from "../../base.js";
import { AuthContext } from "../../Auth";
import UsersTable from "../../utils/tables/users-table";
import { Loading } from "../../utils/loading";

const Users = ({ history }) => {    
    const { currentUser } = useContext(AuthContext);
    const [ users, setUsers] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect( () => {
        if(currentUser?.role === 'Manager'){
            history.push('/')
        }
    },[currentUser]);

    const getUsersData = (company) => {
        if(company){
            setLoading(true)
            app.database().ref('/quickStockUsers').on('value', snapshot => {
                let allUsers = [];
                snapshot.val().map((user) => {
                    if(user.companyId === company.id){
                        allUsers.push(user);
                    }
                });
                if(allUsers.join() !== users.join()){
                    setUsers(allUsers);
                }
                setLoading(false)
            });
        }
    }

    useEffect(() => {
        getUsersData(currentUser?.companyInfo);
    })
        
    return (
        <>
            <h1>Users of the company</h1>
            {loading ? <Loading /> : <UsersTable users={users} /> }
        </>
    );
};

export default withRouter(Users);