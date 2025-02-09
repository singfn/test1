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
var ViewBox_1 = __importDefault(require("../ViewBox"));
var ViewportVisualizer = /** @class */ (function (_super) {
    __extends(ViewportVisualizer, _super);
    function ViewportVisualizer(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.create();
        _this.visible = false;
        return _this;
    }
    ViewportVisualizer.prototype.checkSettings = function () {
        /*     const { firstTab, secondTab, topOneTab } = Settings.viewBox;
            const { deltaTime } = PIXI.Ticker.shared;
            const { ticks } = Globals;
        
            if (~~(ticks % (5 * deltaTime)) === 0) {
              this.firstTab.visible = firstTab.enabled;
              this.firstTab.alpha = firstTab.alpha;
              this.firstTab.tint = Globals.getColor(firstTab.tint);
        
              this.secondTab.visible = secondTab.enabled;
              this.secondTab.alpha = secondTab.alpha;
              this.secondTab.tint = Globals.getColor(secondTab.tint);
        
              this.topOneTab.visible = topOneTab.enabled;
              this.topOneTab.alpha = topOneTab.alpha;
              this.topOneTab.tint = Globals.getColor(topOneTab.tint);
            } */
    };
    ViewportVisualizer.prototype.create = function () {
        this.firstTab = new ViewBox_1.default(this.world);
        this.firstTab.zIndex = 101;
        this.secondTab = new ViewBox_1.default(this.world);
        this.secondTab.zIndex = 102;
        this.topOneTab = new ViewBox_1.default(this.world);
        this.topOneTab.zIndex = 103;
        this.addChild(this.firstTab, this.secondTab, this.topOneTab);
    };
    ViewportVisualizer.prototype.renderTick = function () {
        var _a = this.world.view, topOneTab = _a.topOneTab, firstTab = _a.firstTab, secondTab = _a.secondTab;
        this.firstTab.animate(firstTab.bounds.left - firstTab.mapOffsets.minX, firstTab.bounds.top - firstTab.mapOffsets.minY, firstTab.bounds.width, firstTab.bounds.height);
        this.secondTab.animate(secondTab.bounds.left - firstTab.mapOffsets.minX, secondTab.bounds.top - firstTab.mapOffsets.minY, secondTab.bounds.width, secondTab.bounds.height);
        this.topOneTab.animate(topOneTab.bounds.left - firstTab.mapOffsets.minX, topOneTab.bounds.top - firstTab.mapOffsets.minY, topOneTab.bounds.width, topOneTab.bounds.height);
        this.checkSettings();
    };
    return ViewportVisualizer;
}(pixi_js_1.Container));
exports.default = ViewportVisualizer;
