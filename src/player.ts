export default class Player {
  pseudo: string;
  location: number[];

  constructor(pseudo_, location_) {
    this.pseudo = pseudo_;
    this.location = location_;
  }

  getPseudo() {
    return this.pseudo;
  }

  getLocation() {
    return this.location;
  }

  moveTo(newLocation: number[]) {
    this.location = newLocation;
  }
}
