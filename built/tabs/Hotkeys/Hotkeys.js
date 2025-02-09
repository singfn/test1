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
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var SettingsState_1 = __importDefault(require("../../states/SettingsState"));
var Chat_1 = require("../../communication/Chat");
var QuickRespawn_1 = __importDefault(require("./QuickRespawn"));
var Hotkeys = /** @class */ (function () {
    function Hotkeys(controller) {
        this.controller = controller;
        this.quickRespawnHandler = new QuickRespawn_1.default(controller);
        window.GameAPI.hotkeys = this;
    }
    Hotkeys.prototype.splitTimes = function (times, emitter) {
        for (var i = 0; i < times; i++) {
            setTimeout(function () {
                emitter.sendMousePosition(true);
                emitter.sendSplit();
            }, i * 41);
        }
    };
    Hotkeys.prototype.feed = function () {
        var _a = this.controller, firstTabSocket = _a.firstTabSocket, secondTabSocket = _a.secondTabSocket, currentFocusedTab = _a.currentFocusedTab;
        if (currentFocusedTab === 'FIRST_TAB') {
            firstTabSocket.emitter.sendFeed();
        }
        else {
            secondTabSocket.emitter.sendFeed();
        }
    };
    Hotkeys.prototype.macroFeed = function () {
        var _a = this.controller, firstTabSocket = _a.firstTabSocket, secondTabSocket = _a.secondTabSocket, currentFocusedTab = _a.currentFocusedTab;
        if (!this.macroFeedInterval) {
            if (currentFocusedTab === 'FIRST_TAB') {
                firstTabSocket.emitter.sendFeed();
            }
            else {
                secondTabSocket.emitter.sendFeed();
            }
            this.macroFeedInterval = setInterval(function () {
                if (currentFocusedTab === 'FIRST_TAB') {
                    firstTabSocket.emitter.sendFeed();
                }
                else {
                    secondTabSocket.emitter.sendFeed();
                }
            }, 40);
        }
    };
    Hotkeys.prototype.stopFeed = function () {
        clearTimeout(this.macroFeedInterval);
        this.macroFeedInterval = null;
    };
    Hotkeys.prototype.split = function () {
        if (this.controller.currentFocusedTab === 'FIRST_TAB') {
            this.splitTimes(1, this.controller.firstTabSocket.emitter);
        }
        else {
            this.splitTimes(1, this.controller.secondTabSocket.emitter);
        }
    };
    Hotkeys.prototype.doubleSplit = function () {
        if (this.controller.currentFocusedTab === 'FIRST_TAB') {
            this.splitTimes(2, this.controller.firstTabSocket.emitter);
        }
        else {
            this.splitTimes(2, this.controller.secondTabSocket.emitter);
        }
    };
    Hotkeys.prototype.tripleSplit = function () {
        if (this.controller.currentFocusedTab === 'FIRST_TAB') {
            this.splitTimes(3, this.controller.firstTabSocket.emitter);
        }
        else {
            this.splitTimes(3, this.controller.secondTabSocket.emitter);
        }
    };
    Hotkeys.prototype.split16 = function () {
        if (this.controller.currentFocusedTab === 'FIRST_TAB') {
            this.splitTimes(4, this.controller.firstTabSocket.emitter);
        }
        else {
            this.splitTimes(4, this.controller.secondTabSocket.emitter);
        }
    };
    Hotkeys.prototype.quickRespawn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.quickRespawnHandler.handle();
                return [2 /*return*/];
            });
        });
    };
    // toggle
    Hotkeys.prototype.pauseCell = function () {
        var _a = this.controller, firstTabSocket = _a.firstTabSocket, secondTabSocket = _a.secondTabSocket, currentFocusedTab = _a.currentFocusedTab;
        if (PlayerState_1.default.first.playing && currentFocusedTab === 'FIRST_TAB') {
            if (firstTabSocket.isPaused()) {
                firstTabSocket.resumeCell();
            }
            else {
                firstTabSocket.stopCell();
            }
        }
        if (PlayerState_1.default.second.playing && currentFocusedTab === 'SECOND_TAB') {
            if (secondTabSocket.isPaused()) {
                secondTabSocket.resumeCell();
            }
            else {
                secondTabSocket.stopCell();
            }
        }
    };
    Hotkeys.prototype.toggleCellHelpers = function () {
    };
    Hotkeys.prototype.toggleCellSkins = function () {
        SettingsState_1.default.allowSkins = !SettingsState_1.default.allowSkins;
    };
    Hotkeys.prototype.toggleMyCellStats = function () {
        SettingsState_1.default.showMassMyCell = !SettingsState_1.default.showMassMyCell;
        SettingsState_1.default.showNickMyCell = !SettingsState_1.default.showNickMyCell;
    };
    Hotkeys.prototype.toggleCellRings = function () {
        SettingsState_1.default.rings = !SettingsState_1.default.rings;
    };
    Hotkeys.prototype.switchTabs = function () {
        var _this = this;
        if (!this.controller.world.scene.settings.all.settings.game.multibox.enabled) {
            return;
        }
        if (PlayerState_1.default.first.playing && PlayerState_1.default.second.playing) {
            if (this.controller.currentFocusedTab === 'FIRST_TAB') {
                this.controller.setSecondTabActive();
            }
            else {
                this.controller.setFirstTabActive();
            }
            return;
        }
        if (PlayerState_1.default.first.playing) {
            if (!PlayerState_1.default.second.spawning) {
                PlayerState_1.default.second.spawning = true;
                FrontAPI_1.default.sendChatGameMessage('Attempting to spawn second tab.');
                this.controller.spawnSecondTab().then(function () {
                    _this.controller.setSecondTabActive();
                    PlayerState_1.default.second.spawning = false;
                    PlayerState_1.default.second.shouldBeReconnected = false;
                }).catch(function () {
                    FrontAPI_1.default.sendChatGameMessage('Second tab spawn failed.');
                    PlayerState_1.default.second.spawning = false;
                    PlayerState_1.default.second.shouldBeReconnected = false;
                });
            }
            else {
                if (PlayerState_1.default.second.shouldBeReconnected) {
                    FrontAPI_1.default.sendChatGameMessage('Reconnecting second tab.');
                    PlayerState_1.default.second.shouldBeReconnected = false;
                    this.controller.disconnectSecondTab();
                    this.controller.connectSecondPlayerTab().then(function () {
                        PlayerState_1.default.second.spawning = true;
                        FrontAPI_1.default.sendChatGameMessage('Attempting to spawn second tab.');
                        _this.controller.spawnSecondTab().then(function () {
                            _this.controller.setSecondTabActive();
                            PlayerState_1.default.second.spawning = false;
                        });
                    });
                }
                else {
                    FrontAPI_1.default.sendChatGameMessage('Second tab is already attempting to spawn. Press again to reconnect.');
                    PlayerState_1.default.second.shouldBeReconnected = true;
                }
            }
        }
        if (PlayerState_1.default.second.playing) {
            if (!PlayerState_1.default.first.spawning) {
                PlayerState_1.default.first.spawning = true;
                FrontAPI_1.default.sendChatGameMessage('Attempting to spawn first tab.');
                this.controller.spawnFirstTab().then(function () {
                    _this.controller.setFirstTabActive();
                    PlayerState_1.default.first.spawning = false;
                    PlayerState_1.default.first.shouldBeReconnected = false;
                }).catch(function () {
                    FrontAPI_1.default.sendChatGameMessage('First tab spawn failed.');
                    PlayerState_1.default.first.spawning = false;
                    PlayerState_1.default.first.shouldBeReconnected = false;
                });
            }
            else {
                if (PlayerState_1.default.first.shouldBeReconnected) {
                    FrontAPI_1.default.sendChatGameMessage('Reconnecting first tab.');
                    PlayerState_1.default.first.shouldBeReconnected = false;
                    this.controller.disconnectFirstTab();
                    this.controller.connectFirstPlayerTab().then(function () {
                        PlayerState_1.default.first.spawning = true;
                        FrontAPI_1.default.sendChatGameMessage('Attempting to spawn first tab.');
                        _this.controller.spawnFirstTab().then(function () {
                            _this.controller.setFirstTabActive();
                            PlayerState_1.default.first.spawning = false;
                        });
                    });
                }
                else {
                    FrontAPI_1.default.sendChatGameMessage('First tab is already attempting to spawn. Press again to reconnect.');
                    PlayerState_1.default.first.shouldBeReconnected = true;
                }
            }
            return;
        }
    };
    Hotkeys.prototype.toggleFullmapViewRender = function () {
        SettingsState_1.default.fullMapViewRender = !SettingsState_1.default.fullMapViewRender;
        var message = SettingsState_1.default.fullMapViewRender ? 'Is now shown' : 'Is now hidden';
        FrontAPI_1.default.sendChatGameMessage(message, Chat_1.ChatAuthor.Spectator);
    };
    Hotkeys.prototype.sendCommand = function (text) {
        this.controller.world.ogar.firstTab.sendChatCommander(text);
    };
    return Hotkeys;
}());
exports.default = Hotkeys;
