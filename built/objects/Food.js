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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var PIXI = __importStar(require("pixi.js"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var Food = /** @class */ (function (_super) {
    __extends(Food, _super);
    function Food(world, location, subtype) {
        var _this = _super.call(this, world.textureGenerator.food) || this;
        _this.world = world;
        _this.removing = false;
        _this.isDestroyed = false;
        _this.culled = false;
        _this.SIZE = 512;
        _this.SPEED = 0.0225;
        _this.realAlpha = 0;
        var x = location.x, y = location.y, r = location.r;
        var foodPerformanceMode = _this.world.settings.all.settings.game.performance.foodPerformanceMode;
        _this.type = 'FOOD';
        _this.anchor.set(0.5);
        _this.originalSize = r * 2;
        _this.subtype = subtype;
        _this.x = x;
        _this.y = y;
        _this.width = _this.height = foodPerformanceMode ? 512 : 0;
        _this.alpha = foodPerformanceMode ? 1 : 0;
        _this.removing = false;
        _this.isDestroyed = false;
        _this.culled = false;
        _this.realAlpha = 0;
        return _this;
    }
    Food.prototype.getStep = function () {
        return this.SIZE * this.SPEED * PIXI.Ticker.shared.deltaTime;
    };
    Food.prototype.hide = function () {
        this.alpha = 0;
        this.visible = false;
    };
    Food.prototype.show = function (fast) {
        this.visible = true;
        if (fast) {
            this.alpha = 1;
            this.realAlpha = 1;
            this.width = this.SIZE;
            this.height = this.SIZE;
        }
        else {
            this.alpha = this.realAlpha;
        }
    };
    Food.prototype.animate = function () {
        var instantAnimation = PlayerState_1.default.first.playing &&
            PlayerState_1.default.second.playing &&
            this.world.settings.all.settings.game.gameplay.spectatorMode !== 'Full map';
        if (this.removing) {
            if (this.culled) {
                this.isDestroyed = true;
                return;
            }
            // instantly remove & destroy 
            if (instantAnimation) {
                this.isDestroyed = true;
                return;
            }
            if (this.width <= 40) {
                // food is ready to be removed & destroyed
                this.isDestroyed = true;
            }
            else {
                // slowly decrease scale & alpha 
                var step = this.getStep();
                this.width -= step;
                this.height -= step;
                this.realAlpha = this.width / this.SIZE;
            }
        }
        else {
            if (this.culled) {
                this.width = this.height = this.SIZE;
                this.realAlpha = 1;
                this.alpha = 1;
                this.visible = false;
                return;
            }
            else {
                this.visible = true;
            }
            // instantly set alpha & scale 
            if (instantAnimation) {
                this.realAlpha = 1;
                this.width = this.height = this.SIZE;
                return;
            }
            if (this.width >= this.SIZE) {
                // set capped values - food is fully animated
                this.realAlpha = 1;
                this.width = this.height = this.SIZE;
            }
            else {
                // need to animate scale & opacity
                var step = this.getStep();
                this.width += step;
                this.height += step;
                this.realAlpha = this.width / this.SIZE;
            }
        }
    };
    Food.prototype.update = function (location) { };
    Food.prototype.remove = function () {
        this.removing = true;
    };
    return Food;
}(pixi_js_1.Sprite));
exports.default = Food;
