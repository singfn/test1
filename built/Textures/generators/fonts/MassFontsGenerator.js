"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var MassFontsGenerator = /** @class */ (function () {
    function MassFontsGenerator() {
        this.CHARS_SET = ['.', 'k', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        this.TEXTURE_SIZE = 256;
    }
    MassFontsGenerator.prototype.generateLatoBitmap = function () {
        var style = new pixi_js_1.TextStyle({
            fontFamily: 'Tajawal',
            fontWeight: '500',
            fill: 0xFFFFFF,
            fontSize: 132,
            align: 'center',
            stroke: 0x161616,
            strokeThickness: 5,
        });
        pixi_js_1.BitmapFont.from('MassLato', style, {
            chars: this.CHARS_SET,
            textureWidth: this.TEXTURE_SIZE,
            textureHeight: this.TEXTURE_SIZE,
            resolution: 1
        });
    };
    return MassFontsGenerator;
}());
exports.default = MassFontsGenerator;
