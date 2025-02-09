"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = __importStar(require("pixi.js"));
var pixi_js_1 = require("pixi.js");
var Globals_1 = __importDefault(require("../Globals"));
var TexturesGenerator_1 = __importDefault(require("../Textures/TexturesGenerator"));
var World_1 = __importDefault(require("../render/World"));
var filter_kawase_blur_1 = require("@pixi/filter-kawase-blur");
var Master_1 = __importDefault(require("../Master"));
var GameAPI_1 = __importDefault(require("../communication/GameAPI"));
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var WorldState_1 = __importDefault(require("../states/WorldState"));
var helpers_1 = require("../utils/helpers");
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var GamePerformance_1 = __importDefault(require("../GamePerformance"));
var Versions_1 = require("../Versions");
var Logger_1 = __importDefault(require("../utils/Logger"));
var types_1 = require("../tabs/Socket/types");
var Settings_1 = __importDefault(require("../Settings/Settings"));
var Ogar_1 = __importDefault(require("../Ogar"));
var Stage = /** @class */ (function () {
    function Stage() {
        this.logger = new Logger_1.default('Stage');
        pixi_js_1.utils.skipHello();
        console.log("%c PIXI v" + PIXI.VERSION + " | AGARIX " + Versions_1.GAME_VERSION + " ", 'color: #7dffe7; background: #0f0f0f');
        window.GameSettings = this.settings = new Settings_1.default(this);
        window.GameAPI = new GameAPI_1.default(this);
        window.TextureGenerator = this.textureGenerator = new TexturesGenerator_1.default(this.settings);
        window.Master = this.master = new Master_1.default(this.settings);
        window.Ogar = this.ogar = new Ogar_1.default(this.settings, this.master);
        this.app = new pixi_js_1.Application({
            resizeTo: window,
            autoDensity: true,
            sharedLoader: true,
            sharedTicker: true,
            resolution: 1,
            backgroundColor: helpers_1.getColor(this.settings.all.settings.theming.map.backgroundTint),
            antialias: this.settings.all.settings.game.performance.antialiasing,
            powerPreference: 'high-performance',
            forceCanvas: false
        });
        this.stageFilter = new filter_kawase_blur_1.KawaseBlurFilter(0, 8, false);
        this.colorFilter = new pixi_js_1.filters.ColorMatrixFilter();
        PIXI.settings.ANISOTROPIC_LEVEL = 16;
        PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.POW2;
        PIXI.settings.ROUND_PIXELS = false;
    }
    Stage.prototype.updateRendererBackgroundColor = function () {
        this.app.renderer.backgroundColor = helpers_1.getColor(this.settings.all.settings.theming.map.backgroundTint);
    };
    Stage.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        document.body.appendChild(this.app.view);
                        Globals_1.default.init(this.app);
                        return [4 /*yield*/, this.textureGenerator.init()];
                    case 1:
                        _a.sent();
                        this.world = new World_1.default(this);
                        this.createMainScene();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Stage.prototype.tryToConnectAndSpawn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var autoRespawnOnFail, reason_1, reason_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        autoRespawnOnFail = this.settings.all.settings.game.gameplay.autoRespawnOnFail;
                        if (!PlayerState_1.default.first.connected) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.world.controller.spawnFirstTab()];
                    case 2:
                        _a.sent();
                        this.unblurGameScene(true);
                        this.world.controller.setFirstTabActive();
                        return [2 /*return*/, Promise.resolve()];
                    case 3:
                        reason_1 = _a.sent();
                        if (reason_1 === types_1.SOCKET_CONNECTION_REJECT.NO_RESPONSE_FROM_SERVER) {
                            this.logger.error("Could not connect to server. Reason: " + reason_1);
                        }
                        else {
                            if (autoRespawnOnFail) {
                                this.tryToConnectAndSpawn();
                            }
                        }
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 10];
                    case 5:
                        if (!!PlayerState_1.default.first.connecting) return [3 /*break*/, 10];
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 9, , 10]);
                        return [4 /*yield*/, this.world.controller.connectFirstPlayerTab()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.world.controller.spawnFirstTab()];
                    case 8:
                        _a.sent();
                        this.world.controller.setFirstTabActive();
                        return [2 /*return*/, Promise.resolve()];
                    case 9:
                        reason_2 = _a.sent();
                        if (reason_2 === types_1.SOCKET_CONNECTION_REJECT.NO_RESPONSE_FROM_SERVER) {
                            this.logger.error("Could not connect to server. Reason: " + reason_2);
                        }
                        else {
                            if (autoRespawnOnFail) {
                                this.tryToConnectAndSpawn();
                            }
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Stage.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var tokens, newTokens, reason_3;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    tokens = helpers_1.createTokens((_b = (_a = this.world.controller.firstTabSocket) === null || _a === void 0 ? void 0 : _a.socketData) === null || _b === void 0 ? void 0 : _b.token, (_d = (_c = this.world.controller.firstTabSocket) === null || _c === void 0 ? void 0 : _c.socketData) === null || _d === void 0 ? void 0 : _d.serverToken);
                                    if (!PlayerState_1.default.first.connected) return [3 /*break*/, 4];
                                    if (!(PlayerState_1.default.first.playing || PlayerState_1.default.first.spawning)) return [3 /*break*/, 1];
                                    this.unblurGameScene(true);
                                    resolve(tokens);
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, this.tryToConnectAndSpawn()];
                                case 2:
                                    _e.sent();
                                    resolve(tokens);
                                    _e.label = 3;
                                case 3: return [3 /*break*/, 9];
                                case 4:
                                    if (!tokens) return [3 /*break*/, 6];
                                    return [4 /*yield*/, this.tryToConnectAndSpawn()];
                                case 5:
                                    _e.sent();
                                    resolve(tokens);
                                    return [3 /*break*/, 9];
                                case 6:
                                    _e.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, this.connect()];
                                case 7:
                                    newTokens = _e.sent();
                                    resolve(newTokens);
                                    return [3 /*break*/, 9];
                                case 8:
                                    reason_3 = _e.sent();
                                    this.logger.error("Could not connect to server. Reason: " + reason_3);
                                    resolve('');
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Stage.prototype.connect = function (token, serverToken, isInit) {
        return __awaiter(this, void 0, void 0, function () {
            var socketData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!WorldState_1.default.gameJoined) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.disconnect()];
                    case 1:
                        _a.sent();
                        this.world.view.center();
                        WorldState_1.default.gameJoined = false;
                        _a.label = 2;
                    case 2:
                        socketData = null;
                        if (!(this.master.gameMode.get() === ':private')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.master.connectPrivate(helpers_1.tokenToWs(serverToken))];
                    case 3:
                        socketData = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.master.connect(token, serverToken)];
                    case 5:
                        socketData = _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.world.controller.init(socketData)
                                .then(function (mapOffsets) {
                                _this.join(mapOffsets);
                                if (_this.master.gameMode.get() === ':private') {
                                    return resolve(helpers_1.createTokens('[private]', helpers_1.wsToToken(_this.world.controller.firstTabSocket.socketData.address)));
                                }
                                else {
                                    return resolve(helpers_1.createTokens(_this.world.controller.firstTabSocket.socketData.token, _this.world.controller.firstTabSocket.socketData.serverToken));
                                }
                            }).catch(function (reason) {
                                if (!token && !serverToken) {
                                    // do not display message in console - init mode
                                    if (isInit) {
                                        reject(reason);
                                        return;
                                    }
                                    _this.logger.error("Could not connect to server. Reason: " + reason);
                                    reject(reason);
                                }
                                else {
                                    reject(reason);
                                }
                            });
                        })];
                }
            });
        });
    };
    Stage.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.hideGameScene()];
                    case 1:
                        _a.sent();
                        WorldState_1.default.gameJoined = false;
                        this.world.controller.disconnectAll();
                        this.world.clear();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Stage.prototype.join = function (mapOffsets) {
        WorldState_1.default.gameJoined = true;
        this.createGameScene(mapOffsets);
        this.showGameScene();
    };
    Stage.prototype.createMainScene = function () {
        var _this = this;
        this.root = new pixi_js_1.Container();
        this.mainContainer = new pixi_js_1.Container();
        this.foodVirusCellContainer = new pixi_js_1.Container();
        this.root.addChild(this.mainContainer);
        this.app.stage.addChild(this.root);
        this.app.stage.addChild(this.world.minimap);
        this.foodVirusCellContainer.addChild(this.world.food, this.world.ejected, this.world.cells);
        this.mainContainer.addChild(this.world.map, this.foodVirusCellContainer);
        var frameStart = performance.now();
        this.app.ticker.add(function () {
            FrontAPI_1.default.setEllapsedFrametime(performance.now() - frameStart);
            frameStart = performance.now();
            GamePerformance_1.default.FPSCounter.tick();
            WorldState_1.default.ticks++;
            var _a = _this.world.view.renderTick(), x = _a.x, y = _a.y, scale = _a.scale;
            _this.root.position.set(_this.app.renderer.width / 2, _this.app.renderer.height / 2);
            _this.mainContainer.pivot.set(x, y);
            _this.mainContainer.scale.set(scale);
            _this.world.renderer.renderFrame();
        });
        this.blurGameScene();
        this.world.map.setPosition(-7071, -7071);
        this.world.view.mouse.zoomValue = 0.25;
    };
    Stage.prototype.createGameScene = function (mapOffsets) {
        this.world.map.setPosition(mapOffsets.minX, mapOffsets.minY);
        this.world.map.setSize(mapOffsets.width, mapOffsets.height);
        this.world.view.center();
        this.world.view.mouse.zoomValue = 0.04085;
        this.world.view.camera.scale = 0.04085;
        this.root.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        this.foodVirusCellContainer.alpha = 0;
    };
    Stage.prototype.blurGameScene = function () {
        var _this = this;
        this.world.view.setScrollAvailable(false);
        if (this.settings.all.settings.game.effects.wtfRgbMode) {
            return;
        }
        Globals_1.default.gameBluring = true;
        this.app.ticker.remove(this.unblurStage);
        this.app.ticker.remove(this.blurStage);
        this.app.stage.filters = [this.colorFilter];
        this.hue = 0;
        this.blurStage = function () {
            _this.hue += 6 * PIXI.Ticker.shared.deltaTime;
            _this.colorFilter.hue(_this.hue, false);
            if (_this.hue >= 160 * PIXI.Ticker.shared.deltaTime) {
                _this.app.ticker.remove(_this.blurStage);
                Globals_1.default.gameBlured = true;
                Globals_1.default.gameBluring = false;
                // remove FPS cap or set it to the cap level
                var fpsLockType = _this.settings.all.settings.game.performance.fpsLockType;
                _this.app.ticker.maxFPS = fpsLockType !== 'Screen-hz' ? Number(fpsLockType) : 0;
            }
        };
        this.app.ticker.add(this.blurStage);
    };
    Stage.prototype.unblurGameScene = function (enableScroll) {
        var _this = this;
        this.world.view.setScrollAvailable(enableScroll);
        if (this.settings.all.settings.game.effects.wtfRgbMode) {
            return;
        }
        this.app.ticker.remove(this.unblurStage);
        this.app.ticker.remove(this.blurStage);
        this.unblurStage = function () {
            _this.hue -= 6 * PIXI.Ticker.shared.deltaTime;
            _this.colorFilter.hue(_this.hue, false);
            if (_this.hue <= 0) {
                _this.app.ticker.remove(_this.unblurStage);
                _this.app.stage.filters = [];
                _this.hue = 0;
                Globals_1.default.gameBlured = false;
                Globals_1.default.gameBluring = false;
                // remove FPS cap or set it to the cap level
                var fpsLockType = _this.settings.all.settings.game.performance.fpsLockType;
                _this.app.ticker.maxFPS = fpsLockType !== 'Screen-hz' ? Number(fpsLockType) : 0;
            }
        };
        this.app.ticker.add(this.unblurStage);
    };
    Stage.prototype.showGameScene = function () {
        var _this = this;
        this.foodVirusCellContainer.alpha = 0;
        this.showStageTicker = function () {
            if (_this.foodVirusCellContainer.alpha >= 1) {
                _this.app.ticker.remove(_this.showStageTicker);
                _this.foodVirusCellContainer.filters = [];
                _this.foodVirusCellContainer.alpha = 1;
                // remove FPS cap or set it to the cap level
                var fpsLockType = _this.settings.all.settings.game.performance.fpsLockType;
                _this.app.ticker.maxFPS = fpsLockType !== 'Screen-hz' ? Number(fpsLockType) : 0;
                return;
            }
            _this.foodVirusCellContainer.alpha += 0.08 * PIXI.Ticker.shared.deltaTime;
        };
        this.app.ticker.add(this.showStageTicker);
    };
    Stage.prototype.hideGameScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_this.root) {
                resolve();
                return;
            }
            _this.hideTicker = function () {
                _this.foodVirusCellContainer.alpha -= 0.08 * PIXI.Ticker.shared.deltaTime;
                if (_this.foodVirusCellContainer.alpha <= 0) {
                    _this.app.ticker.remove(_this.hideTicker);
                    resolve();
                }
            };
            _this.app.ticker.add(_this.hideTicker);
        });
    };
    return Stage;
}());
exports.default = Stage;
