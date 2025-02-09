"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var index_1 = __importDefault(require("../objects/Cell/index"));
var SpawnAnimation_1 = __importDefault(require("../objects/SpawnAnimation"));
var helpers_1 = require("../utils/helpers");
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var StaticPlayerCells = /** @class */ (function (_super) {
    __extends(StaticPlayerCells, _super);
    function StaticPlayerCells(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.zIndex = 1000;
        _this.sortableChildren = true;
        _this.create();
        return _this;
    }
    StaticPlayerCells.prototype.create = function () {
        var _a = this.world.settings.all.settings.theming.minimap, playerColor = _a.playerColor, playerSize = _a.playerSize;
        this.firstTab = new index_1.default('FIRST_TAB', { x: 9999, y: 9999, r: 0 }, { red: 0, green: 0, blue: 0 }, '', '', this.world);
        this.firstTab.setIsMinimapCell(playerSize);
        this.firstTab.cell.tint = helpers_1.getColor(playerColor);
        this.addChild(this.firstTab);
        this.secondTab = new index_1.default('FIRST_TAB', { x: 9999, y: 9999, r: 0 }, { red: 0, green: 0, blue: 0 }, '', '', this.world);
        this.secondTab.setIsMinimapCell(playerSize);
        this.secondTab.cell.tint = helpers_1.getColor(playerColor);
        this.addChild(this.secondTab);
    };
    StaticPlayerCells.prototype.animateFirstTab = function () {
        var firstTab = this.world.view.firstTab;
        var playerSize = this.world.settings.all.settings.theming.minimap.playerSize;
        var playerPosition = this.world.settings.all.settings.game.minimap.playerPosition;
        if (PlayerState_1.default.first.playing && playerPosition) {
            var _a = helpers_1.transformMinimapLocation({
                x: firstTab.viewport.x,
                y: firstTab.viewport.y,
                r: 0
            }, this.world.view.firstTab.mapOffsets, this.world.settings), x = _a.x, y = _a.y;
            if (!this.firstTab.visible && this.world.settings.all.settings.game.effects.spawnAnimation !== 'Disabled') {
                var animation = new SpawnAnimation_1.default({ x: x, y: y, r: 0 }, this.world, this.firstTab.cell.tint);
                animation.setIsMinimap();
                this.addChild(animation);
            }
            this.firstTab.visible = true;
            this.firstTab.forceAnimateSet({ x: x, y: y, r: playerSize });
            /* if (Settings.minimap.drawRealPlayers) {
              if (
                firstTab.playerBox.mass > 300 &&
                topOneTab.hasInViewBounds(firstTab.viewport.x, firstTab.viewport.y, firstTab.playerBox.mass / 2)
              ) {
                this.playerCell.alpha = 0;
              } else {
                this.playerCell.alpha = 1;
              }
            } else {
              this.playerCell.alpha = 1;
            } */
        }
        else {
            this.firstTab.visible = false;
        }
    };
    StaticPlayerCells.prototype.animateSecondTab = function () {
        var secondTab = this.world.view.secondTab;
        var playerSize = this.world.settings.all.settings.theming.minimap.playerSize;
        var playerPosition = this.world.settings.all.settings.game.minimap.playerPosition;
        if (PlayerState_1.default.second.playing && playerPosition) {
            var _a = helpers_1.transformMinimapLocation({
                x: secondTab.viewport.x,
                y: secondTab.viewport.y,
                r: 0
            }, this.world.view.secondTab.mapOffsets, this.world.settings), x = _a.x, y = _a.y;
            if (!this.secondTab.visible && this.world.settings.all.settings.game.effects.spawnAnimation !== 'Disabled') {
                var animation = new SpawnAnimation_1.default({ x: x, y: y, r: 0 }, this.world, this.secondTab.cell.tint);
                animation.setIsMinimap();
                this.addChild(animation);
            }
            this.secondTab.visible = true;
            this.secondTab.forceAnimateSet({ x: x, y: y, r: playerSize });
            /* if (Settings.minimap.drawRealPlayers) {
              if (
                firstTab.playerBox.mass > 300 &&
                topOneTab.hasInViewBounds(secondTab.viewport.x, secondTab.viewport.y, secondTab.playerBox.mass / 2)
              ) {
                this.secondPlayerCell.alpha = 0;
              } else {
                this.secondPlayerCell.alpha = 1;
              }
            } else {
              this.secondPlayerCell.alpha = 1;
            } */
        }
        else {
            this.secondTab.visible = false;
        }
    };
    StaticPlayerCells.prototype.animateSpawnAnimation = function () {
        var _this = this;
        var animationSpeed = this.world.animationSettingsProvider.getAnimationSpeed();
        var fadeSpeed = this.world.animationSettingsProvider.getFadeSpeed();
        var soakSpeed = this.world.animationSettingsProvider.getSoakSpeed();
        this.children.forEach(function (child) {
            if (child.type === 'SPAWN_ANIMATION') {
                child.animate(animationSpeed, fadeSpeed, soakSpeed);
                if (child.isDestroyed) {
                    _this.removeChild(child);
                }
            }
        });
    };
    StaticPlayerCells.prototype.renderTick = function () {
        this.animateFirstTab();
        this.animateSecondTab();
        this.animateSpawnAnimation();
    };
    StaticPlayerCells.prototype.updateColors = function () {
        var playerColor = this.world.settings.all.settings.theming.minimap.playerColor;
        this.firstTab.cell.tint = helpers_1.getColor(playerColor);
        this.secondTab.cell.tint = helpers_1.getColor(playerColor);
    };
    StaticPlayerCells.prototype.changeCellShadowTexture = function () {
        this.firstTab.changeShadowTexture();
        this.secondTab.changeShadowTexture();
    };
    return StaticPlayerCells;
}(pixi_js_1.Container));
exports.default = StaticPlayerCells;
