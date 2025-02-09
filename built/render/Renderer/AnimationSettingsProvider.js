"use strict";
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
var PIXI = __importStar(require("pixi.js"));
var AnimationSettingsProvider = /** @class */ (function () {
    function AnimationSettingsProvider(world) {
        this.world = world;
    }
    AnimationSettingsProvider.prototype.getAnimationSpeed = function () {
        return (this.world.settings.all.settings.game.gameplay.animationSpeed / 1000) * PIXI.Ticker.shared.deltaTime;
    };
    AnimationSettingsProvider.prototype.getFadeSpeed = function () {
        var fadeSpeed = this.world.settings.all.settings.game.cells.fadeSpeed;
        if (fadeSpeed === 0) {
            return 0;
        }
        return ((250 - fadeSpeed) / 1000) * PIXI.Ticker.shared.deltaTime;
    };
    AnimationSettingsProvider.prototype.getSoakSpeed = function () {
        var soakSpeed = this.world.settings.all.settings.game.cells.soakSpeed;
        if (soakSpeed === 0) {
            return 0;
        }
        return ((250 - soakSpeed) / 1000) * PIXI.Ticker.shared.deltaTime;
    };
    // the next two methods are usable for private servers where are a lot of ejected sprites
    // the more container size is, the faster animations is
    AnimationSettingsProvider.prototype.getFadeSpeedForEjected = function () {
        var fadeSpeed = this.world.settings.all.settings.game.cells.fadeSpeed;
        var speedIncreaseMultiplier = 1;
        if (fadeSpeed === 0) {
            return 0;
        }
        // speed up animation if container contains a lot of sprites to remove faster and decrease lag spikes
        // if (this.world.ejected.children.length > 256) {
        //   speedIncreaseMultiplier = this.world.ejected.children.length / 128;
        // }
        return (((250 - fadeSpeed) / 1000) * speedIncreaseMultiplier) * PIXI.Ticker.shared.deltaTime;
    };
    AnimationSettingsProvider.prototype.getSoakSpeedForEjected = function () {
        var soakSpeed = this.world.settings.all.settings.game.cells.soakSpeed;
        var speedIncreaseMultiplier = 1;
        if (soakSpeed === 0) {
            return 0;
        }
        // speed up animation if container contains a lot of sprites to remove faster and decrease lag spikes
        // if (this.world.ejected.children.length > 256) {
        //   speedIncreaseMultiplier = this.world.ejected.children.length / 128;
        // }
        return (((250 - soakSpeed) / 1000) * speedIncreaseMultiplier) * PIXI.Ticker.shared.deltaTime;
    };
    return AnimationSettingsProvider;
}());
exports.default = AnimationSettingsProvider;
