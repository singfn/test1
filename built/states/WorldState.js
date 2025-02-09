"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new /** @class */ (function () {
    function WorldState() {
        this.gameJoined = false;
        this.ticks = 0;
        this.mapOffsets = {
            minX: 0,
            minY: 0,
            maxX: 0,
            maxY: 0,
            width: 0,
            height: 0
        };
        this.spectator = {
            topOne: false,
            topOneWithFirst: false,
            free: false,
            center: false,
        };
    }
    return WorldState;
}());
