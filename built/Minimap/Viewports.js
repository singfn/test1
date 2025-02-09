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
var ViewBox_1 = __importDefault(require("../objects/ViewBox"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var helpers_1 = require("../utils/helpers");
var Viewports = /** @class */ (function (_super) {
    __extends(Viewports, _super);
    function Viewports(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.zIndex = -8;
        _this.create();
        return _this;
    }
    Viewports.prototype.create = function () {
        this.topOneTab = new ViewBox_1.default(this.world);
        this.topOneTab.width = 0;
        this.topOneTab.height = 0;
        this.firstTab = new ViewBox_1.default(this.world);
        this.firstTab.width = 0;
        this.firstTab.height = 0;
        this.updateColors();
        this.addChild(this.firstTab, this.topOneTab);
    };
    Viewports.prototype.animateFirstTab = function () {
        var size = this.world.settings.all.settings.theming.minimap.size;
        var viewport = this.world.settings.all.settings.game.minimap.viewport;
        if (viewport === 'All' || viewport === 'Main tab') {
            this.firstTab.visible = PlayerState_1.default.first.playing;
            var bounds = this.world.view.firstTab.bounds;
            var _a = helpers_1.transformMinimapLocation({
                x: bounds.left,
                y: bounds.top,
                r: 0
            }, this.world.view.firstTab.getShiftedMapOffsets(), this.world.settings), x = _a.x, y = _a.y;
            var w = bounds.width / this.world.map.size.width * size;
            var h = bounds.height / this.world.map.size.height * size;
            this.firstTab.animate(x, y, w, h);
        }
        else {
            this.firstTab.visible = false;
        }
    };
    Viewports.prototype.animateTopOneTab = function () {
        var size = this.world.settings.all.settings.theming.minimap.size;
        var viewport = this.world.settings.all.settings.game.minimap.viewport;
        if (viewport === 'All' || viewport === 'Top one tab') {
            var viewport_1 = this.world.view.topOneTab.viewport;
            this.topOneTab.visible = (viewport_1.x !== 0 && viewport_1.y !== 0);
            var bounds = this.world.view.topOneTab.bounds;
            var _a = helpers_1.transformMinimapLocation({
                x: bounds.left,
                y: bounds.top,
                r: 0
            }, this.world.view.firstTab.getShiftedMapOffsets(), this.world.settings), x = _a.x, y = _a.y;
            var w = bounds.width / this.world.map.size.width * size;
            var h = bounds.height / this.world.map.size.height * size;
            this.topOneTab.animate(x, y, w, h);
        }
        else {
            this.topOneTab.visible = false;
        }
    };
    Viewports.prototype.updateColors = function () {
        var _a = this.world.settings.all.settings.theming.minimap, topOneViewportColor = _a.topOneViewportColor, myViewportColor = _a.myViewportColor;
        this.topOneTab.tint = helpers_1.getColor(topOneViewportColor);
        this.topOneTab.alpha = topOneViewportColor.alpha;
        this.firstTab.tint = helpers_1.getColor(myViewportColor);
        this.firstTab.alpha = myViewportColor.alpha;
    };
    Viewports.prototype.renderTick = function () {
        this.animateFirstTab();
        this.animateTopOneTab();
    };
    return Viewports;
}(pixi_js_1.Container));
exports.default = Viewports;
