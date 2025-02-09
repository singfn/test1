"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CallbacksHandler = /** @class */ (function () {
    function CallbacksHandler() {
        this.callbacksArray = [];
    }
    CallbacksHandler.prototype.pushCallback = function (callback) {
        this.callbacksArray.push(callback);
    };
    CallbacksHandler.prototype.execute = function () {
        this.callbacksArray.forEach(function (callback) { return callback(); });
        this.clear();
    };
    CallbacksHandler.prototype.clear = function () {
        this.callbacksArray = [];
    };
    return CallbacksHandler;
}());
exports.default = CallbacksHandler;
