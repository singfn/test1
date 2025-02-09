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
var Logger_1 = __importDefault(require("../utils/Logger"));
var WorldState_1 = __importDefault(require("../states/WorldState"));
var FacebookLogin_1 = __importDefault(require("../tabs/Login/FacebookLogin"));
var GoogleLogin_1 = __importDefault(require("../tabs/Login/GoogleLogin"));
var helpers_1 = require("../utils/helpers");
var GameAPI = /** @class */ (function () {
    function GameAPI(stage) {
        this.stage = stage;
        this.logger = new Logger_1.default('GameAPI');
    }
    /*************** Master ***************/
    GameAPI.prototype.setMode = function (mode) {
        this.stage.master.gameMode.set(mode);
        this.logger.info("Game mode changed to [" + mode + "]");
    };
    GameAPI.prototype.setRegion = function (index) {
        this.stage.master.regions.setCurrent(index);
        this.logger.info("Game region changed to [name: " + this.stage.master.regions.getCurrent() + ", index: " + index + "]");
    };
    /*************** Ogar ***************/
    GameAPI.prototype.connectOgar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stage.ogar.firstTab.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.stage.ogar.secondTab.connect()];
                    case 2:
                        _a.sent();
                        if (!this.stage.ogar.connected) {
                            this.stage.ogar.connected = true;
                            this.stage.ogar.firstTab.player.nick = this.stage.settings.all.profiles.leftProfileNick;
                            this.stage.ogar.firstTab.player.skin = this.stage.settings.all.profiles.leftProfileSkinUrl;
                            this.stage.ogar.secondTab.player.nick = this.stage.settings.all.profiles.rightProfileNick;
                            this.stage.ogar.secondTab.player.skin = this.stage.settings.all.profiles.rightProfileSkinUrl;
                            token = '';
                            if (this.stage.world.master.gameMode.get() === ':private') {
                                token = helpers_1.wsToToken(this.stage.world.controller.socketData.address);
                            }
                            else {
                                token = this.stage.world.controller.socketData.https.match(/live-arena-([\w\d]+)\.agar\.io:\d+/)[1];
                            }
                            if (WorldState_1.default.gameJoined) {
                                this.stage.ogar.firstTab.join(token);
                                this.stage.ogar.secondTab.join(token);
                            }
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameAPI.prototype.disconnectOgar = function () {
        if (this.stage.ogar.connected) {
            this.stage.ogar.firstTab.disconnect();
            this.stage.ogar.secondTab.disconnect();
            this.stage.ogar.connected = false;
        }
    };
    GameAPI.prototype.setTag = function () {
        this.stage.ogar.firstTab.player.tag = this.stage.settings.all.profiles.tag;
        this.stage.ogar.firstTab.emitter.sendPlayerTag();
        if (this.stage.ogar.secondTab) {
            this.stage.ogar.secondTab.player.tag = this.stage.settings.all.profiles.tag;
            this.stage.ogar.secondTab.emitter.sendPlayerTag();
        }
    };
    GameAPI.prototype.setFirstTabNick = function () {
        this.stage.ogar.firstTab.player.nick = this.stage.settings.all.profiles.leftProfileNick;
        this.stage.ogar.firstTab.emitter.sendPlayerNick();
    };
    GameAPI.prototype.setFirstTabSkin = function () {
        var leftProfileSkinUrl = this.stage.settings.all.profiles.leftProfileSkinUrl;
        this.stage.ogar.firstTab.player.skin = leftProfileSkinUrl;
        this.stage.ogar.firstTab.emitter.sendPlayerSkin();
        this.stage.world.skinsLoader.getCustomSkin(leftProfileSkinUrl, function () { });
    };
    GameAPI.prototype.setSecondTabNick = function () {
        var rightProfileNick = this.stage.settings.all.profiles.rightProfileNick;
        this.stage.ogar.secondTab.player.nick = rightProfileNick;
        this.stage.ogar.secondTab.emitter.sendPlayerNick();
    };
    GameAPI.prototype.setSecondTabSkin = function () {
        var rightProfileSkinUrl = this.stage.settings.all.profiles.rightProfileSkinUrl;
        this.stage.ogar.secondTab.player.skin = rightProfileSkinUrl;
        this.stage.ogar.secondTab.emitter.sendPlayerSkin();
        this.stage.world.skinsLoader.getCustomSkin(rightProfileSkinUrl, function () { });
    };
    GameAPI.prototype.sendMessage = function (message) {
        this.stage.ogar.firstTab.sendChat(message);
    };
    GameAPI.prototype.sendCommand = function (message) {
        this.stage.ogar.firstTab.sendChatCommander(message);
    };
    /*************** View ***************/
    GameAPI.prototype.spectateTopOne = function () {
        if (!this.stage.world.controller.firstTabSocket) {
            return;
        }
        WorldState_1.default.spectator.free && this.stage.world.controller.stopFreeSpectate();
        var spectatorMode = this.stage.settings.all.settings.game.gameplay.spectatorMode;
        var gameMode = this.stage.master.gameMode.get();
        this.stage.world.controller.firstTabSocket.emitter.sendSpectate();
        this.stage.world.view.spectateTopOne(true);
        // if (gameMode === ':party') {
        //   if (!this.stage.world.controller.topOneViewEnabled) {
        //     this.stage.world.controller.connectTopOneTab().then(() => {
        //       this.stage.world.view.spectateTopOne(false);
        //     });
        //   } else {
        //     this.stage.world.view.spectateTopOne(false);
        //   }
        // } else {
        //   this.stage.world.controller.firstTabSocket.emitter.sendSpectate();
        //   this.stage.world.view.spectateTopOne(true);
        // }
    };
    GameAPI.prototype.spectateCenter = function () {
        if (!this.stage.world.controller.firstTabSocket) {
            return;
        }
        if (WorldState_1.default.spectator.topOne && WorldState_1.default.spectator.topOneWithFirst) {
            this.stage.world.controller.firstTabSocket.emitter.sendSpectate();
        }
        if (WorldState_1.default.spectator.free) {
            this.stage.world.controller.stopFreeSpectate();
        }
        this.stage.world.view.center();
    };
    GameAPI.prototype.spectateTarget = function () {
        return;
        if (!this.stage.world.controller.firstTabSocket) {
            return;
        }
        if (WorldState_1.default.spectator.topOne && WorldState_1.default.spectator.topOneWithFirst) {
            this.stage.world.controller.firstTabSocket.emitter.sendSpectate();
        }
        if (WorldState_1.default.spectator.free) {
            this.stage.world.controller.stopFreeSpectate();
        }
    };
    GameAPI.prototype.spectateFree = function () {
        if (!this.stage.world.controller.firstTabSocket) {
            return;
        }
        if (WorldState_1.default.spectator.topOne && WorldState_1.default.spectator.topOneWithFirst) {
            this.stage.world.controller.firstTabSocket.emitter.sendSpectate();
        }
        if (!WorldState_1.default.spectator.free) {
            this.stage.world.controller.spectateFree();
        }
        this.stage.world.view.freeSpectate();
    };
    /*************** Socket controller ***************/
    GameAPI.prototype.reconnectFirstTab = function () {
        var _this = this;
        this.stage.world.controller.disconnectFirstTab();
        setTimeout(function () { return _this.stage.world.controller.connectFirstPlayerTab(); }, 200);
    };
    GameAPI.prototype.reconnectSecondTab = function () {
        var _this = this;
        this.stage.world.controller.disconnectSecondTab();
        setTimeout(function () { return _this.stage.world.controller.connectSecondPlayerTab(); }, 200);
    };
    GameAPI.prototype.reconnectSpectator = function () {
        var _this = this;
        var spectatorMode = this.stage.settings.all.settings.game.gameplay.spectatorMode;
        if (spectatorMode === 'Disabled') {
            return;
        }
        if (spectatorMode === 'Top one') {
            this.stage.world.controller.disconnectTopOneTab();
            setTimeout(function () { return _this.stage.world.controller.connectTopOneTab(); }, 200);
        }
        if (spectatorMode === 'Full map') {
            this.stage.world.controller.disconnectFullMapView();
            setTimeout(function () { return _this.stage.world.controller.enableFullMapView(); }, 200);
        }
    };
    GameAPI.prototype.fullMapViewAbort = function () {
        var _this = this;
        setTimeout(function () { return _this.setFullMapView(false); }, 333);
    };
    GameAPI.prototype.setFullMapView = function (enabled) {
        if (enabled) {
            this.stage.world.controller.enableFullMapView();
        }
        else {
            this.stage.world.controller.disconnectFullMapView();
            if (this.stage.settings.all.settings.game.minimap.realPlayersCells && this.stage.settings.all.settings.game.gameplay.spectatorMode !== 'Top one') {
                this.stage.world.minimap.reset();
            }
        }
    };
    GameAPI.prototype.setTopOneView = function (enabled) {
        if (enabled) {
            this.stage.world.controller.disconnectFullMapView();
            this.stage.world.controller.connectTopOneTab();
        }
        else {
            this.stage.world.controller.disconnectTopOneTab();
            this.stage.world.minimap.reset();
        }
    };
    GameAPI.prototype.setMultiboxEnabled = function (enabled) {
        if (enabled) {
            this.stage.world.controller.connectSecondPlayerTab();
            this.logger.info('Multibox mode enabled');
        }
        else {
            this.stage.world.controller.disconnectSecondTab();
            this.logger.info('Multibox mode disabled');
        }
    };
    /*************** Main ***************/
    GameAPI.prototype.play = function () {
        return this.stage.play();
    };
    GameAPI.prototype.join = function (token, serverToken) {
        return this.stage.connect(token, serverToken);
    };
    GameAPI.prototype.setSceneBlurred = function (blurred, zoom) {
        if (blurred) {
            this.stage.blurGameScene();
        }
        else {
            this.stage.unblurGameScene(zoom);
        }
    };
    /*************** Login ***************/
    GameAPI.prototype.logInWithFb = function () {
        FacebookLogin_1.default.prepareToken(this.stage.world.controller);
    };
    GameAPI.prototype.logOutWithFb = function () {
        FacebookLogin_1.default.logOut();
    };
    GameAPI.prototype.logInWithGoogle = function () {
        GoogleLogin_1.default.prepareToken(this.stage.world.controller);
    };
    GameAPI.prototype.logOutWithGoogle = function () {
        GoogleLogin_1.default.logOut();
    };
    return GameAPI;
}());
exports.default = GameAPI;
