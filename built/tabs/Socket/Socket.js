"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../../utils/helpers");
var Receiver_1 = __importDefault(require("./Receiver"));
var Emitter_1 = __importDefault(require("./Emitter"));
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var WorldState_1 = __importDefault(require("../../states/WorldState"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var FacebookLogin_1 = __importDefault(require("../Login/FacebookLogin"));
var GoogleLogin_1 = __importDefault(require("../Login/GoogleLogin"));
var Opcodes_1 = require("./Opcodes");
var Logger_1 = __importDefault(require("../../utils/Logger"));
var CallbacksHandler_1 = __importDefault(require("./CallbacksHandler"));
var Chat_1 = require("../../communication/Chat");
var Captcha_1 = __importDefault(require("./Captcha/Captcha"));
var types_1 = require("./types");
var Socket = /** @class */ (function () {
    function Socket(socketData, tabType, world) {
        this.socketData = socketData;
        this.tabType = tabType;
        this.protocolKey = 0;
        this.clientKey = -1;
        this.mapOffsetFixed = false;
        this.mapOffsets = { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
        this.offsetsPositionMultiplier = { x: 1, y: 1 };
        this.playerSpawned = false;
        this.shiftOffsets = { x: 0, y: 0 };
        this.world = world;
        this.receiver = new Receiver_1.default(this);
        this.disconnectHandler = new CallbacksHandler_1.default();
        this.emitter = new Emitter_1.default(this);
        this.logger = new Logger_1.default('AgarSocket');
    }
    Socket.prototype.init = function () {
        var _this = this;
        switch (this.tabType) {
            case 'FIRST_TAB':
                PlayerState_1.default.first.connecting = true;
                break;
            case 'SECOND_TAB':
                PlayerState_1.default.second.connecting = true;
                break;
        }
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () {
                if (!_this.connectionOpened) {
                    _this.disconnectHandler.execute();
                    reject(types_1.SOCKET_CONNECTION_REJECT.NO_RESPONSE_FROM_SERVER);
                }
            }, 3000);
            _this.socket = new WebSocket(_this.socketData.address);
            _this.socket.binaryType = 'arraybuffer';
            _this.socket.onopen = function () { return _this.receiver.handleHandshake(); };
            _this.socket.onmessage = function (msg) { return _this.handleMessage(msg.data); };
            _this.socket.onclose = function () { return _this.disconnect(); };
            _this.socket.onerror = function () {
                if (!_this.connectionOpened) {
                    clearTimeout(timeout);
                    _this.disconnectHandler.execute();
                    reject(types_1.SOCKET_CONNECTION_REJECT.NO_HANDSHAKE);
                }
                else {
                    _this.disconnect();
                }
            };
            _this.socketInitCallback = resolve;
        });
    };
    Socket.prototype.disconnect = function () {
        switch (this.tabType) {
            case 'FIRST_TAB':
                PlayerState_1.default.first.playing = false;
                PlayerState_1.default.first.spawning = false;
                PlayerState_1.default.first.loggedIn = false;
                PlayerState_1.default.first.connected = false;
                PlayerState_1.default.first.connecting = false;
                this.world.view.firstTab.bounds = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
                break;
            case 'SECOND_TAB':
                PlayerState_1.default.second.playing = false;
                PlayerState_1.default.second.spawning = false;
                PlayerState_1.default.second.loggedIn = false;
                PlayerState_1.default.second.connected = false;
                PlayerState_1.default.second.connecting = false;
                this.world.view.secondTab.bounds = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
                break;
            case 'TOP_ONE_TAB':
                this.world.view.topOneTab.bounds = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
                this.world.view.topOneTab.viewport = { x: 0, y: 0, scale: 1 };
        }
        this.world.clearCellsByType(this.tabType);
        this.stopSendingPosition();
        if (this.connectionOpened) {
            this.disconnectHandler.execute();
        }
        clearTimeout(this.loginTimeoutId);
        this.connectionOpened = false;
    };
    Socket.prototype.onDisconnect = function (callback) {
        this.disconnectHandler.pushCallback(callback);
    };
    Socket.prototype.destroy = function () {
        this.socket.close();
    };
    Socket.prototype.hasReachedSpectatingPosition = function (viewport) {
        var reachedX = Math.abs(viewport.x - (this.mapOffsets.minX + this.spectateAtX)) < 100;
        var reachedY = Math.abs(viewport.y - (this.mapOffsets.minY + this.spectateAtY)) < 100;
        return reachedX && reachedY;
    };
    Socket.prototype.handleMessage = function (arrayBuffer) {
        var view = new DataView(arrayBuffer);
        if (this.protocolKey) {
            view = helpers_1.shiftMessage(view, this.protocolKey ^ this.socketData.clientVersionInt);
        }
        this.receiver.reader.setView(view);
        var opcode = this.receiver.reader.getUint8();
        switch (opcode) {
            case 64:
            case 16:
                this.receiver.handlePrivateServerMessage(opcode);
                break;
            case 161: break;
            case 5: break;
            case Opcodes_1.FLUSH: break;
            case Opcodes_1.VIEWPORT_UPDATE:
                var viewport = this.receiver.handleViewportUpdate();
                switch (this.tabType) {
                    case 'FIRST_TAB':
                        this.world.view.firstTab.viewportUpdate(viewport);
                        break;
                    case 'SECOND_TAB':
                        this.world.view.secondTab.viewportUpdate(viewport);
                        break;
                    case 'TOP_ONE_TAB':
                        this.world.view.topOneTab.viewportUpdate(viewport);
                        break;
                    case 'SPEC_TABS':
                        if (!this.reachedSpectatingPosition) {
                            if (this.hasReachedSpectatingPosition(viewport)) {
                                this.reachedSpectatingPosition = true;
                                clearInterval(this.sendMousePositionInterval);
                                if (typeof this.onFullMapViewEnabled === 'function') {
                                    this.onFullMapViewEnabled();
                                }
                            }
                        }
                        break;
                }
                break;
            case Opcodes_1.ADD_OWN_CELL:
                this.receiver.handleAddOwnCell();
                break;
            case Opcodes_1.LEADERBOARD:
            case Opcodes_1.LEADERBOARD2:
                if (this.tabType === 'FIRST_TAB') {
                    opcode === 54 && this.receiver.reader.shiftOffset(2);
                    FrontAPI_1.default.updateLeaderboard(this.receiver.handleLeaderboardUpdate());
                }
                break;
            case Opcodes_1.GHOST_CELLS:
                if (this.tabType === 'FIRST_TAB') {
                    var ghostCells = this.receiver.handleGhostCells();
                    FrontAPI_1.default.updateGhostCells(ghostCells);
                    this.world.minimap.updateGhostCells(ghostCells);
                }
                break;
            case Opcodes_1.RECAPTCHA_V2:
                Captcha_1.default.V2.handle(this);
                break;
            case Opcodes_1.RECAPTCHA_V3:
                Captcha_1.default.V3.handle(this);
                break;
            case Opcodes_1.SERVER_DEATH:
                if (typeof this.onServerDeath === 'function') {
                    this.onServerDeath();
                }
                this.disconnect();
                break;
            case Opcodes_1.TOKEN_ACCEPTED:
                break;
            /*       case MOBILE_DATA:
                    if (this.emit("mobiledata", new Uint8Array(e.buffer.slice(1))), 1 == (a = (i = new L(e, o)).readFlag()) && i.setContentType(), 2 == (a = i.readFlag()) && i.setUncompressedSize(), 1 == (a = i.readFlag())) switch (a = i.readUint32(), i.readFlag(), i.readUint32(), a) {
                      case 20:
                        Array.from(new Uint8Array(e.buffer)).map((function (e) {
                          return String.fromCharCode(e)
                        })).join(""), i = e.getUint8(e.byteLength - 1), console.log("Disconnected by server"), this.disconnectMessage(i), this.loggedIn = !1, this.parent.emit("logout", this), this.emit("logout", this);
                        break;
                      case 62:
                        Array.from(new Uint8Array(e.buffer)).map((function (e) {
                          return String.fromCharCode(e)
                        })).join("")
                    } */
            case Opcodes_1.PING_PONG:
                this.receiver.handlePingUpdate();
                break;
            case Opcodes_1.OUTDATED_CLIENT_ERROR:
                if (this.tabType === 'FIRST_TAB') {
                    FrontAPI_1.default.sendChatGameMessage('Client is outdated. An update is required.');
                }
                break;
            case Opcodes_1.SPECTATE_MODE_IS_FULL:
                FrontAPI_1.default.sendChatGameMessage('Spectate error: slots are full.', Chat_1.ChatAuthor.Spectator);
                break;
            case Opcodes_1.GENERATE_KEYS:
                this.receiver.generateKeys();
                break;
            case Opcodes_1.SERVER_TIME:
                this.tryLogin();
                break;
            case Opcodes_1.COMPRESSED_MESSAGE:
                // no need to decompress, reveice only viewport
                if (this.tabType === 'TOP_ONE_TAB' && this.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Full map' && this.mapOffsetFixed) {
                    return;
                }
                this.receiver.handleCompressedMessage();
                break;
            default:
                this.logger.warning("Unhandled opcode: " + opcode);
                break;
        }
    };
    Socket.prototype.tryLogin = function () {
        if (this.world.master.gameMode.get() === ':private') {
            return;
        }
        if (this.tabType === 'FIRST_TAB' || this.tabType === 'SECOND_TAB') {
            FacebookLogin_1.default.logIn(this);
            GoogleLogin_1.default.logIn(this);
        }
    };
    Socket.prototype.sendMessage = function (message) {
        if (this.socket.readyState === Opcodes_1.SOCKET_OPENED) {
            if (this.clientKey !== -1) {
                message = helpers_1.shiftMessage(message, this.clientKey);
                this.clientKey = helpers_1.shiftKey(this.clientKey);
            }
            this.socket.send(message.buffer);
        }
    };
    Socket.prototype.send = function (view) {
        this.socket.send(view.buffer);
    };
    Socket.prototype.setMapOffset = function (offsets) {
        if (this.mapOffsetFixed) {
            return;
        }
        this.mapOffsetFixed = true;
        this.mapOffsets = offsets;
        var minX = offsets.minX, minY = offsets.minY, maxX = offsets.maxX, maxY = offsets.maxY, width = offsets.width, height = offsets.height;
        // world is not created. set global offsets 
        if (!WorldState_1.default.gameJoined) {
            if (this.tabType === 'FIRST_TAB') {
                WorldState_1.default.mapOffsets = offsets;
            }
        }
        else {
            this.shiftOffsets.x = (WorldState_1.default.mapOffsets.minX - this.mapOffsets.minX);
            this.shiftOffsets.y = (WorldState_1.default.mapOffsets.minY - this.mapOffsets.minY);
        }
        var viewport = {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            scale: 1
        };
        if (this.tabType === 'FIRST_TAB') {
            this.world.view.firstTab.viewportUpdate(viewport);
            this.world.view.firstTab.setMapOffsets(this.mapOffsets, this.shiftOffsets);
        }
        if (this.tabType === 'SECOND_TAB') {
            this.world.view.secondTab.viewportUpdate(viewport);
            this.world.view.secondTab.setMapOffsets(this.mapOffsets, this.shiftOffsets);
        }
        if (this.tabType === 'TOP_ONE_TAB') {
            this.world.view.topOneTab.viewportUpdate(viewport);
            this.world.view.topOneTab.setMapOffsets(this.mapOffsets, this.shiftOffsets);
        }
        this.startSendingPosition();
        this.socketInitCallback(this.mapOffsets);
    };
    Socket.prototype.startSendingPosition = function () {
        var _this = this;
        this.sendMousePositionInterval = setInterval(function () { return _this.emitter.sendMousePosition(); }, 40);
    };
    Socket.prototype.stopSendingPosition = function () {
        clearInterval(this.sendMousePositionInterval);
        this.sendMousePositionInterval = null;
    };
    Socket.prototype.stopCell = function () {
        var _this = this;
        if (this.tabType === 'TOP_ONE_TAB' || this.tabType === 'SPEC_TABS') {
            return;
        }
        this.stopSendingPosition();
        switch (this.tabType) {
            case 'FIRST_TAB':
                var firstTab_1 = this.world.view.firstTab;
                setTimeout(function () { return _this.emitter.sendMousePosition(true, firstTab_1.viewport.x, firstTab_1.viewport.y); }, 40);
                break;
            case 'SECOND_TAB':
                var secondTab_1 = this.world.view.secondTab;
                setTimeout(function () { return _this.emitter.sendMousePosition(true, secondTab_1.viewport.x, secondTab_1.viewport.y); }, 40);
                break;
        }
    };
    Socket.prototype.resumeCell = function () {
        if (this.tabType === 'TOP_ONE_TAB' || this.tabType === 'SPEC_TABS') {
            return;
        }
        this.startSendingPosition();
    };
    Socket.prototype.isPaused = function () {
        return this.sendMousePositionInterval === null;
    };
    Socket.prototype.spectate = function (x, y) {
        if (this.tabType === 'SPEC_TABS') {
            this.spectateAtX = x;
            this.spectateAtY = y;
            this.emitter.sendSpectate();
            this.emitter.sendFreeSpectate();
        }
        else {
            this.emitter.sendSpectate();
        }
    };
    return Socket;
}());
exports.default = Socket;
