"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Writer_1 = __importDefault(require("../utils/Writer"));
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var SPAWN_OPCODE = 1;
var DEATH_OPCODE = 2;
var JOIN_OPCODE = 3;
var NICK_OPCODE = 10;
var TAG_OPCODE = 11;
var SKIN_OPCODE = 12;
var CUSTOM_COLOR_OPCODE = 13;
var PLAYER_CELL_COLOR_OPCODE = 14;
var PARTY_TOKEN_OPCODE = 15;
var SERVER_TOKEN_OPCODE = 16;
var REGION_OPCODE = 17;
var GAMEMODE_OPCODE = 18;
var PLAYER_UPDATE_OPCODE = 20;
var PLAYER_POSITION_UPDATE_OPCODE = 30;
var Emitter = /** @class */ (function () {
    function Emitter(socket) {
        this.socket = socket;
    }
    Emitter.prototype.sendHandshake = function () {
        var buffer = new Writer_1.default(3);
        buffer.writeUInt8(0);
        buffer.writeUInt16(this.socket.handshakeKey);
        this.socket.send(buffer.buffer);
        // statistics at https://snez.org:8080/
        buffer = new Writer_1.default(3);
        buffer.writeUInt8(5);
        buffer.writeUInt16(90);
        this.socket.send(buffer.buffer);
    };
    Emitter.prototype.sendChatMessage = function (str, type) {
        var buffer = new Writer_1.default(12 + str.length * 2);
        buffer.writeUInt8(100);
        buffer.writeUInt8(type);
        buffer.writeUInt32(this.socket.player.id);
        buffer.writeUInt32(0);
        buffer.writeString16(str);
        this.socket.send(buffer.buffer);
    };
    Emitter.prototype.sendPlayerSpawn = function () {
        this.socket.player.alive = true;
        this.sendPlayerState(SPAWN_OPCODE);
    };
    Emitter.prototype.sendPlayerDeath = function () {
        this.socket.player.alive = false;
        this.sendPlayerState(DEATH_OPCODE);
    };
    Emitter.prototype.sendPlayerJoin = function () {
        this.socket.player.alive = false;
        this.sendPlayerState(JOIN_OPCODE);
    };
    Emitter.prototype.sendPlayerNick = function () {
        this.sendString(NICK_OPCODE, this.socket.player.nick);
    };
    Emitter.prototype.sendPlayerSkin = function () {
        this.sendString(SKIN_OPCODE, this.socket.player.skin);
    };
    Emitter.prototype.sendPlayerTag = function () {
        this.sendString(TAG_OPCODE, this.socket.settings.all.profiles.tag);
        this.socket.team.clear();
        if (!this.socket.second) {
            FrontAPI_1.default.updateTopTeam([]);
        }
    };
    Emitter.prototype.sendPartyToken = function (token) {
        this.sendString(PARTY_TOKEN_OPCODE, token);
    };
    Emitter.prototype.sendServerToken = function (token) {
        this.sendString(SERVER_TOKEN_OPCODE, token);
        this.socket.team.clear();
    };
    Emitter.prototype.sendServerRegion = function () {
        var master = this.socket.master;
        if (master.gameMode.get() === ':private') {
        }
        else {
            this.sendString(REGION_OPCODE, master.regions.getCurrent().split('-')[0]);
        }
    };
    Emitter.prototype.sendServerGamemode = function () {
        this.sendString(GAMEMODE_OPCODE, this.socket.master.gameMode.getOgar());
    };
    Emitter.prototype.sendCustomColor = function () {
        this.sendString(CUSTOM_COLOR_OPCODE, this.socket.player.color.custom);
    };
    Emitter.prototype.sendPlayerUpdate = function () {
        var _a = this.socket.player, id = _a.id, nick = _a.nick, skin = _a.skin, _b = _a.color, colorCell = _b.cell, colorCustom = _b.custom;
        var size = 13 + nick.length * 2 + skin.length * 2 + colorCell.length * 2 + colorCustom.length * 2;
        var buffer = new Writer_1.default(size);
        buffer.writeUInt8(PLAYER_UPDATE_OPCODE);
        buffer.writeUInt32(id);
        buffer.writeString16(nick);
        buffer.writeString16(skin);
        buffer.writeString16(colorCustom);
        buffer.writeString16(colorCell);
        this.socket.send(buffer.buffer);
    };
    Emitter.prototype.sendPlayerPositionUpdate = function () {
        var _a = this.socket.player, id = _a.id, mass = _a.mass, _b = _a.position, posX = _b.x, posY = _b.y;
        var buffer = new Writer_1.default(17);
        buffer.writeUInt8(PLAYER_POSITION_UPDATE_OPCODE);
        buffer.writeUInt32(id);
        buffer.writeInt32(posX);
        buffer.writeInt32(posY);
        buffer.writeUInt32(mass);
        this.socket.send(buffer.buffer);
    };
    Emitter.prototype.sendPlayerState = function (state) {
        var buffer = new Writer_1.default(1);
        buffer.writeUInt8(state);
        this.socket.send(buffer.dataView.buffer);
    };
    Emitter.prototype.sendString = function (opcode, str) {
        var view = new DataView(new ArrayBuffer(1 + 2 * str.length));
        view.setUint8(0, opcode);
        for (var i = 0; i < str.length; i++) {
            view.setUint16(1 + 2 * i, str.charCodeAt(i), true);
        }
        this.socket.send(view.buffer);
    };
    return Emitter;
}());
exports.default = Emitter;
