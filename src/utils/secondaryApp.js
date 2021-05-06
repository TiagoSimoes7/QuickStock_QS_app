import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const secondApp = firebase.initializeApp ({
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE
  }, "Secondary");

export const createUserService = (email, password) => {
    secondApp.auth().createUserWithEmailAndPassword(email, password).then(() => {
        secondApp.auth().signOut();
    });
}

export const deleteUserService = (email, password) => {
    secondApp.auth().signInWithEmailAndPassword(email, password.toString()).then(() => {
        var user = secondApp.auth().currentUser;
        user.delete().catch(function(error) {
            console.log(error)
        });
    });
}