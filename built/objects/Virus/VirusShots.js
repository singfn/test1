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
var VirusShots = /** @class */ (function (_super) {
    __extends(VirusShots, _super);
    function VirusShots(virusRadius, world) {
        var _this = _super.call(this) || this;
        _this.virusRadius = virusRadius;
        _this.world = world;
        _this.animatedRadius = 100;
        _this.animatedRadius = virusRadius;
        _this.shotsCircleSprite = new pixi_js_1.Sprite(_this.world.textureGenerator.virusShots);
        _this.shotsCircleSprite.anchor.set(0.5, 0.5);
        _this.shotsCircleSprite.scale.set((100 - (200 - _this.virusRadius)) / 50);
        _this.addChild(_this.shotsCircleSprite);
        _this.text = new pixi_js_1.BitmapText('0', { fontName: 'MassLato', fontSize: 160 });
        _this.text.anchor.set(0.5, 0.5);
        _this.addChild(_this.text);
        _this.alpha = 0.925;
        return _this;
    }
    VirusShots.prototype.getShotsAmount = function () {
        switch (this.virusRadius) {
            case 100: return '7';
            case 106: return '6';
            case 113: return '5';
            case 119: return '4';
            case 125: return '3';
            case 131: return '2';
            case 136: return '1';
            case 141: return '0';
        }
    };
    VirusShots.prototype.updateShotsCircleSize = function () {
        var scaleTo = (100 - (200 - this.virusRadius)) / 50;
        var newScale = (scaleTo - this.shotsCircleSprite.scale.x) * this.getAnimationSpeed();
        this.shotsCircleSprite.scale.x += newScale;
        this.shotsCircleSprite.scale.y += newScale;
        this.shotsCircleSprite.visible = this.world.settings.all.settings.theming.viruses.massType === 'Fill circle';
    };
    VirusShots.prototype.updateText = function () {
        var massType = this.world.settings.all.settings.theming.viruses.massType;
        this.text.visible = true;
        if (massType === 'Shots amount') {
            this.text.text = this.getShotsAmount();
        }
        else if (massType === 'Full mass') {
            this.text.text = (~~(100 - this.animatedRadius * 2)).toString();
        }
        else {
            this.text.visible = false;
        }
    };
    VirusShots.prototype.animateRadius = function () {
        var newRadius = (this.virusRadius - this.animatedRadius) * this.getAnimationSpeed();
        this.animatedRadius += newRadius;
    };
    VirusShots.prototype.getAnimationSpeed = function () {
        return (this.world.settings.all.settings.game.gameplay.animationSpeed / 1000) * PIXI.Ticker.shared.deltaTime;
    };
    VirusShots.prototype.update = function (virusRadius) {
        this.virusRadius = virusRadius;
    };
    VirusShots.prototype.animate = function () {
        this.updateShotsCircleSize();
        this.updateText();
        this.animateRadius();
    };
    return VirusShots;
}(pixi_js_1.Container));
exports.default = VirusShots;
