import {assert, expect} from "chai";
import sinon from "sinon";
import User from "../src/user";
import AuthGateway from "../src/firebase";
import mocha from "mocha";

describe("Authentication", () => {
  let new_user;
  const callback = sinon.fake.returns(true);

  before(() => {
    new_user = new User("aboumehdi.pro@gmail.com");
    sinon.replace(AuthGateway, "SignUp", callback);
    sinon.replace(AuthGateway, "SignIn", callback);
    sinon.replace(AuthGateway, "SignOut", callback);
  });

  it("Should Signup a user", async () => {
    const isSignup = await AuthGateway.SignUp(new_user.getEmail(), "password");
    assert.equal(isSignup, true);
  });

  it("Should Login a user", async () => {
    const isSignIn = await AuthGateway.SignIn(new_user.getEmail(), "password");
    assert.equal(isSignIn, true);
  });

  it("Should Logout a user", async () => {
    const isLogOut = await AuthGateway.SignOut();
    assert.equal(isLogOut, true);
  });
});
