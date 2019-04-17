export default class User {
  private email: string;
  private profile: {firstName?: string; lastName?: string; bornDate?: string};
  private playerProfile: {
    pseudo?: string;
    avatarId?: string;
    faction?: string;
  };
  private currentLocation: number[];

  constructor(email) {
    this.email = email;
    this.profile = {};
    this.playerProfile = {};
  }

  getEmail() {
    return this.email;
  }

  createProfile(firstName, lastName, bornDate) {
    this.profile.firstName = firstName;
    this.profile.lastName = lastName;
    this.profile.bornDate = bornDate;
  }

  createPlayerProfile(pseudo, avatarId, player_type) {
    this.playerProfile.pseudo = pseudo;
    this.playerProfile.avatarId = avatarId;
    this.playerProfile.faction = player_type;
  }

  getLocation() {
    return this.currentLocation;
  }

  setCurrentLocation(loc: number[]) {
    this.currentLocation = loc;
  }

  getUserProfile() {
    return this.profile;
  }

  getUserPlayerProfile() {
    return this.playerProfile;
  }
}

module.exports = User;
