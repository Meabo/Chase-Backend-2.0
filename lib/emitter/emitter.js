"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const events_1 = require("events");
function Event() {
    events_1.EventEmitter.call(this);
}
exports.Event = Event;
util.inherits(Event, events_1.EventEmitter);
Event.prototype.sendEvent = function (type, data) {
    this.emit(type, data);
};
exports.eventBus = new Event();
