"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var filter_glow_1 = require("@pixi/filter-glow");
var helpers_1 = require("../../../utils/helpers");
var Globals_1 = __importDefault(require("../../../Globals"));
var generateVirus = function (settings) {
    var _a = settings.all.settings.theming.viruses, color = _a.color, transparency = _a.transparency, borderWidth = _a.borderWidth, glow = _a.glow, borderColor = _a.borderColor, glowColor = _a.glowColor, glowDistance = _a.glowDistance, glowStrength = _a.glowStrength;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var halfBorder = borderWidth / 2;
    var glowOffset = glow ? glowDistance * 2 : 0;
    canvas.width = canvas.height = 400 + borderWidth + glowOffset;
    ctx.strokeStyle = helpers_1.rgbToStringHex(borderColor);
    ctx.lineWidth = borderWidth;
    var glowShift = glow ? glowDistance : 0;
    ctx.arc(200 + halfBorder + glowShift, 200 + halfBorder + glowShift, 200, 0, Math.PI * 2);
    ctx.stroke();
    var texture = pixi_js_1.Texture.from(canvas);
    texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.ON;
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    var sprite = new pixi_js_1.Sprite(texture);
    if (glow) {
        // @ts-ignore
        sprite.filters = [new filter_glow_1.GlowFilter({
                color: helpers_1.getColor(glowColor),
                distance: glowDistance,
                outerStrength: glowStrength,
                quality: 0.0175
            })];
    }
    texture = Globals_1.default.app.renderer.generateTexture(sprite, pixi_js_1.SCALE_MODES.LINEAR, 1);
    texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.ON;
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    return texture;
};
exports.default = generateVirus;
