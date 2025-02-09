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
var GhostCells_1 = __importDefault(require("./GhostCells"));
var RealCells_1 = __importDefault(require("./RealCells"));
var MyStaticCells_1 = __importDefault(require("./MyStaticCells"));
var Viewports_1 = __importDefault(require("./Viewports"));
var TeamPlayers_1 = __importDefault(require("./TeamPlayers"));
var helpers_1 = require("../utils/helpers");
var MinimapWEBGL = /** @class */ (function (_super) {
    __extends(MinimapWEBGL, _super);
    function MinimapWEBGL(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.graphics = new pixi_js_1.Graphics();
        _this.graphics.zIndex = -10;
        _this.addChild(_this.graphics);
        _this.updateBackgroundColor();
        _this.updatePositionAndSize();
        _this.viewports = new Viewports_1.default(world);
        _this.ghostCells = new GhostCells_1.default(world);
        _this.realPlayersCells = new RealCells_1.default(world);
        _this.teamPlayers = new TeamPlayers_1.default(world);
        _this.staticPlayerCells = new MyStaticCells_1.default(world);
        _this.addChild(_this.viewports, _this.ghostCells, _this.realPlayersCells, _this.teamPlayers, _this.staticPlayerCells);
        return _this;
    }
    MinimapWEBGL.prototype.updatePositionAndSize = function () {
        var size = this.world.settings.all.settings.theming.minimap.size;
        this.x = this.world.scene.app.view.width - size;
        this.y = this.world.scene.app.view.height - size;
    };
    MinimapWEBGL.prototype.updateBackgroundColor = function () {
        var _a = this.world.settings.all.settings.theming.minimap, backgroundColor = _a.backgroundColor, size = _a.size;
        this.graphics.clear();
        this.graphics.beginFill(helpers_1.getColor(backgroundColor), backgroundColor.alpha);
        this.graphics.drawRect(0, 0, size, size);
    };
    MinimapWEBGL.prototype.changeVirusTexture = function () {
        this.realPlayersCells.changeVirusTexture();
    };
    MinimapWEBGL.prototype.changeCellShadowTexture = function () {
        this.realPlayersCells.changeCellShadowTexture();
        this.staticPlayerCells.changeCellShadowTexture();
        this.ghostCells.changeCellShadowTexture();
        this.teamPlayers.changeCellShadowTexture();
    };
    MinimapWEBGL.prototype.renderFrame = function () {
        this.visible = this.world.settings.all.settings.game.minimap.enabled;
        this.updatePositionAndSize();
        this.updateBackgroundColor();
        this.realPlayersCells.renderTick();
        this.staticPlayerCells.renderTick();
        this.teamPlayers.renderTick();
        this.viewports.renderTick();
    };
    MinimapWEBGL.prototype.reset = function () {
        this.realPlayersCells.reset();
        this.teamPlayers.reset();
        this.ghostCells.reset();
    };
    MinimapWEBGL.prototype.addRealPlayerCell = function (id, location, color, name, type, subtype, skin) {
        this.realPlayersCells.add(id, location, color, name, type, subtype, skin);
    };
    MinimapWEBGL.prototype.updateRealPlayerCell = function (id, location) {
        this.realPlayersCells.update(id, location);
    };
    MinimapWEBGL.prototype.removeRealPlayerCell = function (id, removeType) {
        this.realPlayersCells.remove(id, removeType);
    };
    MinimapWEBGL.prototype.updateGhostCells = function (cells) {
        this.ghostCells.update(cells);
    };
    return MinimapWEBGL;
}(pixi_js_1.Container));
exports.default = MinimapWEBGL;
