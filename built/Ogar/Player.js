"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(id) {
        if (id === void 0) { id = 0; }
        this.id = 0;
        this.nick = '';
        this.skin = '';
        this.mass = 0;
        this.position = { x: 0, y: 0 };
        this.animatedPosition = { x: 0, y: 0 };
        this.tag = '';
        this.alive = false;
        this.updateTime = 0;
        this.color = { cell: '#000000', custom: '#3633a5' };
        this.partyToken = '';
        this.serverToken = '';
        this.id = id;
    }
    return Player;
}());
exports.default = Player;
