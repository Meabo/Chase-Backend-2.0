import {assert, expect} from "chai";
import * as sinon from "sinon";
import User from "../user";
import Firebase from "../firebase";

describe("Authentication", () => {
  let new_user;
  const callback = sinon.fake.returns(true);

  before(() => {
    new_user = new User("aboumehdi.pro@gmail.com");
    sinon.replace(Firebase.AuthGateway, "SignUp", callback);
    sinon.replace(Firebase.AuthGateway, "SignIn", callback);
    sinon.replace(Firebase.AuthGateway, "SignOut", callback);
  });

  it("Should Signup a user", async () => {
    const isSignup = Firebase.AuthGateway.SignUp(
      new_user.getEmail(),
      "password"
    );
    assert.equal(isSignup, true);
  });

  it("Should Login a user", async () => {
    const isSignIn = Firebase.AuthGateway.SignIn(
      new_user.getEmail(),
      "password"
    );
    assert.equal(isSignIn, true);
  });

  it("Should Logout a user", async () => {
    const isLogOut = Firebase.AuthGateway.SignOut();
    assert.equal(isLogOut, true);
  });
});
