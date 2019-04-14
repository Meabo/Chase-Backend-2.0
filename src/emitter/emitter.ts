import * as util from "util";
import {EventEmitter} from "events";
export function Event() {
  EventEmitter.call(this);
}
util.inherits(Event, EventEmitter);

Event.prototype.sendEvent = function(type, data) {
  this.emit(type, data);
};
export const eventBus = new Event();
