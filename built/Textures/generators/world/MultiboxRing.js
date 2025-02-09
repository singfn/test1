"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var generateMultiboxLinedRing = function (settings) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var size = 512;
    var lineWidth = settings.all.settings.theming.multibox.linedRingSize;
    canvas.width = canvas.height = size;
    ctx.fillStyle = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = lineWidth;
    ctx.arc(size / 2, size / 2, size / 2 - lineWidth / 2, 0, Math.PI * 2);
    ctx.stroke();
    var texture = pixi_js_1.Texture.from(canvas);
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    return texture;
};
exports.default = generateMultiboxLinedRing;
