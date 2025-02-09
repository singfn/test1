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
var SpawnAnimation = /** @class */ (function (_super) {
    __extends(SpawnAnimation, _super);
    function SpawnAnimation(location, world, tint) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.culled = false;
        _this.spriteBuffer = [];
        _this.deltaStepMultiplier = 0.00425;
        var spawnAnimation = world.settings.all.settings.game.effects.spawnAnimation;
        switch (spawnAnimation) {
            case 'Default':
                _this.spriteBuffer.push(new pixi_js_1.Sprite(_this.world.textureGenerator.removeEffect));
                break;
            case '2CL':
                _this.spriteBuffer.push(new pixi_js_1.Sprite(_this.world.textureGenerator.removeAnimationHSLO3D));
                break;
            case 'Acimazis':
                _this.world.textureGenerator.removeAnimationsAcim.forEach(function (texture) { return _this.spriteBuffer.push(new pixi_js_1.Sprite(texture)); });
                break;
            case 'Yue':
                _this.world.textureGenerator.removeAnimationYue.forEach(function (texture) { return _this.spriteBuffer.push(new pixi_js_1.Sprite(texture)); });
                break;
        }
        _this.spriteBuffer.forEach(function (sprite) {
            sprite.anchor.set(0.5);
            sprite.tint = tint ? tint : 0xFFFFFF;
            sprite.width = 0;
            sprite.height = 0;
            sprite.alpha = 0;
            _this.addChild(sprite);
        });
        _this.type = 'SPAWN_ANIMATION';
        _this.zIndex = 0;
        _this.x = location.x;
        _this.y = location.y;
        _this.r = 3500;
        return _this;
    }
    SpawnAnimation.prototype.getStep = function () {
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        return this.r * this.deltaStepMultiplier * deltaTime;
    };
    SpawnAnimation.prototype.setIsMinimap = function () {
        this.r = 88;
    };
    SpawnAnimation.prototype.animate = function () {
        if (this.spriteBuffer[0].width >= this.r) {
            this.destroy({ children: true });
            this.isDestroyed = true;
            return;
        }
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        var step = this.getStep();
        var alpha = (this.r - this.spriteBuffer[0].width) / this.r;
        this.spriteBuffer.forEach(function (sprite, i) {
            sprite.alpha = alpha;
            sprite.width += step;
            sprite.height += step;
            if (i % 2 === 0) {
                sprite.rotation += 0.007 * deltaTime;
            }
            else {
                sprite.rotation -= 0.007 * deltaTime;
            }
        });
    };
    return SpawnAnimation;
}(pixi_js_1.Container));
exports.default = SpawnAnimation;
