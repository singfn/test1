"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var filter_glow_1 = require("@pixi/filter-glow");
var pixi_js_1 = require("pixi.js");
var pixi_js_2 = require("pixi.js");
var Globals_1 = __importDefault(require("../../../Globals"));
var generateMyCellShadow = function (settings) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var size = 512;
    var lineWidth = 6;
    var _a = settings.all.settings.theming.cells, myShadowDistance = _a.myShadowDistance, myShadowStrength = _a.myShadowStrength;
    canvas.width = canvas.height = size + myShadowDistance * 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = lineWidth;
    ctx.arc(size / 2 + myShadowDistance, size / 2 + myShadowDistance, size / 2 - lineWidth, 0, Math.PI * 2);
    ctx.stroke();
    if (settings.all.settings.game.performance.glowFilterShaderType === 'GPU-1') {
        var sprite = new pixi_js_1.Sprite(pixi_js_2.Texture.from(canvas));
        // @ts-ignore
        sprite.filters = [new filter_glow_1.GlowFilter({
                color: 0xFFFFFF,
                distance: myShadowDistance,
                outerStrength: myShadowStrength,
                quality: 0.175
            })];
        var texture_1 = Globals_1.default.app.renderer.generateTexture(sprite, pixi_js_2.SCALE_MODES.LINEAR, 1);
        texture_1.baseTexture.scaleMode = pixi_js_2.SCALE_MODES.LINEAR;
        texture_1.baseTexture.mipmap = pixi_js_2.MIPMAP_MODES.POW2;
        return texture_1;
    }
    else if (settings.all.settings.game.performance.glowFilterShaderType === 'Canvas') {
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = myShadowDistance - lineWidth;
        for (var i = 0; i < myShadowStrength; i++) {
            ctx.stroke();
        }
    }
    var texture = pixi_js_2.Texture.from(canvas);
    texture.baseTexture.mipmap = pixi_js_2.MIPMAP_MODES.ON;
    texture.baseTexture.scaleMode = pixi_js_2.SCALE_MODES.LINEAR;
    return texture;
};
exports.default = generateMyCellShadow;
