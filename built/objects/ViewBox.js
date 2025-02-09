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
var ViewBox = /** @class */ (function (_super) {
    __extends(ViewBox, _super);
    function ViewBox(world) {
        var _this = _super.call(this, world.textureGenerator.viewBox) || this;
        _this.world = world;
        _this.x = 0;
        _this.y = 0;
        return _this;
    }
    ViewBox.prototype.animate = function (left, top, width, height) {
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        var animationSpeed = 1.5 / 30;
        this.x += (left - this.x) * animationSpeed * deltaTime;
        this.y += (top - this.y) * animationSpeed * deltaTime;
        this.width += (width - this.width) * animationSpeed * deltaTime;
        this.height += (height - this.height) * animationSpeed * deltaTime;
    };
    return ViewBox;
}(pixi_js_1.Sprite));
exports.default = ViewBox;
