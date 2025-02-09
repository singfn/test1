"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger(name) {
        this.name = name;
    }
    Logger.prototype.message = function (msg, color) {
        console.log("%c[" + new Date().toLocaleTimeString() + "] " + ("%c[" + this.name + "]: ") + ("%c" + msg + "."), 'color: #00c4ff', 'color: #63dbff', "color:" + color);
    };
    Logger.prototype.info = function (message) {
        this.message(message, '#d9d9d9');
    };
    Logger.prototype.warning = function (message) {
        this.message(message, '#ffdb63');
    };
    Logger.prototype.error = function (message) {
        this.message(message, '#ff6363');
    };
    return Logger;
}());
exports.default = Logger;
