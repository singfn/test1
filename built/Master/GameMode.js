"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameMode = /** @class */ (function () {
    function GameMode() {
        this.mode = ':party';
    }
    GameMode.prototype.set = function (mode) {
        if (mode === void 0) { mode = ':party'; }
        this.mode = mode;
    };
    GameMode.prototype.get = function () {
        return this.mode;
    };
    GameMode.prototype.getOgar = function () {
        switch (this.mode) {
            case ':party': return 'PTY';
            case ':ffa': return 'FFA';
            case ':experimental': return 'EXP';
            case ':battleroyale': return 'BTR';
            case ':teams': return 'TMS';
            default: return 'Private';
        }
    };
    return GameMode;
}());
exports.default = GameMode;
