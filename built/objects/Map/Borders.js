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
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var PIXI = __importStar(require("pixi.js"));
var Borders = /** @class */ (function (_super) {
    __extends(Borders, _super);
    function Borders(map) {
        var _this = _super.call(this) || this;
        _this.map = map;
        _this.colorMatrixFilterHue = 0;
        _this.zIndex = 10;
        _this.create();
        _this.createRgb();
        _this.applyFilter();
        _this.map.listen('sizechange', function () {
            var borderWidth = 20;
            var size = 20;
            _this.rgbBorders.width = _this.map.size.width + size;
            _this.rgbBorders.height = _this.map.size.height + size;
            _this.rgbBordersLine.width = _this.map.size.width + borderWidth * 2;
            _this.rgbBordersLine.height = _this.map.size.height + borderWidth * 2;
            _this.create();
        });
        return _this;
    }
    Borders.prototype.applyFilter = function () {
        this.colorMatrixFilter = new pixi_js_1.filters.ColorMatrixFilter();
        this.filters = [this.colorMatrixFilter];
    };
    Borders.prototype.animateFilter = function () {
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        var borderType = this.map.world.settings.all.settings.theming.map.borderType;
        var animatedBorder = borderType.includes('anim');
        var rgbBorder = borderType === 'RGB' || borderType === 'RGB (anim)';
        if (animatedBorder) {
            if (rgbBorder) {
                if (this.colorMatrixFilterHue >= 360) {
                    this.colorMatrixFilterHue = 0;
                }
                this.colorMatrixFilterHue += 1 * deltaTime;
            }
            else {
                this.colorMatrixFilterHue += 0.1 * deltaTime;
            }
            this.colorMatrixFilter.hue(this.colorMatrixFilterHue, false);
        }
        else {
            if (this.colorMatrixFilterHue !== 0) {
                this.colorMatrixFilterHue = 0;
                this.colorMatrixFilter.hue(0, false);
            }
        }
    };
    Borders.prototype.updateTextures = function () {
        this.create();
        this.createRgb();
    };
    Borders.prototype.create = function () {
        var _a = this.map.world.settings.all.settings.theming.map, borderGlow = _a.borderGlow, borderWidth = _a.borderWidth, borderGlowDistance = _a.borderGlowDistance;
        var glowFilterShaderType = this.map.world.settings.all.settings.game.performance.glowFilterShaderType;
        var MAP_RATIO = 14142 / 2048;
        if (this.bordersSprite) {
            // this.map.world.textureGenerator.generateMapBorders();
            this.removeChild(this.bordersSprite);
            this.bordersSprite.destroy();
            this.map.world.textureGenerator.generateMapBorders();
        }
        var bordersSize = this.map.size.width;
        var pos = 0;
        if (borderGlow) {
            bordersSize += borderWidth * 2 + borderGlowDistance * 2;
            pos = -(borderWidth * 2 + borderGlowDistance);
        }
        var sideSize = 0;
        if (glowFilterShaderType === 'GPU-1') {
            sideSize = borderGlow ? (borderWidth * 2 + borderGlowDistance * 2) : borderWidth * 2;
        }
        else {
            sideSize = borderGlow ? (borderWidth * 2 + borderGlowDistance * 2) / MAP_RATIO / 2 : borderWidth * 2 / MAP_RATIO / 2;
        }
        this.bordersSprite = new pixi_js_1.NineSlicePlane(this.map.world.textureGenerator.mapBorders, sideSize, sideSize, sideSize, sideSize);
        this.bordersSprite.width = bordersSize;
        this.bordersSprite.height = bordersSize;
        this.bordersSprite.x = pos;
        this.bordersSprite.y = pos;
        this.addChild(this.bordersSprite);
    };
    Borders.prototype.createRgb = function () {
        var size = 1100;
        if (this.rgbBorders || this.rgbBordersLine) {
            this.map.world.textureGenerator.generateRgbLine();
            this.removeChild(this.rgbBorders, this.rgbBordersLine);
            this.rgbBorders.destroy();
            this.rgbBordersLine.destroy();
        }
        // HARDCODED POSITION
        var borderWidth = 20;
        this.rgbBorders = new pixi_js_1.Sprite(this.map.world.textureGenerator.rgbBorder);
        this.rgbBorders.width = this.map.size.width + size;
        this.rgbBorders.height = this.map.size.height + size;
        this.rgbBorders.x = -size / 2;
        this.rgbBorders.y = -size / 2;
        this.rgbBordersLine = new pixi_js_1.Sprite(this.map.world.textureGenerator.mapBordersRgbLine);
        this.rgbBordersLine.width = this.map.size.width + borderWidth * 2;
        this.rgbBordersLine.height = this.map.size.height + borderWidth * 2;
        this.rgbBordersLine.x = -borderWidth;
        this.rgbBordersLine.y = -borderWidth;
        this.addChild(this.rgbBorders, this.rgbBordersLine);
    };
    Borders.prototype.renderTick = function () {
        var borderType = this.map.world.settings.all.settings.theming.map.borderType;
        this.visible = borderType !== 'Disabled';
        this.rgbBorders.visible = borderType === 'RGB' || borderType === 'RGB (anim)';
        this.rgbBordersLine.visible = borderType === 'RGB' || borderType === 'RGB (anim)';
        this.bordersSprite.visible = borderType === 'Common' || borderType === 'Common (anim)';
        this.animateFilter();
    };
    return Borders;
}(pixi_js_1.Container));
exports.default = Borders;
