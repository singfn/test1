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
var VirusShots_1 = __importDefault(require("./VirusShots"));
var PIXI = __importStar(require("pixi.js"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var Virus = /** @class */ (function (_super) {
    __extends(Virus, _super);
    function Virus(location, subtype, world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.isPlayerCell = false;
        _this.isDestroyed = false;
        _this.removing = false;
        _this.removeType = null;
        _this.newLocation = { x: 0, y: 0, r: 0 };
        _this.culled = false;
        _this.type = 'VIRUS';
        _this.subtype = subtype;
        _this.location = location;
        _this.newLocation = location;
        _this.virusSprite = new pixi_js_1.Sprite(_this.world.textureGenerator.virus);
        _this.virusSprite.anchor.set(0.5);
        _this.addChild(_this.virusSprite);
        _this.shots = new VirusShots_1.default(location.r, world);
        _this.addChild(_this.shots);
        var x = location.x, y = location.y, r = location.r;
        _this.originalSize = r;
        _this.newOriginalSize = r;
        _this.setSize(r);
        _this.x = x;
        _this.y = y;
        _this.zIndex = _this.originalSize;
        _this.alpha = 0;
        return _this;
    }
    Virus.prototype.getGlowDistance = function () {
        var _a = this.world.settings.all.settings.theming.viruses, glow = _a.glow, glowDistance = _a.glowDistance;
        if (!glow) {
            return 0;
        }
        return glowDistance;
    };
    Virus.prototype.setSize = function (radius) {
        var size = radius * 2 + this.getGlowDistance();
        this.width = this.height = size;
    };
    Virus.prototype.updateTexture = function () {
        this.virusSprite.texture = this.world.textureGenerator.virus;
        this.setSize(this.location.r);
    };
    Virus.prototype.setIsMinimap = function (size) {
        size *= 2.2;
        this.isMinimap = true;
        this.width = this.height = size;
        this.shots.visible = false;
        this.shots.renderable = false;
    };
    Virus.prototype.update = function (location) {
        this.shots.update(location.r);
        this.newLocation = location;
    };
    Virus.prototype.remove = function (removeType) {
        this.removing = true;
        this.removeType = removeType;
    };
    Virus.prototype.animateOutOfView = function (speed) {
        if (this.world.settings.all.settings.game.multibox.enabled && PlayerState_1.default.first.playing && PlayerState_1.default.second.playing) {
            this.destroy({ children: true });
            this.isDestroyed = true;
        }
        else if (this.alpha <= 0) {
            this.destroy({ children: true });
            this.isDestroyed = true;
        }
        else {
            this.alpha -= speed;
        }
    };
    Virus.prototype.animateEaten = function (speed) {
        if (this.width > 1) {
            var step = this.newLocation.r * speed;
            this.width -= step;
            this.height -= step;
            this.zIndex = this.originalSize;
        }
        else {
            this.destroy({ children: true });
            this.isDestroyed = true;
        }
    };
    Virus.prototype.getAnimationSpeed = function () {
        return (this.world.settings.all.settings.game.gameplay.animationSpeed / 1000) * PIXI.Ticker.shared.deltaTime;
    };
    Virus.prototype.animateMove = function (speed) {
        var instantAnimation = this.world.settings.all.settings.game.multibox.enabled &&
            PlayerState_1.default.first.playing &&
            PlayerState_1.default.second.playing &&
            this.world.settings.all.settings.game.gameplay.spectatorMode !== 'Full map';
        var glowOffset = this.isMinimap ? 4 : this.getGlowDistance();
        var x = (this.newLocation.x - this.x) * speed;
        var y = (this.newLocation.y - this.y) * speed;
        var r = ((this.newLocation.r * 2 + glowOffset) - this.width) * speed;
        this.width += r;
        this.height += r;
        this.x += x;
        this.y += y;
        this.zIndex = this.originalSize;
        if (instantAnimation) {
            this.alpha = 1;
        }
        else if (this.alpha < 1) {
            this.alpha += speed;
        }
        else {
            this.alpha = 1;
        }
        this.shots.animate();
    };
    Virus.prototype.animate = function () {
        var speed = this.getAnimationSpeed();
        this.originalSize += (this.newOriginalSize - this.originalSize) * speed;
        if (this.removing) {
            if (this.removeType === 'REMOVE_CELL_OUT_OF_VIEW') {
                this.animateOutOfView(speed);
            }
            else if (this.removeType === 'REMOVE_EATEN_CELL') {
                this.animateEaten(speed);
            }
        }
        else {
            this.animateMove(speed);
        }
    };
    Virus.prototype.setIsVisible = function (value) {
        this.visible = value;
        this.renderable = value;
        this.isVisible = false;
    };
    return Virus;
}(pixi_js_1.Container));
exports.default = Virus;
