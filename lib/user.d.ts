export default class User {
    private email;
    private profile;
    private playerProfile;
    private currentLocation;
    constructor(email: string);
    getEmail(): string;
    createProfile(firstName: any, lastName: any, bornDate: any): void;
    createPlayerProfile(pseudo: any, avatarId: any, player_type: any): void;
    getLocation(): number[];
    setCurrentLocation(loc: number[]): void;
    getUserProfile(): {
        firstName?: string;
        lastName?: string;
        bornDate?: string;
    };
    getUserPlayerProfile(): {
        pseudo?: string;
        avatarId?: string;
        faction?: string;
    };
}
