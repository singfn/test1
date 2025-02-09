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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Stats_1 = __importDefault(require("./Stats"));
var Rings_1 = __importDefault(require("./Rings"));
var Shadow_1 = __importDefault(require("./Shadow"));
var CellSprite_1 = __importDefault(require("./CellSprite"));
var helpers_1 = require("../../utils/helpers");
var SettingsState_1 = __importDefault(require("../../states/SettingsState"));
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(subtype, location, color, nick, skin, world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.originalSize = 0;
        _this.newOriginalSize = 0;
        _this.isPlayerCell = false;
        _this.isTeam = false;
        _this.isDestroyed = false;
        _this.newLocation = { x: 0, y: 0, r: 0 };
        _this.removing = false;
        _this.colorHex = [];
        _this.sizeBeforeRemove = 0;
        _this.multiboxFocuesTab = false;
        _this.isMinimap = false;
        _this.culled = false;
        _this.eatenBy = { x: 0, y: 0 };
        _this.distBeforeRemove = -1;
        _this.cell = new CellSprite_1.default(world);
        _this.shadow = new Shadow_1.default(_this.cell, _this);
        _this.stats = new Stats_1.default(_this);
        _this.rings = new Rings_1.default(_this);
        _this.addChild(_this.cell);
        _this.addChild(_this.shadow.sprite);
        _this.cell.addChild(_this.rings.innerRing, _this.rings.outerRing);
        _this.cell.addChild(_this.stats.nick, _this.stats.mass);
        var x = location.x, y = location.y, r = location.r;
        _this.zIndex = r * 2;
        _this.x = x;
        _this.y = y;
        _this.transform.position.set(x, y);
        _this.nick = nick;
        _this.color = color;
        _this.originalSize = _this.newOriginalSize = r;
        _this.subtype = subtype;
        _this.type = 'CELL';
        _this.agarSkinName = skin;
        _this.world = world;
        _this.sortableChildren = true;
        _this.isVisible = false;
        _this.renderable = false;
        _this.isPlayerCell = false;
        _this.isTeam = false;
        _this.isDestroyed = false;
        _this.newLocation = location;
        _this.removing = false;
        _this.colorHex = [];
        _this.sizeBeforeRemove = 0;
        _this.multiboxFocuesTab = false;
        _this.isMinimap = false;
        _this.culled = false;
        _this.agarSkinTexture = null;
        _this.skinByNameTexture = null;
        _this.eatenBy = { x: 0, y: 0 };
        _this.distBeforeRemove = -1;
        _this.cell.transform.scale.set(1, 1);
        _this.cell.scale.set(1, 1);
        _this.cell.alpha = 0;
        _this.shadow.sprite.alpha = 0;
        _this.getSkins();
        _this.addColorInformation(color);
        _this.applyTint();
        _this.update(location);
        _this.stats.updateMass(true);
        _this.stats.updateNick(nick);
        _this.cell.setSize(r * 2);
        _this.newOriginalSize = r;
        _this.shadow.setSize(_this.cell.width);
        return _this;
    }
    Cell.prototype.getSkins = function () {
        var _this = this;
        if (this.isMinimap) {
            return;
        }
        this.usesSkinByAgarName = this.world.scene.master.skins.skinsByNameHas(this.nick);
        this.world.skinsLoader.getAgarSkinByPlayerNick(this.nick, function (skinTexture) {
            _this.skinByNameTexture = skinTexture;
        });
        this.world.skinsLoader.getAgarSkinBySkinName(this.agarSkinName, function (texture) {
            _this.agarSkinTexture = texture;
        });
    };
    Cell.prototype.addColorInformation = function (color) {
        var red = color.red, green = color.green, blue = color.blue;
        var originalColor = helpers_1.rgbToStringHex({ red: red, green: green, blue: blue });
        var modifiedColor = helpers_1.rgbToStringHex({
            red: ~~(red * 0.9),
            green: ~~(green * 0.9),
            blue: ~~(blue * 0.9)
        });
        this.colorHex.push(originalColor, modifiedColor);
    };
    Cell.prototype.changeShadowTexture = function () {
        this.shadow.updateTexture();
    };
    Cell.prototype.setIsMinimapCell = function (size) {
        this.isMinimap = true;
        this.renderable = true;
        this.setIsVisible(true);
        this.updateAlpha(1, true);
        this.shadow.sprite.visible = false;
        this.shadow.sprite.renderable = false;
        this.stats.nick.visible = false;
        this.stats.nick.renderable = false;
        this.stats.mass.visible = false;
        this.stats.mass.renderable = false;
        this.customSkinTexture = null;
        this.agarSkinTexture = null;
        // this.cell.setSize(size);
    };
    Cell.prototype.setIsFoucsedTab = function (value) {
        this.multiboxFocuesTab = value;
    };
    Cell.prototype.setIsVisible = function (value) {
        this.isVisible = value;
    };
    Cell.prototype.updateAlpha = function (a, set) {
        if (set === void 0) { set = false; }
        if (set) {
            this.cell.alpha = a;
            this.shadow.sprite.alpha = a;
            this.rings.innerRing.alpha = a;
            this.rings.outerRing.alpha = a;
        }
        else {
            this.cell.alpha += a;
            this.shadow.sprite.alpha += a;
            this.rings.innerRing.alpha += a;
            this.rings.outerRing.alpha += a;
        }
        if (this.cell.alpha < 0 || this.shadow.sprite.alpha < 0 || this.rings.innerRing.alpha < 0) {
            this.cell.alpha = 0;
            this.rings.innerRing.alpha = 0;
            this.rings.outerRing.alpha = 0;
        }
        if (this.cell.alpha > 1 || this.shadow.sprite.alpha > 1 || this.rings.innerRing.alpha > 1) {
            this.shadow.sprite.alpha = 1;
            this.cell.alpha = 1;
            this.rings.innerRing.alpha = 1;
            this.rings.outerRing.alpha = 1;
        }
    };
    Cell.prototype.setPlayerCell = function (nick, textureUrl) {
        var _this = this;
        if (!this.isPlayerCell) {
            this.updateAlpha(0.4, true); // initial player cell alpha
        }
        this.isPlayerCell = true;
        this.nick = nick && nick.trim();
        this.stats.updateNick(nick);
        this.shadow.updateTexture();
        this.usesSkinByAgarName = this.world.scene.master.skins.skinsByNameHas(this.nick);
        this.world.skinsLoader.getCustomSkin(textureUrl, function (texture) {
            _this.customSkinTexture = texture;
        });
    };
    Cell.prototype.applyTint = function () {
        var _a = this.world.scene.settings.all.settings.theming.cells, shadowColor = _a.shadowColor, myShadowColor = _a.myShadowColor, oneColoredStatsColor = _a.oneColoredStatsColor, oneColoredColor = _a.oneColoredColor, colorLighten = _a.colorLighten, adaptiveShadow = _a.adaptiveShadow;
        var oneColored = this.world.scene.settings.all.settings.game.cells.oneColored;
        if (this.isPlayerCell) {
            var _b = this.world.scene.settings.all.settings.theming.multibox, initialStaticCellColor = _b.initialStaticCellColor, focusedStaticCellColor = _b.focusedStaticCellColor;
            var _c = this.world.scene.settings.all.settings.game.multibox, changeCellColor = _c.changeCellColor, staticColor = _c.staticColor;
            if (this.world.scene.settings.all.settings.game.multibox.enabled) {
                if (staticColor) {
                    this.cell.tint = helpers_1.getColor(initialStaticCellColor);
                    this.shadow.sprite.tint = this.cell.tint;
                }
                else {
                    this.cell.tint = helpers_1.getColorLighten(colorLighten, this.color);
                    this.shadow.sprite.tint = this.cell.tint;
                }
                if (changeCellColor) {
                    if (this.multiboxFocuesTab) {
                        this.cell.tint = helpers_1.getColor(focusedStaticCellColor);
                        this.shadow.sprite.tint = this.cell.tint;
                    }
                }
                else if (staticColor) {
                    this.cell.tint = helpers_1.getColor(initialStaticCellColor);
                    this.shadow.sprite.tint = this.cell.tint;
                }
                else {
                    this.cell.tint = helpers_1.getColorLighten(colorLighten, this.color);
                    this.shadow.sprite.tint = this.cell.tint;
                }
            }
            else {
                if (this.usingSkin) {
                    this.cell.tint = 0xFFFFFF;
                }
                else {
                    this.cell.tint = helpers_1.getColorLighten(colorLighten, this.color);
                }
                if (adaptiveShadow) {
                    this.shadow.sprite.tint = helpers_1.getColorLighten(colorLighten, this.color);
                }
                else {
                    this.shadow.sprite.tint = helpers_1.getColor(myShadowColor);
                }
            }
            return;
        }
        if (this.usingSkin) {
            this.cell.tint = 0xFFFFFF;
            this.stats.updateTint(0xFFFFFF);
            if (adaptiveShadow) {
                this.shadow.sprite.tint = helpers_1.getColorLighten(colorLighten, this.color);
            }
            else {
                this.shadow.sprite.tint = helpers_1.getColor(shadowColor);
            }
        }
        else {
            if (oneColored) {
                this.cell.tint = helpers_1.getColor(oneColoredColor);
                this.stats.updateTint(helpers_1.getColor(oneColoredStatsColor));
                this.shadow.sprite.tint = helpers_1.getColor(shadowColor);
            }
            else {
                this.cell.tint = helpers_1.getColorLighten(colorLighten, this.color);
                this.stats.updateTint(0xFFFFFF);
                if (adaptiveShadow) {
                    this.shadow.sprite.tint = this.cell.tint;
                }
                else {
                    this.shadow.sprite.tint = helpers_1.getColor(shadowColor);
                }
            }
        }
    };
    Cell.prototype.updateSkinsVisibility = function () {
        var skinsType = this.world.scene.settings.all.settings.game.cells.skinsType;
        if (SettingsState_1.default.allowSkins) {
            if (this.world.scene.settings.all.settings.game.multibox.enabled && this.world.scene.settings.all.settings.game.multibox.hideOwnSkins && this.isPlayerCell) {
                this.cell.texture = this.world.textureGenerator.cell;
                this.usingSkin = false;
                return;
            }
            var teamAndCustomSkin = this.isTeam && !!this.customSkinTexture;
            var playerAndCustomSkin = this.isPlayerCell && !!this.customSkinTexture;
            var usesSkinByAgarName = this.usesSkinByAgarName && !!this.skinByNameTexture;
            var allowCustomSkins = skinsType === 'Custom' || skinsType === 'All';
            if ((teamAndCustomSkin || playerAndCustomSkin) && allowCustomSkins) {
                this.cell.texture = this.customSkinTexture.texture;
                this.usingSkin = true;
            }
            else {
                if (usesSkinByAgarName && (skinsType === 'Vanilla' || skinsType === 'All')) {
                    this.cell.texture = this.skinByNameTexture.texture;
                    this.usingSkin = true;
                }
                else if (this.agarSkinTexture && (skinsType === 'Vanilla' || skinsType === 'All')) {
                    this.cell.texture = this.agarSkinTexture.texture;
                    this.usingSkin = true;
                }
                else {
                    this.cell.texture = this.world.textureGenerator.cell;
                    this.usingSkin = false;
                }
            }
        }
        else {
            this.cell.texture = this.world.textureGenerator.cell;
            this.usingSkin = false;
        }
        this.agarSkinTexture && this.agarSkinTexture.update();
        this.skinByNameTexture && this.skinByNameTexture.update();
        this.customSkinTexture && this.customSkinTexture.update();
    };
    Cell.prototype.updateInfo = function () {
        this.updateSkinsVisibility();
        this.applyTint();
        this.stats.updateMass();
        this.rings.update();
        this.shadow.update();
        this.stats.update();
    };
    Cell.prototype.setIsTeam = function (isTeam, skinUrl) {
        var _this = this;
        if (isTeam) {
            this.isTeam = true;
            this.world.skinsLoader.getCustomSkin(skinUrl, function (texture) {
                _this.customSkinTexture = texture;
            });
        }
        else if (this.isTeam) {
            this.cell.texture = this.world.textureGenerator.cell;
            this.isTeam = false;
        }
    };
    Cell.prototype.update = function (location) {
        this.newLocation.x = location.x;
        this.newLocation.y = location.y;
        this.newLocation.r = location.r * 2;
        this.newOriginalSize = location.r;
    };
    Cell.prototype.remove = function (type, eatenBy) {
        this.removing = true;
        this.removeType = type;
        this.sizeBeforeRemove = this.cell.width;
        this.zIndex = 0;
        if (eatenBy) {
            this.eatenBy = {
                x: eatenBy.x,
                y: eatenBy.y
            };
            this.distBeforeRemove = this.calcDistBetweenEatenAndCurrent();
        }
    };
    Cell.prototype.calcDistBetweenEatenAndCurrent = function () {
        var distX = Math.pow(this.eatenBy.x - this.x, 2);
        var distY = Math.pow(this.eatenBy.y - this.y, 2);
        return Math.sqrt(distX + distY);
    };
    Cell.prototype.animateOutOfView = function (fadeSpeed) {
        if (this.cell.alpha <= 0 || fadeSpeed === 0) {
            this.isDestroyed = true;
        }
        else {
            this.updateAlpha(-fadeSpeed);
        }
    };
    Cell.prototype.animateEaten = function (animationSpeed, fadeSpeed, soakSpeed) {
        if (!this.isVisible) {
            this.isDestroyed = true;
            return;
        }
        if (soakSpeed !== 0) {
            var apf = this.isMinimap ? (animationSpeed / 5) : soakSpeed;
            var newSize = -(this.width * apf);
            if (this.world.scene.settings.all.settings.game.cells.soakToEaten) {
                var x = (this.eatenBy.x - this.x) * (animationSpeed / 5);
                var y = (this.eatenBy.y - this.y) * (animationSpeed / 5);
                this.x += x;
                this.y += y;
                newSize /= 1.5;
            }
            this.cell.width += newSize;
            this.cell.height += newSize;
            this.shadow.sprite.width += newSize * this.shadow.TEXTURE_OFFSET;
            this.shadow.sprite.height += newSize * this.shadow.TEXTURE_OFFSET;
            var transparency = this.world.scene.settings.all.settings.theming.cells.transparency;
            var newTransparency = this.cell.width / this.sizeBeforeRemove;
            if (transparency > newTransparency) {
                this.updateAlpha(this.cell.width / this.sizeBeforeRemove);
            }
            if (this.width <= 20) {
                this.isDestroyed = true;
            }
        }
        else {
            if (fadeSpeed === 0) {
                this.isDestroyed = true;
                return;
            }
            if (this.cell.alpha > 0) {
                this.updateAlpha(-fadeSpeed);
            }
            else {
                this.isDestroyed = true;
            }
        }
    };
    Cell.prototype.forceAnimateSet = function (location) {
        var x = location.x, y = location.y, r = location.r;
        this.x = x;
        this.y = y;
        this.cell.width = r;
        this.cell.height = r;
        this.zIndex = r;
        this.shadow.sprite.width = r * this.shadow.TEXTURE_OFFSET;
        this.shadow.sprite.height = r * this.shadow.TEXTURE_OFFSET;
    };
    Cell.prototype.animateMove = function (animationSpeed, fadeSpeed) {
        var transparency = this.world.scene.settings.all.settings.theming.cells.transparency;
        var mtv = (this.isMinimap && this.isTeam) ? 0.1 : 1;
        var x = (this.newLocation.x - this.x) * animationSpeed * mtv;
        var y = (this.newLocation.y - this.y) * animationSpeed * mtv;
        var r = (this.newLocation.r - this.cell.width) * animationSpeed * mtv;
        this.cell.width += r;
        this.cell.height += r;
        this.zIndex = this.originalSize;
        this.x += x;
        this.y += y;
        this.shadow.sprite.width += r * this.shadow.TEXTURE_OFFSET;
        this.shadow.sprite.height += r * this.shadow.TEXTURE_OFFSET;
        if (!this.isVisible) {
            if (this.cell.alpha > 0 && fadeSpeed !== 0) {
                this.updateAlpha(-fadeSpeed);
            }
            else {
                this.updateAlpha(0, true);
                this.visible = false;
                this.renderable = false;
            }
        }
        else {
            this.visible = true;
            this.renderable = true;
            if (this.cell.alpha < transparency && fadeSpeed !== 0) {
                this.updateAlpha(fadeSpeed);
            }
            else {
                this.updateAlpha(transparency, true);
            }
        }
    };
    Cell.prototype.animate = function (animationSpeed, fadeSpeed, soakSpeed) {
        this.originalSize += (this.newOriginalSize - this.originalSize) * animationSpeed;
        this.updateInfo();
        if (this.removing) {
            // fix
            if (this.culled) {
                this.isDestroyed = true;
                return;
            }
            if (this.removeType === 'REMOVE_CELL_OUT_OF_VIEW') {
                this.animateOutOfView(fadeSpeed);
            }
            else if (this.removeType === 'REMOVE_EATEN_CELL') {
                this.animateEaten(animationSpeed, fadeSpeed, soakSpeed);
            }
        }
        else {
            if (this.culled) {
                this.visible = false;
                this.renderable = false;
                this.x = this.newLocation.x;
                this.y = this.newLocation.y;
                this.cell.width = this.cell.height = this.newLocation.r;
                this.shadow.sprite.width = this.shadow.sprite.height = this.shadow.TEXTURE_OFFSET * this.newLocation.r;
            }
            else {
                this.animateMove(animationSpeed, fadeSpeed);
            }
        }
    };
    return Cell;
}(pixi_js_1.Container));
exports.default = Cell;
