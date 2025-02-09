"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerCells = /** @class */ (function () {
    function PlayerCells(settings, ogar) {
        this.settings = settings;
        this.ogar = ogar;
        this.firstTab = new Map();
        this.secondTab = new Map();
        this.firstTabIds = new Set();
        this.secondTabIds = new Set();
    }
    PlayerCells.prototype.addFirstTabId = function (id) {
        this.firstTabIds.add(id);
    };
    PlayerCells.prototype.addSecondTabId = function (id) {
        this.secondTabIds.add(id);
    };
    PlayerCells.prototype.addFirstTabCell = function (id, cell) {
        this.firstTab.set(id, cell);
        cell.setPlayerCell(this.settings.all.profiles.leftProfileNick, this.settings.all.profiles.leftProfileSkinUrl);
        this.ogar.firstTab.player.color.cell = cell.colorHex[1];
    };
    PlayerCells.prototype.addSecondTabCell = function (id, cell) {
        this.secondTab.set(id, cell);
        cell.setPlayerCell(this.settings.all.profiles.rightProfileNick, this.settings.all.profiles.rightProfileSkinUrl);
        this.ogar.secondTab.player.color.cell = cell.colorHex[1];
    };
    PlayerCells.prototype.remove = function (subtype, id) {
        if (subtype === 'FIRST_TAB') {
            this.firstTab.delete(id);
            this.firstTabIds.delete(id);
        }
        else if (subtype === 'SECOND_TAB') {
            this.secondTab.delete(id);
            this.secondTabIds.delete(id);
        }
    };
    PlayerCells.prototype.clear = function () {
        this.firstTab.clear();
        this.secondTab.clear();
        this.secondTabIds.clear();
        this.firstTabIds.clear();
    };
    PlayerCells.prototype.isFirstTab = function (cell) {
        var firstEntry = this.firstTab.values().next().value;
        if (firstEntry) {
            return this.compare(firstEntry.nick, firstEntry.color, cell.nick, cell.color);
        }
        return false;
    };
    PlayerCells.prototype.isSecondTab = function (cell) {
        var firstEntry = this.secondTab.values().next().value;
        if (firstEntry) {
            return this.compare(firstEntry.nick, firstEntry.color, cell.nick, cell.color);
        }
        return false;
    };
    PlayerCells.prototype.compare = function (nick, color, nick2, color2) {
        var sameNick = nick === nick2;
        var sameColor = color.blue === color2.blue && color.green === color2.green && color.blue === color2.blue;
        return sameNick && sameColor;
    };
    return PlayerCells;
}());
exports.default = PlayerCells;
