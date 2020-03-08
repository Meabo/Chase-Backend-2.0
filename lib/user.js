"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
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
    setCurrentLocation(loc) {
        this.currentLocation = loc;
    }
    getUserProfile() {
        return this.profile;
    }
    getUserPlayerProfile() {
        return this.playerProfile;
    }
}
exports.default = User;
