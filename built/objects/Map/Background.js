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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var PIXI = __importStar(require("pixi.js"));
var ViewportVisualizer_1 = __importDefault(require("./ViewportVisualizer"));
var helpers_1 = require("../../utils/helpers");
var Background = /** @class */ (function (_super) {
    __extends(Background, _super);
    function Background(map) {
        var _this = _super.call(this) || this;
        _this.map = map;
        _this.create();
        _this.zIndex = 9;
        _this.sortableChildren = true;
        _this.viewportVisualizer = new ViewportVisualizer_1.default(_this.map.world);
        _this.viewportVisualizer.zIndex = 100;
        _this.spriteContainer.addChild(_this.viewportVisualizer);
        _this.map.listen('sizechange', function () {
            _this.sprite.width = _this.map.size.width + 800;
            _this.sprite.height = _this.map.size.height + 800;
            _this.displacementSprite.width = _this.map.size.width;
            _this.displacementSprite.height = _this.map.size.height;
            _this.gmask.clear();
            _this.gmask.beginFill(0xffffff);
            _this.gmask.drawRect(0, 0, _this.map.size.width, _this.map.size.height);
            _this.gmask.endFill();
        });
        return _this;
    }
    Background.prototype.updateTexture = function () {
        return __awaiter(this, void 0, void 0, function () {
            var texture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.map.world.textureGenerator.updateBackground()];
                    case 1:
                        texture = _a.sent();
                        /* this.sprite.cacheAsBitmap = false; */
                        this.sprite.texture = texture;
                        return [2 /*return*/];
                }
            });
        });
    };
    Background.prototype.updateTint = function () {
        /* this.sprite.cacheAsBitmap = false; */
        this.sprite.tint = helpers_1.getColor(this.map.world.settings.all.settings.theming.map.backgroundTint);
        /* this.sprite.cacheAsBitmap = true; */
    };
    Background.prototype.applyMask = function () {
        if (!this.mask) {
            this.gmask = new pixi_js_1.Graphics();
            this.gmask.beginFill(0xffffff);
            this.gmask.drawRect(0, 0, this.map.size.width, this.map.size.height);
            this.gmask.endFill();
            this.addChild(this.gmask);
            this.mask = this.gmask;
        }
    };
    Background.prototype.create = function () {
        if (!this.spriteContainer) {
            this.spriteContainer = new pixi_js_1.Container();
            this.addChild(this.spriteContainer);
        }
        if (this.sprite) {
            this.spriteContainer.removeChild(this.sprite);
            this.sprite.destroy();
        }
        this.sprite = new pixi_js_1.Sprite(this.map.world.textureGenerator.mapBackgroundImage);
        this.sprite.zIndex = 99;
        this.sprite.width = this.map.size.width + 800;
        this.sprite.height = this.map.size.height + 800;
        this.sprite.position.set(-400, -400);
        this.spriteContainer.addChild(this.sprite);
        if (!this.displacementSprite) {
            this.displacementSprite = new pixi_js_1.Sprite(this.map.world.textureGenerator.backgroundDisplacement);
            this.displacementSprite.texture.baseTexture.wrapMode = pixi_js_1.WRAP_MODES.REPEAT;
            this.displacementSprite.width = this.map.size.width;
            this.displacementSprite.height = this.map.size.height;
            this.displacementSprite.position.set(0, 0);
            /* this.displacementSprite.cacheAsBitmap = true; */
            this.spriteContainer.addChild(this.displacementSprite);
            this.spriteContainer.filters = [new pixi_js_1.filters.DisplacementFilter(this.displacementSprite)];
        }
        this.applyMask();
        this.updateTint();
    };
    Background.prototype.animateDisplacement = function () {
        var backgroundImageLiveEffectStrength = this.map.world.settings.all.settings.theming.map.backgroundImageLiveEffectStrength;
        var liveEffectEnabled = backgroundImageLiveEffectStrength !== 'Disabled';
        var strength = Number(backgroundImageLiveEffectStrength);
        // temprary
        var isLiveEffectStatic = false;
        if (liveEffectEnabled) {
            var deltaTime = PIXI.Ticker.shared.deltaTime;
            if (!this.spriteContainer.filters.length) {
                this.spriteContainer.filters = [new pixi_js_1.filters.DisplacementFilter(this.displacementSprite)];
                this.displacementSprite.visible = true;
            }
            var x = 0;
            var y = 0;
            if (isLiveEffectStatic) {
                x += strength * deltaTime;
                y += strength * deltaTime;
            }
            else {
                x = Math.round(Math.random() * strength) * deltaTime;
                y = Math.round(Math.random() * strength) * deltaTime;
            }
            this.displacementSprite.x += x;
            this.displacementSprite.y += y;
            this.displacementSprite.visible = true;
        }
        else {
            if (this.spriteContainer.filters.length) {
                this.spriteContainer.filters = [];
                this.displacementSprite.visible = false;
            }
        }
    };
    Background.prototype.renderTick = function () {
        this.viewportVisualizer.renderTick();
        this.sprite.visible = this.map.world.settings.all.settings.theming.map.backgroundImage;
        this.displacementSprite.visible = this.map.world.settings.all.settings.theming.map.backgroundImage;
        this.animateDisplacement();
    };
    return Background;
}(pixi_js_1.Container));
exports.default = Background;
