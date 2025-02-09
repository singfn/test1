"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../utils/helpers");
var Reader_1 = __importDefault(require("../../utils/Reader"));
var Logger_1 = __importDefault(require("../../utils/Logger"));
var GamePerformance_1 = __importDefault(require("../../GamePerformance"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var Receiver = /** @class */ (function () {
    function Receiver(socket) {
        this.socket = socket;
        this.socket = socket;
        this.reader = new Reader_1.default();
        this.logger = new Logger_1.default('SocketReceiver');
    }
    Receiver.prototype.handleHandshake = function () {
        switch (this.socket.tabType) {
            case 'FIRST_TAB':
                PlayerState_1.default.first.connected = true;
                PlayerState_1.default.second.connecting = false;
                break;
            case 'SECOND_TAB':
                PlayerState_1.default.second.connected = true;
                PlayerState_1.default.second.connecting = false;
                break;
        }
        this.socket.connectionOpened = true;
        var view = helpers_1.createView(5);
        view.setUint8(0, 254);
        view.setUint32(1, this.socket.socketData.protocolVersion, true);
        this.socket.send(view);
        view = helpers_1.createView(5);
        view.setUint8(0, 255);
        view.setUint32(1, this.socket.socketData.clientVersionInt, true);
        this.socket.send(view);
    };
    Receiver.prototype.handleViewportUpdate = function () {
        var x = this.reader.getFloat32();
        var y = this.reader.getFloat32();
        var scale = this.reader.getFloat32();
        return {
            x: x,
            y: y,
            scale: scale
        };
    };
    Receiver.prototype.handleAddOwnCell = function () {
        if (!this.socket.playerSpawned) {
            this.socket.playerSpawned = true;
            if (typeof this.socket.onPlayerSpawn === 'function') {
                this.socket.onPlayerSpawn();
            }
            this.socket.tryLogin();
        }
        this.socket.world.addPlayer(this.reader.getUint32(), this.socket.tabType);
    };
    Receiver.prototype.handleLeaderboardUpdate = function () {
        var lb = [];
        var position = 0;
        while (!this.reader.endOfBuffer()) {
            position++;
            var flags = this.reader.getUint8();
            var accountId = null;
            var nick = "An unnamed cell";
            var isMe = false;
            var isFriend = false;
            if (1 & flags) {
                position = this.reader.getUint16();
            }
            if (2 & flags) {
                var tmp = this.reader.getStringUTF8();
                if (tmp) {
                    nick = tmp;
                }
            }
            if (4 & flags) {
                accountId = this.reader.getUint32();
            }
            if (8 & flags) {
                isMe = true;
                if (this.socket.tabType === 'FIRST_TAB') {
                    nick = this.socket.world.scene.settings.all.profiles.leftProfileNick;
                }
                else if (this.socket.tabType === 'SECOND_TAB') {
                    nick = this.socket.world.scene.settings.all.profiles.rightProfileNick;
                }
            }
            if (16 & flags) {
                isFriend = true;
            }
            lb.push({ position: position, nick: nick, accountId: accountId, isMe: isMe });
        }
        return lb;
    };
    Receiver.prototype.handleGhostCells = function () {
        var cellLength = this.reader.getUint16();
        var ghostCells = [];
        for (var length_1 = 0; length_1 < cellLength; length_1++) {
            var playerX = this.reader.getInt32();
            var playerY = this.reader.getInt32();
            var totalMass = this.reader.getUint32();
            var size = ~~Math.sqrt(100 * totalMass);
            this.reader.shiftOffset(1);
            ghostCells.push({ playerX: playerX, playerY: playerY, totalMass: totalMass, size: size });
        }
        return ghostCells;
    };
    Receiver.prototype.handlePingUpdate = function () {
        var ping = this.reader.getUint16();
        var view = helpers_1.createView(3);
        view.setUint8(0, 227);
        view.setUint16(1, ping);
        this.socket.sendMessage(view);
    };
    Receiver.prototype.generateKeys = function () {
        this.socket.protocolKey = this.reader.getUint32();
        var serverVersion = '';
        var index = 0;
        while (index = this.reader.getUint8()) {
            serverVersion += String.fromCharCode(index);
        }
        var hashBuffer = this.socket.socketData.address.match(/(ws+:\/\/)([^:]*)(:\d+)?/)[2] + serverVersion;
        var seed = 255;
        this.socket.clientKey = helpers_1.murmur2(hashBuffer, seed);
    };
    Receiver.prototype.handleServerTime = function () {
        this.socket.serverTime = 1000 * this.reader.getUint32();
        this.socket.serverTimeDiff = Date.now() - this.socket.serverTime;
    };
    Receiver.prototype.handlePrivateServerMessage = function (opcode) {
        switch (opcode) {
            case 16:
                this.onWorldUpdate();
                break;
            case 64:
                this.socket.setMapOffset(this.getMapOffset());
                break;
            default: this.logger.error("Unknown decompress opcode " + opcode + " [PRIVATE SERVER]");
        }
    };
    Receiver.prototype.handleCompressedMessage = function () {
        this.reader.decompressMessage();
        var opcode = this.reader.getUint8();
        switch (opcode) {
            case 16:
                this.onWorldUpdate();
                break;
            case 64:
                this.socket.setMapOffset(this.getMapOffset());
                break;
            default: this.logger.error("Unknown decompress opcode " + opcode);
        }
    };
    Receiver.prototype.onWorldUpdate = function () {
        if (this.socket.tabType === 'FIRST_TAB') {
            GamePerformance_1.default.updateLoss();
        }
        var eatRecordsLen = this.reader.getUint16();
        for (var i = 0; i < eatRecordsLen; i++) {
            var eaterId = this.reader.getUint32();
            var victimId = this.reader.getUint32();
            this.socket.world.removeEaten(victimId, eaterId);
        }
        var cellUpdate = false;
        var id;
        while ((id = this.reader.getUint32()) !== 0) {
            var cellSkin = void 0;
            var name_1 = void 0;
            var isVirus = void 0;
            var red = void 0;
            var green = void 0;
            var blue = void 0;
            var isFood = void 0;
            var accountId = void 0;
            var isEjected = void 0;
            var x = this.reader.getInt32();
            var y = this.reader.getInt32();
            var r = this.reader.getUint16();
            var cellFlags = this.reader.getUint8();
            var cellFlags2 = cellFlags & 128 ? this.reader.getUint8() : 0;
            if (cellFlags & 1) {
                isVirus = true;
            }
            if (cellFlags & 2) {
                red = this.reader.getUint8();
                green = this.reader.getUint8();
                blue = this.reader.getUint8();
            }
            if (cellFlags & 4) {
                cellSkin = this.reader.getStringUTF8();
                if (cellSkin.includes('custom')) {
                    cellSkin = cellSkin.replace('%custom', 'skin_custom');
                }
                else {
                    cellSkin = cellSkin.replace('%', '');
                }
            }
            if (cellFlags & 8) {
                name_1 = this.reader.getStringUTF8();
            }
            if (cellFlags & 32) {
                isEjected = true;
            }
            if (cellFlags2 & 1) {
                isFood = true;
            }
            if (cellFlags2 & 4) {
                accountId = this.reader.getUint32();
            }
            // for FIRST_TAB shifts === 0 
            // only affects SECOND_TAB || TOP_ONE_TAB || SPEC_TABS
            x += this.socket.shiftOffsets.x * this.socket.offsetsPositionMultiplier.x;
            y += this.socket.shiftOffsets.y * this.socket.offsetsPositionMultiplier.y;
            var type = isFood ? 'FOOD' : isEjected ? 'EJECTED' : isVirus ? 'VIRUS' : 'CELL';
            var location_1 = { x: x, y: y, r: r };
            var color = { red: red, green: green, blue: blue };
            if (type === 'CELL') {
                if (name_1 === undefined) {
                    name_1 = '';
                }
                cellUpdate = true;
            }
            this.socket.world.add(id, location_1, color, name_1, type, this.socket.tabType, cellSkin);
        }
        var removeLen = this.reader.getUint16();
        for (var i = 0; i < removeLen; i++) {
            this.socket.world.removeOutOfView(this.reader.getUint32());
        }
        if (this.socket.tabType === 'FIRST_TAB' && cellUpdate) {
            this.socket.world.view.firstTab.sortRequired = true;
        }
        if (this.socket.tabType === 'SECOND_TAB' && cellUpdate) {
            this.socket.world.view.secondTab.sortRequired = true;
        }
        if (this.socket.tabType === 'TOP_ONE_TAB' && cellUpdate) {
            this.socket.world.view.topOneTab.sortRequired = true;
        }
    };
    Receiver.prototype.getMapOffset = function () {
        var minX = this.reader.getFloat64();
        var minY = this.reader.getFloat64();
        var maxX = this.reader.getFloat64();
        var maxY = this.reader.getFloat64();
        var width = Math.abs(maxX - minX);
        var height = Math.abs(maxY - minY);
        return { minX: minX, minY: minY, maxX: maxX, maxY: maxY, width: width, height: height };
    };
    Receiver.prototype.handleDisconnectMessage = function (messageParam) {
        switch (messageParam) {
            case 1:
                this.logger.error(this.socket.tabType + ": User disconnected. Incompatible client");
                break;
            case 2:
                this.logger.error(this.socket.tabType + ": User disconnected. Packet not authorized");
                break;
            case 3:
                this.logger.error(this.socket.tabType + ": User disconnected. Login elsewhere");
                break;
            case 4:
                this.logger.error(this.socket.tabType + ": User disconnected. Server offline");
                break;
            case 5:
                this.logger.error(this.socket.tabType + ": User disconnected. User banned");
                break;
            case 6:
                this.logger.error(this.socket.tabType + ": User disconnected. Ping error");
                break;
            case 7:
                this.logger.error(this.socket.tabType + ": User disconnected. Unknown game type");
                break;
            case 8:
                this.logger.error(this.socket.tabType + ": User disconnected. Too many operations");
                break;
            case 9:
                this.logger.error(this.socket.tabType + ": User disconnected. Unreachable realm");
                break;
            case 10:
                this.logger.error(this.socket.tabType + ": User disconnected. User deleted");
                break;
            case 11:
                this.logger.error(this.socket.tabType + ": User disconnected. Not authorized by realm");
                break;
            case 12:
                this.logger.error(this.socket.tabType + ": User disconnected. Bad request");
                break;
            case 13:
                this.logger.error(this.socket.tabType + ": User disconnected. Reset by peer");
                break;
            case 14:
                this.logger.error(this.socket.tabType + ": User disconnected. Invalid token");
                break;
            case 15:
                this.logger.error(this.socket.tabType + ": User disconnected. Expired token");
                break;
            case 16:
                this.logger.error(this.socket.tabType + ": User disconnected. State transfer error");
                break;
            default:
                this.logger.error(this.socket.tabType + ": User disconnected. Unknown error: " + messageParam);
        }
    };
    return Receiver;
}());
exports.default = Receiver;
