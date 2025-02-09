"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var helpers_1 = require("../../../utils/helpers");
var generateRgbBorderLine = function (settings) {
    var _a = settings.all.settings.theming.map, borderRoundness = _a.borderRoundness, borderColor = _a.borderColor, borderWidth = _a.borderWidth;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var renderSize = 512 * 4;
    canvas.width = canvas.height = renderSize;
    var ratio = 14142 / 2048;
    var offset = (borderWidth * 2 / 2 / ratio);
    ctx.strokeStyle = helpers_1.rgbToStringHex(borderColor);
    ctx.lineWidth = borderWidth * 2 / ratio;
    if (borderRoundness !== 0) {
        helpers_1.roundRect(ctx, offset, offset, renderSize - offset, renderSize - offset, borderRoundness / 4);
        ctx.stroke();
    }
    else {
        ctx.beginPath();
        ctx.lineTo(offset, offset);
        ctx.lineTo(renderSize - offset, offset);
        ctx.lineTo(renderSize - offset, renderSize - offset);
        ctx.lineTo(offset, renderSize - offset);
        ctx.closePath();
        ctx.stroke();
    }
    var texture = pixi_js_1.Texture.from(canvas);
    texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.POW2;
    texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
    return texture;
};
exports.default = generateRgbBorderLine;
