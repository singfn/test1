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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Subview_1 = __importDefault(require("./Subview"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var WorldState_1 = __importDefault(require("../states/WorldState"));
var PIXI = __importStar(require("pixi.js"));
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var View = /** @class */ (function () {
    function View(data, canvas, settings, ogar) {
        var _this = this;
        this.canvas = canvas;
        this.settings = settings;
        this.ogar = ogar;
        this.mouse = { x: 0, y: 0, zoomValue: 0.0375 };
        this.camera = { x: 0, y: 0, scale: 0.02281 };
        this.scrollAvailable = false;
        this.globalWindowBounds = { width: 0, height: 0, scale: 0 };
        this.firstTab = new Subview_1.default(data.socketCells.firstTab.data, data.playerCells.firstTab);
        this.secondTab = new Subview_1.default(data.socketCells.secondTab.data, data.playerCells.secondTab);
        this.topOneTab = new Subview_1.default(data.socketCells.topOneTab.data);
        window.addEventListener('mousemove', function (e) {
            _this.mouse.x = e.clientX;
            _this.mouse.y = e.clientY;
        });
        window.addEventListener('wheel', function (e) {
            if (!_this.scrollAvailable) {
                return;
            }
            _this.mouse.zoomValue *= Math.pow((0.685 + (_this.settings.all.settings.game.gameplay.zoomSpeed / 100)), (e.deltaY / 100 || e.detail || 0));
            if (_this.mouse.zoomValue <= 0.0228) {
                _this.mouse.zoomValue = 0.02281;
            }
            if (_this.mouse.zoomValue >= 0.5) {
                _this.mouse.zoomValue = 0.499;
            }
        });
    }
    View.prototype.shouldObjectBeCulled = function (objX, objY, size) {
        var _a = this.globalWindowBounds, width = _a.width, height = _a.height;
        var _b = this.camera, x = _b.x, y = _b.y;
        var hasX = (x - width < objX + size) && (x + width > objX - size);
        var hasY = (y - height < objY + size) && (y + height > objY - size);
        return !hasX || !hasY;
    };
    View.prototype.setScrollAvailable = function (value) {
        this.scrollAvailable = value;
    };
    View.prototype.calcScale = function () {
        var zoom = Math.max(this.canvas.width / 1080, this.canvas.height / 1920) * this.mouse.zoomValue;
        this.camera.scale = (9 * this.camera.scale + zoom) / 10;
    };
    View.prototype.calcCam = function (valueX, valueY, isPlaying) {
        if (isPlaying && this.settings.all.settings.game.gameplay.cameraStyle === 'Default') {
            this.camera.x = (this.camera.x + valueX) / 2;
            this.camera.y = (this.camera.y + valueY) / 2;
        }
        else {
            var speed = (130 - this.settings.all.settings.game.gameplay.cameraSpeed * 6) * PIXI.Ticker.shared.deltaTime;
            this.camera.x = ((speed - 1) * this.camera.x + valueX) / speed;
            this.camera.y = ((speed - 1) * this.camera.y + valueY) / speed;
        }
        this.globalWindowBounds.width = this.canvas.width / 2 / this.camera.scale;
        this.globalWindowBounds.height = this.canvas.height / 2 / this.camera.scale;
    };
    View.prototype.calcCursorPosition = function (viewport) {
        var x = (this.mouse.x - this.canvas.width / 2) / this.camera.scale + viewport.x;
        var y = (this.mouse.y - this.canvas.height / 2) / this.camera.scale + viewport.y;
        return { x: x, y: y };
    };
    View.prototype.updateFirstTab = function () {
        this.firstTab.calcPlayingStats();
        this.firstTab.cursor = this.calcCursorPosition(this.firstTab.viewport);
    };
    View.prototype.updateSecondTab = function () {
        this.secondTab.calcPlayingStats();
        this.secondTab.cursor = this.calcCursorPosition(this.secondTab.viewport);
    };
    View.prototype.updatePlayerMass = function () {
        // 10 times per second
        var canUpdateMass = WorldState_1.default.ticks % 6 * PIXI.Ticker.shared.deltaTime === 0;
        if (canUpdateMass) {
            FrontAPI_1.default.setMyMass(this.firstTab.playerBox.mass);
        }
    };
    View.prototype.updateOgar = function () {
        if (!this.ogar.connected) {
            return;
        }
        var firstTabViewport = this.firstTab.getShiftedViewport();
        var secondTabViewport = this.secondTab.getShiftedViewport();
        var firstTabOffsets = this.firstTab.getShiftedMapOffsets();
        var secondTabOffsets = this.secondTab.getShiftedMapOffsets();
        this.ogar.firstTab.updatePosition(firstTabViewport.x - (firstTabOffsets.minX + 7071), firstTabViewport.y - (firstTabOffsets.minY + 7071), this.firstTab.playerBox.mass);
        this.ogar.secondTab.updatePosition(secondTabViewport.x - (secondTabOffsets.minX + 7071), secondTabViewport.y - (secondTabOffsets.minY + 7071), this.secondTab.playerBox.mass);
    };
    View.prototype.center = function () {
        WorldState_1.default.spectator.free = false;
        WorldState_1.default.spectator.topOne = false;
        WorldState_1.default.spectator.center = true;
        WorldState_1.default.spectator.topOneWithFirst = false;
    };
    View.prototype.spectateTopOne = function (firstTab) {
        WorldState_1.default.spectator.free = false;
        WorldState_1.default.spectator.center = false;
        WorldState_1.default.spectator.topOne = true;
        WorldState_1.default.spectator.topOneWithFirst = firstTab;
    };
    View.prototype.freeSpectate = function () {
        WorldState_1.default.spectator.center = false;
        WorldState_1.default.spectator.topOne = false;
        WorldState_1.default.spectator.free = true;
        WorldState_1.default.spectator.topOneWithFirst = false;
    };
    View.prototype.updateCamera = function () {
        var _a = this, firstTab = _a.firstTab, secondTab = _a.secondTab, topOneTab = _a.topOneTab;
        var notPlaying = !PlayerState_1.default.first.playing && !PlayerState_1.default.second.playing;
        // veis is centered and player is not playing
        if (WorldState_1.default.spectator.center && notPlaying) {
            var x = (WorldState_1.default.mapOffsets.minX + WorldState_1.default.mapOffsets.maxX) / 2;
            var y = (WorldState_1.default.mapOffsets.minY + WorldState_1.default.mapOffsets.maxY) / 2;
            this.calcCam(x, y);
        }
        else if (WorldState_1.default.spectator.topOne && !WorldState_1.default.spectator.topOneWithFirst && notPlaying) {
            // spectating top one with top one tab
            var _b = topOneTab.getShiftedViewport(), x = _b.x, y = _b.y;
            this.calcCam(x, y, false);
        }
        else {
            var isSpectating = WorldState_1.default.spectator.free || (WorldState_1.default.spectator.topOne && WorldState_1.default.spectator.topOneWithFirst);
            // spectating top one with first player tab.
            // used when gameMode !== :party or when spectateType === 'Disabled'
            if (isSpectating && notPlaying) {
                var _c = firstTab.getShiftedViewport(), x = _c.x, y = _c.y;
                this.calcCam(x, y);
            }
            else {
                // game is not centered, check if playing 
                if (PlayerState_1.default.first.playing || PlayerState_1.default.second.playing) {
                    // user is playing, check if multibox
                    if (this.settings.all.settings.game.multibox.enabled) {
                        // calc centered cam between the tabs and correct cursor position
                        if (PlayerState_1.default.first.playing && PlayerState_1.default.second.playing) {
                            var _d = secondTab.getShiftedViewport(), x = _d.x, y = _d.y;
                            var ftv = firstTab.getShiftedViewport();
                            this.calcCam((ftv.x + x) / 2, (ftv.y + y) / 2, true);
                            firstTab.cursor.x -= (ftv.x - x) / 2;
                            firstTab.cursor.y -= (ftv.y - y) / 2;
                            secondTab.cursor.x -= (secondTab.viewport.x - ftv.x + secondTab.mapOffsetsShift.x) / 2;
                            secondTab.cursor.y -= (secondTab.viewport.y - ftv.y + secondTab.mapOffsetsShift.y) / 2;
                        }
                        else {
                            // only first tab is playing
                            if (PlayerState_1.default.first.playing) {
                                var _e = firstTab.getShiftedViewport(), x = _e.x, y = _e.y;
                                this.calcCam(x, y, true);
                            }
                            // only second tab is playing
                            if (PlayerState_1.default.second.playing) {
                                var _f = secondTab.getShiftedViewport(), x = _f.x, y = _f.y;
                                this.calcCam(x, y, true);
                            }
                        }
                    }
                    else {
                        // multibox disabled so calc cam of the first tab
                        var _g = firstTab.getShiftedViewport(), x = _g.x, y = _g.y;
                        this.calcCam(x, y, true);
                    }
                }
            }
        }
    };
    View.prototype.renderTick = function () {
        this.calcScale();
        this.updateFirstTab();
        this.updateSecondTab();
        this.updateCamera();
        this.updateOgar();
        this.updatePlayerMass();
        return this.camera;
    };
    return View;
}());
exports.default = View;
