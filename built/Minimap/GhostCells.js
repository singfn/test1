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
var helpers_1 = require("../utils/helpers");
var GhostCells = /** @class */ (function (_super) {
    __extends(GhostCells, _super);
    function GhostCells(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.sortableChildren = true;
        _this.zIndex = -7;
        _this.create();
        return _this;
    }
    GhostCells.prototype.create = function () {
        var _this = this;
        var ghostCellsColor = this.world.settings.all.settings.theming.minimap.ghostCellsColor;
        this.buffer = new Array(20)
            .fill({})
            .map(function () {
            var cell = new index_1.default('FIRST_TAB', { x: 9999, y: 9999, r: 0 }, { red: 0, green: 0, blue: 0 }, '', '', _this.world);
            cell.setIsMinimapCell(20);
            cell.cell.tint = helpers_1.getColor(ghostCellsColor);
            cell.shadow.sprite.visible = false;
            cell.shadow.sprite.renderable = false;
            return cell;
        });
        this.buffer.forEach(function (cell) { return _this.addChild(cell); });
    };
    GhostCells.prototype.update = function (cells) {
        var _this = this;
        var _a = this.world.settings.all.settings.game.minimap, ghostCells = _a.ghostCells, realPlayersCells = _a.realPlayersCells;
        if (!ghostCells) {
            this.visible = false;
            this.renderable = false;
            return;
        }
        else {
            this.visible = true;
            this.renderable = true;
        }
        var i = 0;
        cells.forEach(function (cell) {
            if (realPlayersCells && _this.world.view.topOneTab.hasInViewBounds(cell.playerX, cell.playerY, cell.totalMass / 2)) {
                return;
            }
            var location = helpers_1.transformMinimapLocation({
                x: cell.playerX,
                y: cell.playerY,
                r: cell.size * 2
            }, _this.world.view.firstTab.mapOffsets, _this.world.settings);
            _this.buffer[i].visible = true;
            _this.buffer[i].renderable = true;
            _this.buffer[i].forceAnimateSet(location);
            i++;
        });
        // Make invisible cells that are not used. 
        // Case: server has < 20 players
        for (var x = i; x < 20; x++) {
            this.buffer[x].visible = false;
            this.buffer[i].renderable = false;
        }
    };
    GhostCells.prototype.changeCellShadowTexture = function () {
        this.buffer.forEach(function (cell) { return cell.changeShadowTexture(); });
    };
    GhostCells.prototype.updateColor = function () {
        var _this = this;
        this.buffer.forEach(function (cell) {
            cell.cell.tint = helpers_1.getColor(_this.world.settings.all.settings.theming.minimap.ghostCellsColor);
        });
    };
    GhostCells.prototype.reset = function () {
        this.buffer.forEach(function (cell) {
            cell.visible = false;
        });
    };
    return GhostCells;
}(pixi_js_1.Container));
exports.default = GhostCells;
