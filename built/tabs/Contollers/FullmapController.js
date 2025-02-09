"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Socket_1 = __importDefault(require("../Socket/Socket"));
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var Chat_1 = require("../../communication/Chat");
var Logger_1 = __importDefault(require("../../utils/Logger"));
var FullmapController = /** @class */ (function () {
    function FullmapController(tabsController) {
        this.tabsController = tabsController;
        this.coordinates = [];
        this.sockets = [];
        this.establishBegin = 0;
        this.logger = new Logger_1.default('FullMapController');
        this.enabling = false;
        for (var y = 0, centerYFixed = 1519; y < 5; y++, centerYFixed += 1571 * 2) {
            for (var x = 1; x <= 5; x += 2) {
                this.coordinates.push({ x: 2535 * x, y: centerYFixed });
            }
        }
    }
    FullmapController.prototype.disconnectAll = function () {
        for (var i = 0; i < this.sockets.length; i++) {
            this.sockets[i] && this.sockets[i].destroy();
        }
        this.sockets = [];
        this.enabling = false;
    };
    FullmapController.prototype.disconnectByIndex = function (index) {
        this.sockets[index] && this.sockets[index].destroy();
    };
    FullmapController.prototype.connectByIndex = function (index) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.sockets[index].init().then(function (mapOffsets) {
                _this.sockets[index].spectate(_this.coordinates[index].x, _this.coordinates[index].y);
                resolve(mapOffsets);
            });
        });
    };
    FullmapController.prototype.enable = function (i) {
        var _this = this;
        if (i === undefined) {
            if (!this.tabsController.topOneViewEnabled) {
                this.tabsController.connectTopOneTab().then(function () {
                    _this.enable();
                    _this.enabling = true;
                });
                return;
            }
            this.establishBegin = Date.now();
            this.enabling = true;
            i = 0;
            FrontAPI_1.default.setSpectatorTabStatus('CONNECTING');
        }
        var _a = this.tabsController, socketData = _a.socketData, world = _a.world;
        this.sockets[i] = new Socket_1.default(socketData, 'SPEC_TABS', world);
        this.sockets[i].init().then(function () {
            _this.sockets[i].spectate(_this.coordinates[i].x, _this.coordinates[i].y);
            _this.sockets[i].onDisconnect(function () {
                if (_this.tabsController.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Full map') {
                    FrontAPI_1.default.setSpectatorTabStatus('DISCONNECTED');
                }
            });
            if (i < 14) {
                _this.enable(++i);
            }
            else {
                _this.sockets[i].onFullMapViewEnabled = function () {
                    _this.enabling = false;
                    var time = ~~((Date.now() - _this.establishBegin) / 1000);
                    var message = "Full map view is established. (" + time + "s)";
                    FrontAPI_1.default.sendChatGameMessage(message, Chat_1.ChatAuthor.Spectator);
                };
                if (_this.tabsController.world.scene.settings.all.settings.game.gameplay.spectatorMode === 'Full map') {
                    FrontAPI_1.default.setSpectatorTabStatus('CONNECTED');
                }
            }
        }).catch(function (reason) {
            _this.logger.error("Could not connect to server. Reason: " + reason);
            FrontAPI_1.default.setSpectatorTabStatus('CONNECTED');
        });
    };
    return FullmapController;
}());
exports.default = FullmapController;
