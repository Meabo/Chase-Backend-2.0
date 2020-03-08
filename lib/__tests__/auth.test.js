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
const chai_1 = require("chai");
const sinon = require("sinon");
const user_1 = require("../user");
const firebase_1 = require("../firebase");
describe("Authentication", () => {
    let new_user;
    const callback = sinon.fake.returns(true);
    before(() => {
        new_user = new user_1.default("aboumehdi.pro@gmail.com");
        sinon.replace(firebase_1.default, "SignUp", callback);
        sinon.replace(firebase_1.default, "SignIn", callback);
        sinon.replace(firebase_1.default, "SignOut", callback);
    });
    it("Should Signup a user", () => __awaiter(this, void 0, void 0, function* () {
        const isSignup = yield firebase_1.default.SignUp(new_user.getEmail(), "password");
        chai_1.assert.equal(isSignup, true);
    }));
    it("Should Login a user", () => __awaiter(this, void 0, void 0, function* () {
        const isSignIn = yield firebase_1.default.SignIn(new_user.getEmail(), "password");
        chai_1.assert.equal(isSignIn, true);
    }));
    it("Should Logout a user", () => __awaiter(this, void 0, void 0, function* () {
        const isLogOut = yield firebase_1.default.SignOut();
        chai_1.assert.equal(isLogOut, true);
    }));
});
