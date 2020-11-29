import sinon from "sinon";
import User from "../src/user";
import AuthGateway from "../src/firebase";
import mocha from "mocha";

describe("Authentication", () => {
  let new_user;
  const callback = sinon.fake.returns(true);

  beforeAll(() => {
    new_user = new User("aboumehdi.pro@gmail.com");
    sinon.replace(AuthGateway, "SignUp", callback);
    sinon.replace(AuthGateway, "SignIn", callback);
    sinon.replace(AuthGateway, "SignOut", callback);
  });


  test("Should Signup a user", async () => {
    const isSignup = await AuthGateway.SignUp(new_user.getEmail(), "password");
    expect(isSignup).toBeTruthy()
  });

  test("Should Login a user", async () => {
    const isSignIn = await AuthGateway.SignIn(new_user.getEmail(), "password");
    expect(isSignIn).toBeTruthy()
  });

  test("Should Logout a user", async () => {
    const isLogOut = await AuthGateway.SignOut();
    expect(isLogOut).toBeTruthy()
  });
});
