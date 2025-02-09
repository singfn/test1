"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new /** @class */ (function () {
    function PlayerState() {
        this.first = {
            spawning: false,
            playing: false,
            focused: false,
            loggedIn: false,
            connected: false,
            connecting: false,
            shouldBeReconnected: false,
        };
        this.second = {
            spawning: false,
            playing: false,
            focused: false,
            loggedIn: false,
            connected: false,
            connecting: false,
            shouldBeReconnected: false,
        };
        window.xxx = this;
    }
    return PlayerState;
}());
