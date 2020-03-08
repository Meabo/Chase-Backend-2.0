"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const location_1 = require("../src/location");
const locationutils_1 = require("./utils/locationutils");
class Area extends schema_1.Schema {
    constructor(location, bounds, name) {
        super();
        this.bounds = new schema_1.ArraySchema();
        this.location = new location_1.Location(location[0], location[1]);
        bounds.map((bound) => this.bounds.push(new location_1.Location(bound[0], bound[1])));
        this.name = name;
    }
    isInside(loc) {
        const result = locationutils_1.robustPointInPolygon(this.getBounds(), loc);
        if (result === -1 || result === 0)
            return true;
        return false;
    }
    getName() {
        return this.name;
    }
    getLocation() {
        return this.location.getLocation();
    }
    getBounds() {
        return [
            this.bounds[0].getLocation(),
            this.bounds[1].getLocation(),
            this.bounds[2].getLocation(),
            this.bounds[3].getLocation()
        ];
    }
}
__decorate([
    schema_1.type(location_1.Location)
], Area.prototype, "location", void 0);
__decorate([
    schema_1.type([location_1.Location])
], Area.prototype, "bounds", void 0);
__decorate([
    schema_1.type("string")
], Area.prototype, "name", void 0);
exports.default = Area;
