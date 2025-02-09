"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Socket_1 = __importDefault(require("../Socket/Socket"));
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var FullmapController_1 = __importDefault(require("./FullmapController"));
var Logger_1 = __importDefault(require("../../utils/Logger"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var Chat_1 = require("../../communication/Chat");
var FrontAPI_2 = __importDefault(require("../../communication/FrontAPI"));
var helpers_1 = require("../../utils/helpers");
var Controller = /** @class */ (function () {
    function Controller(world) {
        this.world = world;
        this.topOneViewEnabled = false;
        this.currentFocusedTab = 'FIRST_TAB';
        this.fullmapController = new FullmapController_1.default(this);
        this.logger = new Logger_1.default('TabsController');
    }
    Controller.prototype.init = function (socketData) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var reg_1, spectatorMode, mapOffsets, reason_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.disconnectAll();
                        if (socketData) {
                            this.socketData = socketData;
                            reg_1 = '';
                            if (this.world.master.gameMode.get() === ':private') {
                                reg_1 = helpers_1.wsToToken(socketData.address);
                            }
                            else {
                                reg_1 = socketData.https.match(/live-arena-([\w\d]+)\.agar\.io:\d+/)[1];
                            }
                            if (!this.world.ogar.connected) {
                                window.GameAPI.connectOgar().then(function () { return _this.world.ogar.join(reg_1, socketData.token); });
                            }
                            else {
                                this.world.ogar.join(reg_1, socketData.token);
                            }
                        }
                        spectatorMode = this.world.scene.settings.all.settings.game.gameplay.spectatorMode;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connectFirstPlayerTab()];
                    case 2:
                        mapOffsets = _a.sent();
                        switch (spectatorMode) {
                            case 'Full map':
                                this.enableFullMapView();
                                break;
                            case 'Top one':
                                this.connectTopOneTab();
                                break;
                        }
                        if (this.world.scene.settings.all.settings.game.multibox.enabled) {
                            this.connectSecondPlayerTab();
                        }
                        resolve(mapOffsets);
                        return [3 /*break*/, 4];
                    case 3:
                        reason_1 = _a.sent();
                        reject(reason_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
    Controller.prototype.connectFirstPlayerTab = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.disconnectFirstTab();
            FrontAPI_1.default.setFirstTabStatus('CONNECTING');
            _this.firstTabSocket = new Socket_1.default(_this.socketData, 'FIRST_TAB', _this.world);
            _this.firstTabSocket.init().then(function () {
                FrontAPI_1.default.setFirstTabStatus('CONNECTED');
                FrontAPI_1.default.sendChatGameMessage('Main player tab connected.', Chat_1.ChatAuthor.Game);
                resolve(_this.firstTabSocket.mapOffsets);
            }).catch(function (reason) { return reject(reason); });
            _this.firstTabSocket.onDisconnect(function () {
                FrontAPI_1.default.sendChatGameMessage('Main player tab disconnected.', Chat_1.ChatAuthor.Game);
                FrontAPI_1.default.setFirstTabStatus('DISCONNECTED');
                FrontAPI_1.default.updateLeaderboard([]);
            });
        });
    };
    Controller.prototype.connectSecondPlayerTab = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.firstTabSocket) {
                _this.logger.error('First player tab is not connected yet');
                FrontAPI_1.default.sendChatGameMessage('Could not connect second player tab: main tab is not connected yet.', Chat_1.ChatAuthor.Game);
                return reject();
            }
            _this.disconnectSecondTab();
            FrontAPI_1.default.sendChatGameMessage('Second player tab disconnected.', Chat_1.ChatAuthor.Game);
            FrontAPI_1.default.setSecondTabStatus('DISCONNECTED');
            if (_this.world.master.gameMode.get() !== ':party') {
                FrontAPI_2.default.sendChatGameMessage('Multibox is not available.', Chat_1.ChatAuthor.Game);
                return reject();
            }
            _this.secondTabSocket = new Socket_1.default(_this.socketData, 'SECOND_TAB', _this.world);
            FrontAPI_1.default.setSecondTabStatus('CONNECTING');
            _this.secondTabSocket.init().then(function () {
                FrontAPI_1.default.sendChatGameMessage('Second player tab connected.', Chat_1.ChatAuthor.Game);
                FrontAPI_1.default.setSecondTabStatus('CONNECTED');
                resolve();
            });
            _this.secondTabSocket.onDisconnect(function () {
                FrontAPI_1.default.sendChatGameMessage('Second player tab disconnected.', Chat_1.ChatAuthor.Game);
                FrontAPI_1.default.setSecondTabStatus('DISCONNECTED');
            });
        });
    };
    Controller.prototype.connectTopOneTab = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.firstTabSocket) {
                _this.logger.error('First player tab is not connected yet');
                FrontAPI_1.default.sendChatGameMessage('Could not connect top 1 tab. Main tab is not connected yet.', Chat_1.ChatAuthor.Spectator);
                return reject();
            }
            if (_this.topOneViewEnabled) {
                _this.logger.error('Top one (spectator) tab is already enabled');
                return reject();
            }
            _this.disconnectTopOneTab();
            if (_this.world.master.gameMode.get() !== ':party') {
                FrontAPI_2.default.sendChatGameMessage('Top one view is not available.', Chat_1.ChatAuthor.Spectator);
                return reject();
            }
            _this.topOneTabSocket = new Socket_1.default(_this.socketData, 'TOP_ONE_TAB', _this.world);
            if (_this.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Top one') {
                FrontAPI_1.default.setSpectatorTabStatus('CONNECTING');
            }
            _this.topOneTabSocket.init().then(function () {
                FrontAPI_1.default.sendChatGameMessage('Top one view establised.', Chat_1.ChatAuthor.Spectator);
                _this.topOneTabSocket.spectate();
                _this.topOneViewEnabled = true;
                if (_this.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Top one') {
                    FrontAPI_1.default.setSpectatorTabStatus('CONNECTED');
                }
                resolve();
            });
            _this.topOneTabSocket.onDisconnect(function () {
                if (_this.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Top one') {
                    FrontAPI_1.default.setSpectatorTabStatus('DISCONNECTED');
                }
            });
        });
    };
    Controller.prototype.disconnectFirstTab = function () {
        this.firstTabSocket && this.firstTabSocket.destroy();
    };
    Controller.prototype.disconnectSecondTab = function () {
        this.secondTabSocket && this.secondTabSocket.destroy();
    };
    Controller.prototype.disconnectTopOneTab = function () {
        this.topOneTabSocket && this.topOneTabSocket.destroy();
        this.topOneViewEnabled = false;
    };
    Controller.prototype.disconnectFullMapView = function () {
        this.fullmapController.disconnectAll();
        this.disconnectTopOneTab();
    };
    Controller.prototype.disconnectAll = function () {
        this.disconnectFirstTab();
        this.disconnectSecondTab();
        this.disconnectTopOneTab();
        this.disconnectFullMapView();
    };
    Controller.prototype.setFirstTabActive = function () {
        this.currentFocusedTab = 'FIRST_TAB';
        PlayerState_1.default.second.focused = false;
        PlayerState_1.default.first.focused = true;
        this.world.setMultiboxTabRingsActive('FIRST_TAB');
    };
    Controller.prototype.setSecondTabActive = function () {
        this.currentFocusedTab = 'SECOND_TAB';
        PlayerState_1.default.second.focused = true;
        PlayerState_1.default.first.focused = false;
        this.world.setMultiboxTabRingsActive('SECOND_TAB');
    };
    Controller.prototype.spectateFree = function () {
        var _this = this;
        this.firstTabSocket.emitter.sendSpectate();
        setTimeout(function () { return _this.firstTabSocket.emitter.sendFreeSpectate(); }, 120);
        PlayerState_1.default.first.focused = true;
    };
    Controller.prototype.stopFreeSpectate = function () {
        this.firstTabSocket.emitter.sendFreeSpectate();
        PlayerState_1.default.first.focused = false;
    };
    Controller.prototype.spawnFirstTab = function () {
        var _this = this;
        this.firstTabSocket.emitter.handleSpawn(this.world.scene.settings.all.profiles.leftProfileNick);
        return new Promise(function (resolve, reject) {
            _this.firstTabSocket.onPlayerSpawn = resolve;
            _this.firstTabSocket.onDisconnect(function () { return reject(); });
        });
    };
    Controller.prototype.spawnSecondTab = function () {
        var _this = this;
        if (this.world.master.gameMode.get() !== ':party') {
            FrontAPI_2.default.sendChatGameMessage('Mutibox is not available.', Chat_1.ChatAuthor.Game);
            this.disconnectSecondTab();
            return Promise.reject();
        }
        this.secondTabSocket.emitter.handleSpawn(this.world.scene.settings.all.profiles.rightProfileNick);
        return new Promise(function (resolve, reject) {
            _this.secondTabSocket.onPlayerSpawn = resolve;
            _this.firstTabSocket.onDisconnect(function () { return reject(); });
        });
    };
    Controller.prototype.enableFullMapView = function () {
        if (this.world.master.gameMode.get() === ':party') {
            if (this.firstTabSocket) {
                this.disconnectFullMapView();
                this.fullmapController.enable();
            }
            else {
                this.logger.error('First player tab is not connected yet');
            }
        }
        else {
            FrontAPI_2.default.sendChatGameMessage('Full map is not available.', Chat_1.ChatAuthor.Spectator);
        }
    };
    return Controller;
}());
exports.default = Controller;
