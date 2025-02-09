"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Globals_1 = __importDefault(require("../../../Globals"));
var createViewBox = function () {
    var g = new pixi_js_1.Graphics();
    g.beginFill(0xFFFFFF, 1);
    g.drawRect(0, 0, 512, 512);
    g.endFill();
    var area = new pixi_js_1.Rectangle(0, 0, 512, 512);
    var texture = Globals_1.default.app.renderer.generateTexture(g, pixi_js_1.SCALE_MODES.LINEAR, 1, area);
    return texture;
};
exports.default = createViewBox;
