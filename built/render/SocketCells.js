"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleSocketCells = /** @class */ (function () {
    function SingleSocketCells() {
        this.data = new Map();
    }
    SingleSocketCells.prototype.add = function (id, cell) {
        this.data.set(id, cell);
    };
    SingleSocketCells.prototype.remove = function (id) {
        this.data.delete(id);
    };
    SingleSocketCells.prototype.clear = function () {
        this.data.clear();
    };
    return SingleSocketCells;
}());
var SocketCells = /** @class */ (function () {
    function SocketCells() {
        this.firstTab = new SingleSocketCells();
        this.secondTab = new SingleSocketCells();
        this.topOneTab = new SingleSocketCells();
    }
    SocketCells.prototype.add = function (subtype, cell, id) {
        switch (subtype) {
            case 'FIRST_TAB':
                this.firstTab.add(id, cell);
                break;
            case 'SECOND_TAB':
                this.secondTab.add(id, cell);
                break;
            case 'TOP_ONE_TAB':
                this.topOneTab.add(id, cell);
                break;
        }
    };
    SocketCells.prototype.remove = function (subtype, id) {
        switch (subtype) {
            case 'FIRST_TAB':
                this.firstTab.remove(id);
                break;
            case 'SECOND_TAB':
                this.secondTab.remove(id);
                break;
            case 'TOP_ONE_TAB':
                this.topOneTab.remove(id);
                break;
        }
    };
    SocketCells.prototype.clear = function () {
        this.firstTab.clear();
        this.secondTab.clear();
        this.topOneTab.clear();
    };
    return SocketCells;
}());
exports.default = SocketCells;
