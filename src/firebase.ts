import {firebase} from "firebase";

firebase.initializeApp();

const AuthGateway = {
  SignUp: (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => true)
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        return false;
        // ...
      });
  },
  SignIn: (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => true)
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        return false;
        // ...
      });
  },
  SignOut: () => {
    firebase
      .auth()
      .signOut()
      .then(() => true)
      .catch((error) => false);
  }
};

exports.AuthGateway = AuthGateway;
