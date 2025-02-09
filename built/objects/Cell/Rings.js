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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
;
var PIXI = __importStar(require("pixi.js"));
var helpers_1 = require("../../utils/helpers");
var SettingsState_1 = __importDefault(require("../../states/SettingsState"));
var Rings = /** @class */ (function () {
    function Rings(cell) {
        this.cell = cell;
        this.INNER_RING_SPEED = 0.0028;
        this.OUTER_RING_SPEED = 0.0032;
        this.innerRing = new pixi_js_1.Sprite();
        this.innerRing.scale.set(1.0206);
        this.innerRing.zIndex = 4;
        this.innerRing.anchor.set(0.5);
        this.outerRing = new pixi_js_1.Sprite();
        this.outerRing.zIndex = 4;
        this.outerRing.anchor.set(0.5);
    }
    Rings.prototype.updateTint = function () {
        var _a = this.cell, isPlayerCell = _a.isPlayerCell, multiboxFocuesTab = _a.multiboxFocuesTab;
        var _b = this.cell.world.settings.all.settings.theming.multibox, focusedRingColor = _b.focusedRingColor, initialRingColor = _b.initialRingColor;
        var changeRingColor = this.cell.world.settings.all.settings.game.multibox.changeRingColor;
        if (isPlayerCell) {
            if (multiboxFocuesTab && changeRingColor) {
                this.innerRing.tint = this.outerRing.tint = helpers_1.getColor(focusedRingColor);
            }
            else {
                this.innerRing.tint = this.outerRing.tint = helpers_1.getColor(initialRingColor);
            }
        }
    };
    Rings.prototype.spin = function () {
        if (this.cell.world.settings.all.settings.game.cells.ringsSpinning) {
            var deltaTime = PIXI.Ticker.shared.deltaTime;
            this.outerRing.rotation += this.OUTER_RING_SPEED * deltaTime;
            this.innerRing.rotation -= this.INNER_RING_SPEED * deltaTime;
        }
    };
    Rings.prototype.setAuthorRing = function () {
        var ringsType = this.cell.world.settings.all.settings.game.cells.ringsType;
        switch (ringsType) {
            case 'Acimazis':
                this.innerRing.texture = this.cell.world.textureGenerator.innerRing;
                this.outerRing.texture = this.cell.world.textureGenerator.outerRing;
                this.outerRing.scale.set(1);
                this.innerRing.visible = this.outerRing.visible = true;
                break;
            case '2CL':
                this.outerRing.texture = this.cell.world.textureGenerator.hsloRing;
                this.outerRing.scale.set(1.149);
                this.innerRing.visible = false;
                this.outerRing.visible = true;
                break;
            case 'Yue':
                this.outerRing.texture = this.cell.world.textureGenerator.removeAnimationYue[2];
                this.outerRing.scale.set(1.149);
                this.innerRing.visible = false;
                this.outerRing.visible = true;
                break;
        }
    };
    Rings.prototype.update = function () {
        if (!SettingsState_1.default.rings) {
            this.innerRing.visible = this.outerRing.visible = false;
            return;
        }
        var ringsType = this.cell.world.settings.all.settings.game.cells.ringsType;
        var _a = this.cell, isPlayerCell = _a.isPlayerCell, isTeam = _a.isTeam;
        var enabledAndPlayer = ringsType !== 'Disabled' && isPlayerCell;
        var enabledForTeam = ringsType !== 'Disabled' && isTeam;
        var multiboxEnabled = this.cell.world.settings.all.settings.game.multibox.enabled;
        if (isPlayerCell && multiboxEnabled) {
            if (this.cell.world.settings.all.settings.game.multibox.ring) {
                if (this.cell.world.settings.all.settings.theming.multibox.ringStyle === 'Line') {
                    this.outerRing.scale.set(1);
                    this.outerRing.texture = this.cell.world.textureGenerator.multiboxLinedRing;
                    this.innerRing.visible = false;
                    this.outerRing.visible = true;
                }
                else {
                    this.setAuthorRing();
                    this.spin();
                }
            }
            else {
                this.outerRing.visible = this.innerRing.visible = false;
            }
            this.updateTint();
        }
        else if (enabledAndPlayer || enabledForTeam) {
            this.setAuthorRing();
            this.spin();
        }
        else {
            this.outerRing.visible = this.innerRing.visible = false;
        }
    };
    return Rings;
}());
exports.default = Rings;
