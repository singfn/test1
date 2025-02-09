"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var generateRemoveEffect = function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 512;
    var depth = 256 - 25;
    var gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, depth);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, '#ff96f1');
    ctx.arc(256, 256, 256, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    var texture = pixi_js_1.Texture.from(canvas);
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    return texture;
};
exports.default = generateRemoveEffect;
