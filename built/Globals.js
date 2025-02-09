"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new /** @class */ (function () {
    function Globals() {
    }
    Globals.prototype.init = function (app) {
        this.app = app;
        this.gameBlured = false;
        this.gameBluring = false;
    };
    return Globals;
}());
