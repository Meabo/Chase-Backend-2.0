declare const AuthGateway: {
    SignUp: (email: any, password: any) => Promise<boolean>;
    SignIn: (email: any, password: any) => Promise<boolean>;
    SignOut: () => Promise<boolean>;
};
export default AuthGateway;
