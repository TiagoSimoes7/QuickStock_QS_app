import React, { useEffect, useState } from "react";
import app from "./base.js";
import { useToasts } from 'react-toast-notifications';

export const AuthContext = React.createContext();

export const AuthProvider = props => {
    const {addToast} = useToasts();
    const [currentUser, setCurrentUser] = useState(null);
    const [forcedLogout, setForcedLogout] = useState(false);
    const forceLogout = () => {
        app.auth().signOut();
        addToast('Only Administrators and Managers can sign in on the Dashboard', { appearance: 'error', autoDismiss: 'true' })
        return;
    }
    useEffect(() => {
        setForcedLogout(false);
        app.auth().onAuthStateChanged(user => {
            if (user){
                app.database().ref('/quickStockUsers').on('value',  snapshot => {
                    if (!snapshot?.val()) return
                    const userFilter = Object.values(snapshot.val()).filter(u => u.email === user.email);
                    if (userFilter.length > 0) {
                        if(userFilter[0].role === 'Warehouse employee'){
                            if(!forcedLogout){
                                setForcedLogout(true);
                                return forceLogout();
                            }
                        }
                        app.database().ref('/companyData/' + userFilter[0].companyId + '/Information').on('value',  info => {
                            setCurrentUser({...user, companyInfo: info.val(), role: userFilter[0].role});
                        });
                        return;
                    }
                });
                return;
            }
            setCurrentUser(null)
        });
    }, []);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {props.children}
        </AuthContext.Provider>
    );
};