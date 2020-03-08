import * as firebase from "firebase/app";
const firebaseConfig = {
  // ...
};

firebase.initializeApp(firebaseConfig);

const AuthGateway = {
  SignUp: async (email, password) => {
    try {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return result ? true : false;
    } catch (err) {
      throw err;
    }
  },
  SignIn: async (email, password) => {
    try {
      const result = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      return result ? true : false;
    } catch (err) {
      throw err;
    }
  },
  SignOut: async () => {
    try {
      await firebase.auth().signOut();
      return true;
    } catch (err) {
      return false;
    }
  }
};
export default AuthGateway;
