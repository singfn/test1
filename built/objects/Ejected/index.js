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
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var helpers_1 = require("../../utils/helpers");
var Ejected = /** @class */ (function (_super) {
    __extends(Ejected, _super);
    function Ejected(world, location, color, subtype) {
        var _this = _super.call(this, world.textureGenerator.cell) || this;
        _this.world = world;
        _this.type = 'EJECTED';
        _this.culled = false;
        _this.isVisible = true;
        _this.isPlayerCell = false;
        _this.isDestroyed = false;
        _this.eatenBy = { x: 0, y: 0 };
        _this.removing = false;
        _this.anchor.set(0.5);
        var _a = _this.world.settings.all.settings.theming.cells, colorLighten = _a.colorLighten, oneColoredColor = _a.oneColoredColor;
        var oneColored = _this.world.settings.all.settings.game.cells.oneColored;
        _this.subtype = subtype;
        _this.x = location.x;
        _this.y = location.y;
        _this.width = _this.height = _this.SIZE = location.r * 2;
        _this.newLocation = location;
        if (oneColored) {
            _this.tint = helpers_1.getColor(oneColoredColor);
        }
        else {
            _this.tint = helpers_1.getColorLighten(colorLighten, color);
        }
        _this.removing = false;
        _this.isDestroyed = false;
        _this.isPlayerCell = false;
        _this.isVisible = true;
        _this.renderable = true;
        _this.culled = false;
        _this.eatenBy = { x: 0, y: 0 };
        _this.alpha = 1;
        return _this;
    }
    Ejected.prototype.update = function (location) {
        this.newLocation.x = location.x;
        this.newLocation.y = location.y;
        this.newLocation.r = location.r * 2;
    };
    Ejected.prototype.setIsVisible = function (value) {
        this.isVisible = value;
    };
    Ejected.prototype.animateOutOfView = function (fadeSpeed) {
        this.alpha += -fadeSpeed;
        if (this.alpha <= 0 || fadeSpeed === 0) {
            this.isDestroyed = true;
            this.alpha = 0;
        }
    };
    Ejected.prototype.animateEaten = function (fadeSpeed, soakSpeed, animationSpeed) {
        if (!this.isVisible) {
            this.isDestroyed = true;
            return;
        }
        if (soakSpeed !== 0) {
            var newSize = -(this.width * soakSpeed);
            this.width += newSize;
            this.height += newSize;
            if (this.world.settings.all.settings.game.cells.soakToEaten) {
                var x = (this.eatenBy.x - this.x) * (animationSpeed / 5);
                var y = (this.eatenBy.y - this.y) * (animationSpeed / 5);
                this.x += x;
                this.y += y;
            }
            this.alpha += (this.width / this.SIZE);
            if (this.width <= 5) {
                this.isDestroyed = true;
            }
        }
        else {
            if (fadeSpeed === 0) {
                this.isDestroyed = true;
                return;
            }
            this.alpha += -fadeSpeed;
            if (this.alpha <= 0) {
                this.isDestroyed = true;
            }
        }
    };
    Ejected.prototype.animateMove = function (animationSpeed, fadeSpeed) {
        var transparency = this.world.settings.all.settings.theming.cells.transparency;
        var x = (this.newLocation.x - this.x) * animationSpeed;
        var y = (this.newLocation.y - this.y) * animationSpeed;
        this.x += x;
        this.y += y;
        if (!this.isVisible) {
            if (this.alpha > 0 && fadeSpeed !== 0) {
                this.alpha += -fadeSpeed;
            }
            else {
                this.alpha = 0;
                this.visible = false;
                this.renderable = false;
            }
        }
        else {
            this.visible = true;
            this.renderable = true;
            if (this.alpha < transparency && fadeSpeed !== 0) {
                this.alpha += fadeSpeed;
            }
            else {
                this.alpha = transparency;
            }
        }
    };
    Ejected.prototype.animate = function (animationSpeed, fadeSpeed, soakSpeed) {
        if (this.removing) {
            if (this.removeType === 'REMOVE_CELL_OUT_OF_VIEW') {
                this.animateOutOfView(fadeSpeed);
            }
            else if (this.removeType === 'REMOVE_EATEN_CELL') {
                this.animateEaten(fadeSpeed, soakSpeed, animationSpeed);
            }
        }
        else {
            if (this.culled) {
                this.visible = false;
                this.renderable = false;
                this.x = this.newLocation.x;
                this.y = this.newLocation.y;
            }
            else {
                this.animateMove(animationSpeed, fadeSpeed);
            }
        }
    };
    Ejected.prototype.remove = function (type, eatenBy) {
        this.removing = true;
        this.removeType = type;
        if (eatenBy) {
            this.eatenBy.x = eatenBy.x;
            this.eatenBy.y = eatenBy.y;
        }
    };
    return Ejected;
}(pixi_js_1.Sprite));
exports.default = Ejected;
