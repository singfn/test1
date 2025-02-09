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
var WorldState_1 = __importDefault(require("../../states/WorldState"));
var PIXI = __importStar(require("pixi.js"));
var CellStats = /** @class */ (function () {
    function CellStats(cell) {
        this.cell = cell;
        this.massValue = 0;
        this.shortMassValue = '0';
        var _a = cell.world.settings.all.settings.game.cells, massScale = _a.massScale, nicksScale = _a.nicksScale;
        this.mass = new pixi_js_1.BitmapText('0', {
            fontName: 'MassLato'
        });
        this.mass.scale.set(massScale);
        this.mass.zIndex = 5;
        this.mass.anchor.x = 0.5;
        this.mass.y = 64;
        this.nick = new pixi_js_1.Sprite();
        this.nick.anchor.set(0.45);
        this.nick.scale.set(nicksScale);
        this.nick.zIndex = 5;
    }
    CellStats.prototype.update = function () {
        var _a = this.cell.world.settings.all.settings.game.cells, mass = _a.mass, myMass = _a.myMass, nicks = _a.nicks, myNick = _a.myNick, autoHideMassAndNicks = _a.autoHideMassAndNicks, massScale = _a.massScale, nicksScale = _a.nicksScale;
        var mNicks = this.cell.world.settings.all.settings.game.minimap.nicks;
        var mMass = this.cell.world.settings.all.settings.game.minimap.mass;
        if (this.cell.isMinimap && this.cell.isTeam) {
            this.nick.visible = this.nick.renderable = mNicks;
            this.nick.scale.set(7);
            this.nick.y = -700;
            return;
        }
        this.nick.y = 0;
        if (this.cell.isPlayerCell) {
            this.mass.visible = this.mass.renderable = myMass;
            this.nick.visible = this.nick.renderable = myNick;
            this.mass.scale.set(massScale);
            this.nick.scale.set(nicksScale);
        }
        else {
            if (this.cell.isMinimap && this.cell.originalSize >= 15) {
                this.nick.visible = this.nick.renderable = mNicks;
                this.mass.visible = this.mass.renderable = mMass;
                this.nick.scale.set(1.33);
            }
            else if (this.cell.originalSize <= 70) {
                this.mass.visible = this.mass.renderable = false;
                this.nick.visible = this.nick.renderable = false;
            }
            else {
                var visible = autoHideMassAndNicks ? this.cell.originalSize > (27 / this.cell.world.view.camera.scale) : true;
                this.mass.visible = this.mass.renderable = visible && mass;
                this.nick.visible = this.nick.renderable = visible && nicks;
                this.nick.scale.set(nicksScale);
                this.mass.scale.set(massScale);
            }
        }
    };
    CellStats.prototype.updateTint = function (tint) {
        this.nick.tint = tint;
        this.mass.tint = tint;
    };
    CellStats.prototype.updateNick = function (nick) {
        var _this = this;
        this.cell.world.textureGenerator.cellNicksGenerator.createNick(nick, function (texture) {
            _this.nick.texture = texture;
        });
    };
    CellStats.prototype.calculateMass = function () {
        this.massValue = ~~(this.cell.originalSize * this.cell.originalSize / 100);
        this.shortMassValue = Math.round(this.massValue / 100) / 10 + 'k';
    };
    CellStats.prototype.updateMass = function (forced) {
        if (forced === void 0) { forced = false; }
        var deltaTime = PIXI.Ticker.shared.deltaTime;
        var ticks = WorldState_1.default.ticks;
        var _a = this.cell.world.settings.all.settings.game.cells, shortMass = _a.shortMass, massUpdateDelay = _a.massUpdateDelay;
        if (massUpdateDelay > 1) {
            if (~~(ticks * deltaTime) % massUpdateDelay === 1) {
                this.calculateMass();
            }
        }
        else {
            this.calculateMass();
        }
        if (forced) {
            this.calculateMass();
        }
        if (shortMass) {
            this.mass.text = this.shortMassValue;
        }
        else {
            this.mass.text = this.massValue.toString();
        }
    };
    return CellStats;
}());
exports.default = CellStats;
