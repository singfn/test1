"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var Reader_1 = __importDefault(require("../utils/Reader"));
var Emitter_1 = __importDefault(require("./Emitter"));
var Player_1 = __importDefault(require("./Player"));
var Receiver_1 = __importDefault(require("./Receiver"));
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var Opcodes_1 = require("../tabs/Socket/Opcodes");
var Logger_1 = __importDefault(require("../utils/Logger"));
var Chat_1 = require("../communication/Chat");
var FrontAPI_2 = __importDefault(require("../communication/FrontAPI"));
var Socket = /** @class */ (function () {
    function Socket(second, settings, master) {
        this.second = second;
        this.settings = settings;
        this.master = master;
        this.ip = 'wss://snez.org:8080/ws?040';
        this.handshakeKey = 401;
        this.emitter = new Emitter_1.default(this);
        this.receiver = new Receiver_1.default(this);
        this.player = new Player_1.default();
        this.team = new Map();
        this.connected = false;
        this.logger = new Logger_1.default('Delta Socket');
    }
    Socket.prototype.connect = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.connected) {
                resolve(true);
                return;
            }
            _this.ws = new WebSocket(_this.ip);
            _this.ws.binaryType = 'arraybuffer';
            _this.ws.onopen = function () {
                _this.onOpen();
                resolve(true);
            };
            _this.ws.onmessage = function (msg) { return _this.handleMessage(msg.data); };
            _this.ws.onerror = function () { return _this.onError(); };
            _this.ws.onclose = function () { return _this.onClose(); };
            _this.connected = true;
            _this.interval = setInterval(function () { return _this.updateInterval(); }, 1000);
        });
    };
    Socket.prototype.onOpen = function () {
        this.emitter.sendHandshake();
        var tab = this.second ? 'multibox tab' : 'main tab';
        FrontAPI_1.default.sendChatGameMessage("Delta server connection established (" + tab + ")", Chat_1.ChatAuthor.Game);
        this.logger.info("Delta server connection established (" + tab + ")");
        this.startTopTeamsUpdateInterval();
    };
    Socket.prototype.onClose = function () {
        var tab = this.second ? 'Multibox tab' : 'Main tab';
        FrontAPI_1.default.sendChatGameMessage("Delta server connection lost " + (tab), Chat_1.ChatAuthor.Game);
        clearInterval(this.interval);
        this.stopTopTeamsUpdateInterval();
        this.team.clear();
        this.connected = false;
    };
    Socket.prototype.onError = function () {
        this.logger.warning('Closed due to error');
    };
    Socket.prototype.isConnected = function () {
        return this.connected;
    };
    Socket.prototype.disconnect = function () {
        this.ws.close();
    };
    Socket.prototype.handleMessage = function (arrayBuffer) {
        var reader = new Reader_1.default(arrayBuffer, true);
        var opCode = reader.getUint8();
        switch (opCode) {
            case 0:
                this.player.id = reader.getUint32();
                break;
            case 1:
                this.emitter.sendPlayerUpdate();
                break;
            case 20:
                this.receiver.updateTeamPlayer(reader);
                break;
            case 30:
                this.receiver.updateTeamPlayerPosition(reader);
                break;
            case 100:
                this.receiver.getChatMessage(reader);
                break;
        }
    };
    Socket.prototype.add = function (id) {
        if (!this.team.has(id)) {
            var player = new Player_1.default(id);
            this.team.set(id, player);
        }
        return this.team.get(id);
    };
    Socket.prototype.send = function (arrayBuffer) {
        if (this.ws && this.ws.readyState === Opcodes_1.SOCKET_OPENED) {
            this.ws.send(arrayBuffer);
        }
    };
    Socket.prototype.sendChat = function (message) {
        var msg = this.player.nick + ": " + message;
        this.emitter.sendChatMessage(msg, 101);
    };
    Socket.prototype.sendChatCommander = function (message) {
        var msg = this.player.nick + ": " + message;
        this.emitter.sendChatMessage(msg, 102);
    };
    Socket.prototype.updateInterval = function () {
        this.team.forEach(function (player) {
            if (player.mass === 0 || (player.alive && Date.now() - player.updateTime >= 2000)) {
                player.alive = false;
            }
        });
        if (this.player.alive) {
            this.emitter.sendPlayerPositionUpdate();
        }
    };
    Socket.prototype.spawn = function () {
        if (this.player.alive) {
            return;
        }
        // this.emitter.sendPlayerNick();
        // this.emitter.sendPlayerTag();
        // this.emitter.sendPlayerJoin();
        this.emitter.sendPlayerSpawn();
    };
    Socket.prototype.death = function () {
        if (!this.player.alive) {
            return;
        }
        this.player.color.cell = '#000000';
        this.emitter.sendPlayerDeath();
    };
    Socket.prototype.updatePosition = function (x, y, mass) {
        this.player.position.x = x;
        this.player.position.y = y;
        this.player.mass = mass;
    };
    Socket.prototype.join = function (serverToken, partyToken) {
        if (partyToken === void 0) { partyToken = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.emitter.sendServerToken(serverToken);
                this.emitter.sendServerRegion();
                this.emitter.sendServerGamemode();
                this.emitter.sendCustomColor();
                this.emitter.sendPlayerTag();
                this.emitter.sendPlayerNick();
                this.emitter.sendPlayerSkin();
                this.emitter.sendPlayerDeath();
                this.emitter.sendPlayerJoin();
                return [2 /*return*/];
            });
        });
    };
    Socket.prototype.startTopTeamsUpdateInterval = function () {
        var _this = this;
        if (this.second) {
            return;
        }
        this.topTeamsUpdateInterval = setInterval(function () {
            var players = __spreadArray([], __read(_this.team.values())).map(function (player) {
                return __assign(__assign({}, player), { isAlive: player.alive });
            });
            FrontAPI_2.default.updateTopTeam(players);
        }, 1000);
    };
    Socket.prototype.stopTopTeamsUpdateInterval = function () {
        if (this.second) {
            return;
        }
        clearInterval(this.topTeamsUpdateInterval);
    };
    return Socket;
}());
exports.default = Socket;
