"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var filter_glow_1 = require("@pixi/filter-glow");
var helpers_1 = require("../../../utils/helpers");
var Globals_1 = __importDefault(require("../../../Globals"));
var generateFood = function (settings) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var _a = settings.all.settings.theming.food, size = _a.size, color = _a.color, glow = _a.glow, glowColor = _a.glowColor, glowDistance = _a.glowDistance, glowStrength = _a.glowStrength, crisp = _a.crisp;
    var canvasSize = 512;
    var glowQuality = 0.13;
    canvas.width = canvas.height = canvasSize; // 512
    ctx.fillStyle = helpers_1.rgbToStringHex(color);
    ctx.globalAlpha = color.alpha;
    ctx.arc(canvasSize / 2, canvasSize / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    var sprite;
    if (glow) {
        if (settings.all.settings.game.performance.glowFilterShaderType === 'GPU-1') {
            pixi_js_1.utils.trimCanvas(canvas);
            sprite = new pixi_js_1.Sprite(pixi_js_1.Texture.from(canvas));
            // @ts-ignore
            sprite.filters = [new filter_glow_1.GlowFilter({
                    color: helpers_1.getColor(glowColor),
                    distance: glowDistance,
                    outerStrength: glowStrength,
                    quality: glowQuality
                })];
        }
        else {
            ctx.shadowColor = helpers_1.rgbToStringHex(glowColor);
            ctx.shadowBlur = glowDistance / 2.5;
            for (var i = 0; i < glowStrength / 1.5; i++) {
                ctx.fill();
            }
            pixi_js_1.utils.trimCanvas(canvas);
            sprite = new pixi_js_1.Sprite(pixi_js_1.Texture.from(canvas));
        }
    }
    else {
        sprite = new pixi_js_1.Sprite(pixi_js_1.Texture.from(canvas));
    }
    var texture = Globals_1.default.app.renderer.generateTexture(sprite, pixi_js_1.SCALE_MODES.LINEAR, 1);
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    if (!crisp) {
        texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.POW2;
    }
    return texture;
};
exports.default = generateFood;
