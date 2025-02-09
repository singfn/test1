"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var filter_glow_1 = require("@pixi/filter-glow");
var helpers_1 = require("../../../utils/helpers");
var Globals_1 = __importDefault(require("../../../Globals"));
var generateBorders = function (settings) {
    var _a = settings.all.settings.theming.map, borderGlow = _a.borderGlow, borderGlowColor = _a.borderGlowColor, borderGlowDistance = _a.borderGlowDistance, borderGlowStrength = _a.borderGlowStrength, borderRoundness = _a.borderRoundness, borderColor = _a.borderColor, borderWidth = _a.borderWidth;
    var glowQuality = 0.0065;
    var bordersRenderSize = 512;
    var rounded = true;
    if (settings.all.settings.game.performance.glowFilterShaderType === 'GPU-1') {
        var offset = borderGlow ? borderWidth : 0;
        var g = new pixi_js_1.Graphics();
        g.lineStyle(borderWidth, helpers_1.getColor(borderColor));
        if (rounded) {
            g.drawRoundedRect(offset, offset, bordersRenderSize * 1.5 - offset, bordersRenderSize * 1.5 - offset, borderRoundness);
        }
        else {
            g.lineTo(bordersRenderSize * 1.5 - offset, 0);
            g.lineTo(bordersRenderSize * 1.5 - offset, bordersRenderSize * 1.5 - offset);
            g.lineTo(0, bordersRenderSize * 1.5 - offset);
            g.closePath();
        }
        if (borderGlow) {
            // @ts-ignore
            g.filters = [new filter_glow_1.GlowFilter({
                    quality: glowQuality,
                    outerStrength: borderGlowStrength,
                    distance: borderGlowDistance,
                    color: helpers_1.getColor(borderGlowColor)
                })];
            g.y = g.x = borderWidth + borderGlowDistance;
        }
        else {
            g.y = g.x = borderWidth / 2;
        }
        var c = new pixi_js_1.Container();
        c.addChild(g);
        var borderSize = borderGlow
            ? (bordersRenderSize * 1.5 + borderGlowDistance * 2 + borderWidth * 2)
            : bordersRenderSize * 1.5 + borderWidth;
        var area = new pixi_js_1.Rectangle(0, 0, borderSize, borderSize);
        var texture = Globals_1.default.app.renderer.generateTexture(c, pixi_js_1.SCALE_MODES.LINEAR, 1, area);
        texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.ON;
        return texture;
    }
    else {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var renderSize = bordersRenderSize * 4;
        canvas.width = canvas.height = renderSize;
        var ratio = 14142 / 2048;
        var _borderGlowDistance = borderGlow ? borderGlowDistance : 1;
        var offset = ((_borderGlowDistance / ratio) + (borderWidth / 2 / ratio)) * 2;
        ctx.strokeStyle = helpers_1.rgbToStringHex(borderColor);
        ctx.lineWidth = borderWidth / ratio;
        ctx.beginPath();
        ctx.lineTo(offset, offset);
        ctx.lineTo(renderSize - offset, offset);
        ctx.lineTo(renderSize - offset, renderSize - offset);
        ctx.lineTo(offset, renderSize - offset);
        ctx.closePath();
        if (borderGlow) {
            ctx.shadowBlur = _borderGlowDistance / ratio / 1.5;
            ctx.shadowColor = helpers_1.rgbToStringHex(borderGlowColor);
            for (var i = 0; i < borderGlowStrength; i++) {
                ctx.stroke();
            }
        }
        else {
            ctx.stroke();
        }
        var texture = pixi_js_1.Texture.from(canvas);
        texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.POW2;
        return texture;
    }
};
exports.default = generateBorders;
