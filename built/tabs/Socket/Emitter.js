"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var helpers_1 = require("../../utils/helpers");
var Writer_1 = __importDefault(require("../../utils/Writer"));
var Emitter = /** @class */ (function () {
    function Emitter(socket) {
        this.socket = socket;
    }
    Emitter.prototype.sendSpectate = function () {
        this.sendAction(1);
    };
    Emitter.prototype.sendFreeSpectate = function () {
        this.sendAction(18);
    };
    Emitter.prototype.sendFeed = function () {
        this.sendAction(21);
    };
    Emitter.prototype.sendSplit = function () {
        this.sendAction(17);
    };
    Emitter.prototype.sendCaptcha = function (token, version) {
        if (version === void 0) { version = 2 | 3; }
        var view = helpers_1.createView(2 + token.length);
        var code = version === 2 ? 86 : 88;
        view.setUint8(0, code);
        for (var length_1 = 0; length_1 < token.length; length_1++) {
            view.setUint8(1 + length_1, token.charCodeAt(length_1));
        }
        view.setUint8(token.length + 1, 0);
        this.socket.sendMessage(view);
    };
    Emitter.prototype.sendAction = function (action) {
        var view = helpers_1.createView(1);
        view.setUint8(0, action);
        this.socket.sendMessage(view);
    };
    Emitter.prototype.sendPlayerState = function (state) {
        var view = helpers_1.createView(1);
        view.setUint8(0, state);
        this.socket.send(view);
    };
    Emitter.prototype.sendSpawn = function (nick, token) {
        nick = unescape(encodeURIComponent(nick));
        var size = 2 + nick.length;
        if (token) {
            size += 10 + token.length;
        }
        var view = new DataView(new ArrayBuffer(size));
        var offset = 0;
        view.setUint8(offset++, 0);
        for (var i = 0; i < nick.length; i++) {
            view.setUint8(offset++, nick.charCodeAt(i));
        }
        view.setUint8(offset++, 0);
        if (token) {
            for (var i = 0; i < token.length; i++) {
                view.setUint8(offset++, token.charCodeAt(i));
            }
            view.setUint8(offset++, 0);
        }
        this.socket.sendMessage(view);
    };
    Emitter.prototype.handleSpawn = function (nick) {
        this.sendSpawn(nick, "0");
    };
    Emitter.prototype.sendMousePosition = function (dirty, x, y) {
        var focused = (this.socket.tabType === 'FIRST_TAB' && PlayerState_1.default.first.focused) ||
            (this.socket.tabType === 'SECOND_TAB' && PlayerState_1.default.second.focused);
        if (!this.socket.world.master.isPrivate) {
            if (!dirty && !focused && this.socket.tabType !== 'SPEC_TABS') {
                return;
            }
        }
        var posX, posY;
        switch (this.socket.tabType) {
            case 'SPEC_TABS':
                posX = this.socket.mapOffsets.minX + this.socket.spectateAtX;
                posY = this.socket.mapOffsets.minY + this.socket.spectateAtY;
                break;
            case 'FIRST_TAB':
                posX = x ? x : this.socket.world.view.firstTab.cursor.x;
                posY = y ? y : this.socket.world.view.firstTab.cursor.y;
                break;
            case 'SECOND_TAB':
                posX = x ? x : this.socket.world.view.secondTab.cursor.x;
                posY = y ? y : this.socket.world.view.secondTab.cursor.y;
                break;
        }
        var view = helpers_1.createView(13);
        view.setUint8(0, 16);
        view.setInt32(1, posX, true);
        view.setInt32(5, posY, true);
        !this.socket.world.master.isPrivate && view.setUint32(9, this.socket.protocolKey, true);
        this.socket.sendMessage(view);
    };
    Emitter.prototype.sendLogin = function (token, type) {
        var writer = new Writer_1.default(2048);
        var clientVersionString = this.socket.socketData.clientVersionString;
        writer.setToArray();
        writer.writeBytes([102, 8, 1, 18]);
        writer.writeUint32InLEB128(token.length + clientVersionString.length + 23);
        writer.writeBytes([8, 10, 82]);
        writer.writeUint32InLEB128(token.length + clientVersionString.length + 18);
        writer.writeBytes(__spreadArray(__spreadArray([
            8, type, 18, clientVersionString.length + 8, 8, 5, 18,
            clientVersionString.length
        ], __read(Buffer.from(clientVersionString))), [
            24, 0, 32, 0, 26
        ]));
        writer.writeUint32InLEB128(token.length + 3);
        writer.writeBytes([10]);
        writer.writeUint32InLEB128(token.length);
        writer.writeBytes(Buffer.from(token));
        this.socket.sendMessage(new DataView(new Uint8Array(Buffer.from(writer.message)).buffer));
    };
    return Emitter;
}());
exports.default = Emitter;
