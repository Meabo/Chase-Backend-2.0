"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("@colyseus/schema");
const history_1 = require("./history");
const player_1 = require("./player");
const chaseobject_1 = require("./chaseobject");
const rxjs_1 = require("rxjs");
const area_1 = require("./area");
const locationutils_1 = require("./utils/locationutils");
const { take, finalize } = require("rxjs/operators");
class Game extends schema_1.Schema {
    constructor(options) {
        super();
        this.history = new history_1.default();
        this.players = new schema_1.MapSchema();
        this.gameFinished = false;
        this.alreadyGuardian = false;
        const { chaseObjectLoc, gameId, arealoc, bounds } = options;
        this.chaseObject = new chaseobject_1.default(chaseObjectLoc[0], chaseObjectLoc[1]);
        this.timer = null;
        this.gameId = gameId;
        this.area = new area_1.default(arealoc, bounds, "area");
    }
    BeginTimer(limit, ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            this.timer = rxjs_1.timer(0, ticker)
                .pipe(take(limit), finalize(() => {
                this.gameFinished = true;
            }))
                .subscribe();
        });
    }
    createPlayer(id, pseudo, lat, lon) {
        this.players[id] = new player_1.default(pseudo, lat, lon);
    }
    catchChaseObject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = false;
            const { pseudo, lat, lon } = this.players[id];
            if (this.alreadyGuardian === false) {
                if (this.chaseObject.lat === lat && this.chaseObject.lon === lon) {
                    this.guardian = new player_1.default(pseudo, lat, lon);
                    this.alreadyGuardian = true;
                    result = true;
                    yield this.BeginTimer(1, 100); // Value to change with a real timer
                }
                this.history.addAction(this.gameId, id, "catch", {
                    status: result ? "success" : "failure",
                    pseudo,
                    location: [lat, lon],
                    timestamp: new Date().getTime()
                });
            }
            return result;
        });
    }
    stealChaseObject(id) {
        const { pseudo, lat, lon } = this.players[id];
        const guardianPseudo = this.guardian.pseudo;
        let result = false;
        if (this.guardian.lat === lat && this.guardian.lon === lon) {
            this.guardian = new player_1.default(pseudo, lat, lon);
            result = true;
        }
        this.history.addAction(this.gameId, id, "steal", {
            status: result ? "success" : "failure",
            pseudo,
            pseudoStealed: guardianPseudo,
            location: [lat, lon],
            timestamp: new Date().getTime()
        });
        return result;
    }
    removePlayer(id) {
        delete this.players[id];
    }
    generateAnotherPositionForChaseObject() {
        const { latitude, longitude } = locationutils_1.getRandomLocationInsidePolygon(this.area.getBounds());
        this.chaseObject = new chaseobject_1.default(latitude, longitude);
        this.guardian = null;
        this.alreadyGuardian = false;
    }
    movePlayer(id, payload) {
        const { pseudo, lat, lon } = this.players[id];
        const { lat: newlat, lon: newlon } = payload;
        this.players[id].lat = newlat;
        this.players[id].lon = newlon;
        this.history.addMove(this.gameId, id, [lat, lon], [newlat, newlon], new Date().getTime());
        if (this.alreadyGuardian &&
            this.players[id].pseudo === this.guardian.pseudo) {
            this.guardian.lat = newlat;
            this.guardian.lon = newlon;
        }
        if (this.alreadyGuardian &&
            this.players[id].pseudo === this.guardian.pseudo &&
            !this.area.isInside([newlat, newlon])) {
            this.generateAnotherPositionForChaseObject();
        }
    }
    getGuardian() {
        return this.guardian;
    }
    getHistory() {
        return this.history;
    }
    getChaseObjectLocation() {
        return this.chaseObject.getLocation();
    }
}
__decorate([
    schema_1.type(history_1.default)
], Game.prototype, "history", void 0);
__decorate([
    schema_1.type({ map: player_1.default })
], Game.prototype, "players", void 0);
__decorate([
    schema_1.type("boolean")
], Game.prototype, "gameFinished", void 0);
__decorate([
    schema_1.type(chaseobject_1.default)
], Game.prototype, "chaseObject", void 0);
__decorate([
    schema_1.type(player_1.default)
], Game.prototype, "guardian", void 0);
__decorate([
    schema_1.type(area_1.default)
], Game.prototype, "area", void 0);
exports.default = Game;
