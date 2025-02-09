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
var PIXI = __importStar(require("pixi.js"));
var Globals_1 = __importDefault(require("../Globals"));
var SpawnAnimation_1 = __importDefault(require("../objects/SpawnAnimation"));
var CellsRenderer_1 = __importDefault(require("./Renderer/CellsRenderer"));
var FoodRenderer_1 = __importDefault(require("./Renderer/FoodRenderer"));
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var WorldState_1 = __importDefault(require("../states/WorldState"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var WorldLoop = /** @class */ (function () {
    function WorldLoop(world) {
        this.world = world;
        this.stp = false;
        this.ftp = false;
        this.rgbWtfModeHueValue = 0;
        this.cellsRenderer = new CellsRenderer_1.default(this.world);
        this.foodRenderer = new FoodRenderer_1.default(this.world);
    }
    WorldLoop.prototype.checkIsTeam = function (cell) {
        if (!this.world.ogar.connected) {
            return;
        }
        this.world.ogar.firstTab.team.forEach(function (player) {
            var nick = player.nick, color = player.color, alive = player.alive;
            if (!alive) {
                return;
            }
            var sameNick = nick === cell.nick;
            var sameColor = cell.colorHex[0] === color.cell || cell.colorHex[1] === color.cell;
            var sameCustomColor = cell.colorHex[0] === color.custom || cell.colorHex[1] === color.custom;
            var undefinedExtensionColor = color.custom === '#000000' || color.cell === '#000000';
            if (sameNick && (sameColor || sameCustomColor || undefinedExtensionColor)) {
                cell.setIsTeam(true, player.skin);
            }
        });
    };
    WorldLoop.prototype.renderEjected = function () {
        var animationSpeed = this.world.animationSettingsProvider.getAnimationSpeed();
        var fadeSpeed = this.world.animationSettingsProvider.getFadeSpeedForEjected();
        var soakSpeed = this.world.animationSettingsProvider.getSoakSpeedForEjected();
        for (var i = 0; i < this.world.ejected.children.length; i++) {
            var ejected = this.world.ejected.children[i];
            ejected.animate(animationSpeed, fadeSpeed, soakSpeed);
            if (ejected.isDestroyed) {
                this.world.ejected.removeChild(ejected);
                continue;
            }
            this.cellsRenderer.render(ejected);
        }
    };
    WorldLoop.prototype.renderCells = function () {
        // check for isTeam every 1 second. isAlive may be changed only every 2 seconds
        var canCheckForTeam = WorldState_1.default.ticks % 60 * PIXI.Ticker.shared.deltaTime === 0;
        var animationSpeed = this.world.animationSettingsProvider.getAnimationSpeed();
        var fadeSpeed = this.world.animationSettingsProvider.getFadeSpeed();
        var soakSpeed = this.world.animationSettingsProvider.getSoakSpeed();
        for (var i = 0; i < this.world.cells.children.length; i++) {
            var object = this.world.cells.children[i];
            object.animate(animationSpeed, fadeSpeed, soakSpeed);
            if (object.isDestroyed) {
                this.world.cells.removeChild(object);
                continue;
            }
            if (object.type === 'SPAWN_ANIMATION') {
                continue;
            }
            if (object.type === 'CELL' && canCheckForTeam) {
                this.checkIsTeam(object);
            }
            this.cellsRenderer.render(object);
        }
    };
    WorldLoop.prototype.checkFoodContainerVisibility = function () {
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        if (this.world.scene.settings.all.settings.theming.food.enabled) {
            this.world.food.visible = this.world.food.renderable = true;
            if (this.world.food.alpha >= 1) {
                this.world.food.alpha = 1;
            }
            else {
                this.world.food.alpha += 0.02 * deltaTime;
            }
        }
        else {
            if (this.world.food.alpha <= 0) {
                this.world.food.alpha = 0;
                this.world.food.visible = this.world.food.renderable = false;
            }
            else {
                this.world.food.alpha -= 0.033 * deltaTime;
            }
        }
    };
    WorldLoop.prototype.renderFood = function () {
        for (var i = 0; i < this.world.food.children.length; i++) {
            var food = this.world.food.children[i];
            food.animate();
            if (food.isDestroyed) {
                this.world.food.removeChild(food);
                continue;
            }
            this.foodRenderer.render(food);
        }
    };
    WorldLoop.prototype.checkIsPlaying = function () {
        if (this.world.playerCells.firstTab.size === 0) {
            this.world.controller.firstTabSocket && (this.world.controller.firstTabSocket.playerSpawned = false);
            PlayerState_1.default.first.playing = false;
            this.world.ogar.connected && (this.world.ogar.firstTab.death());
            if (this.ftp !== false) {
                this.ftp = false;
                if (!PlayerState_1.default.second.playing) {
                    FrontAPI_1.default.setIsPlayerPlaying(false);
                }
                if (this.world.scene.settings.all.settings.game.multibox.enabled && PlayerState_1.default.second.playing) {
                    this.world.controller.setSecondTabActive();
                }
            }
        }
        else {
            PlayerState_1.default.first.playing = true;
            this.world.ogar.connected && (this.world.ogar.firstTab.spawn());
            if (this.ftp !== true) {
                this.ftp = true;
                FrontAPI_1.default.setIsPlayerPlaying(true);
                if (this.world.scene.settings.all.settings.game.effects.spawnAnimation !== 'Disabled') {
                    var first = this.world.playerCells.firstTab.entries().next().value[1];
                    this.world.cells.addChild(new SpawnAnimation_1.default(first.newLocation, this.world, first.cell.tint));
                }
            }
        }
        if (this.world.scene.settings.all.settings.game.multibox.enabled && this.world.controller.secondTabSocket) {
            if (this.world.playerCells.secondTab.size === 0) {
                this.world.controller.secondTabSocket.playerSpawned = false;
                PlayerState_1.default.second.playing = false;
                this.world.ogar.connected && (this.world.ogar.secondTab.death());
                if (this.stp !== false) {
                    this.stp = false;
                    if (!PlayerState_1.default.first.playing) {
                        FrontAPI_1.default.setIsPlayerPlaying(false);
                    }
                    if (PlayerState_1.default.first.playing) {
                        this.world.controller.setFirstTabActive();
                    }
                }
            }
            else {
                PlayerState_1.default.second.playing = true;
                this.world.ogar.connected && (this.world.ogar.secondTab.spawn());
                if (this.stp !== true) {
                    this.stp = true;
                    FrontAPI_1.default.setIsPlayerPlaying(true);
                    if (this.world.scene.settings.all.settings.game.effects.spawnAnimation !== 'Disabled') {
                        var first = this.world.playerCells.secondTab.entries().next().value[1];
                        this.world.cells.addChild(new SpawnAnimation_1.default(first.newLocation, this.world, first.cell.tint));
                    }
                }
            }
        }
    };
    WorldLoop.prototype.checkWtfRgbMode = function () {
        if (this.world.scene.settings.all.settings.game.effects.wtfRgbMode) {
            this.world.scene.app.stage.filters = [this.world.scene.colorFilter];
            this.rgbWtfModeHueValue += 1 * PIXI.Ticker.shared.deltaTime;
            this.world.scene.colorFilter.hue(this.rgbWtfModeHueValue, false);
        }
        else {
            if (Globals_1.default.gameBlured || Globals_1.default.gameBluring) {
                return;
            }
            if (this.world.scene.app.stage.filters && this.world.scene.app.stage.filters.length) {
                this.world.scene.app.stage.filters = [];
            }
        }
    };
    WorldLoop.prototype.sort = function () {
        if (this.world.view.firstTab.sortRequired) {
            this.world.view.firstTab.calcBounds();
            this.world.view.firstTab.sortRequired = false;
        }
        if (this.world.view.secondTab.sortRequired) {
            this.world.view.secondTab.calcBounds();
            this.world.view.secondTab.sortRequired = false;
        }
        if (this.world.view.topOneTab.sortRequired) {
            this.world.view.topOneTab.calcBounds();
            this.world.view.topOneTab.sortRequired = false;
        }
    };
    WorldLoop.prototype.renderFrame = function () {
        this.sort();
        this.checkFoodContainerVisibility();
        this.checkIsPlaying();
        this.world.map.renderTick();
        this.renderCells();
        this.renderEjected();
        this.world.minimap.renderFrame();
        this.renderFood();
        this.checkWtfRgbMode();
        this.world.lastRenderTime = Date.now();
    };
    return WorldLoop;
}());
exports.default = WorldLoop;
