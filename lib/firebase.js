"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase = require("firebase/app");
const firebaseConfig = {
// ...
};
firebase.initializeApp(firebaseConfig);
const AuthGateway = {
    SignUp: (email, password) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield firebase
                .auth()
                .createUserWithEmailAndPassword(email, password);
            return result ? true : false;
        }
        catch (err) {
            throw err;
        }
    }),
    SignIn: (email, password) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield firebase
                .auth()
                .signInWithEmailAndPassword(email, password);
            return result ? true : false;
        }
        catch (err) {
            throw err;
        }
    }),
    SignOut: () => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield firebase.auth().signOut();
            return true;
        }
        catch (err) {
            return false;
        }
    })
};
exports.default = AuthGateway;
