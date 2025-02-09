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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var index_1 = __importDefault(require("../objects/Cell/index"));
var Virus_1 = __importDefault(require("../objects/Virus/Virus"));
var helpers_1 = require("../utils/helpers");
var RealPlayersCells = /** @class */ (function (_super) {
    __extends(RealPlayersCells, _super);
    function RealPlayersCells(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.lastRenderTime = 0;
        _this.zIndex = 900;
        _this.sortableChildren = true;
        _this.buffer = new Map();
        return _this;
    }
    RealPlayersCells.prototype.renderCells = function () {
        this.lastRenderTime = Date.now();
        var animationSpeed = this.world.animationSettingsProvider.getAnimationSpeed();
        var fadeSpeed = this.world.animationSettingsProvider.getFadeSpeed();
        var soakSpeed = this.world.animationSettingsProvider.getSoakSpeed();
        for (var i = 0; i < this.children.length; i++) {
            var obj = this.children[i];
            obj.animate(animationSpeed, fadeSpeed, soakSpeed);
            if (obj.isDestroyed) {
                this.removeChild(obj);
            }
        }
    };
    RealPlayersCells.prototype.changeVirusTexture = function () {
        var buffer = __spreadArray(__spreadArray([], __read(this.children)), [this.buffer]);
        buffer
            .filter(function (obj) { return obj.type === 'VIRUS'; })
            .forEach(function (virus) { return virus.updateTexture(); });
    };
    RealPlayersCells.prototype.changeCellShadowTexture = function () {
        var buffer = __spreadArray(__spreadArray([], __read(this.children)), [this.buffer]);
        buffer
            .filter(function (obj) { return obj.type === 'CELL'; })
            .forEach(function (cell) { return cell.changeShadowTexture(); });
    };
    RealPlayersCells.prototype.add = function (id, location, color, name, type, subtype, skin) {
        if (!this.world.settings.all.settings.game.minimap.realPlayersCells) {
            return;
        }
        if (subtype === 'FIRST_TAB' || subtype === 'SECOND_TAB') {
            return;
        }
        if (type === 'CELL') {
            var loc = helpers_1.transformMinimapLocation(location, this.world.view.firstTab.getShiftedMapOffsets(), this.world.settings);
            var cell = new index_1.default(subtype, {
                x: loc.x,
                y: loc.y,
                r: loc.r / 14142
            }, color, name, skin, this.world);
            cell.setIsVisible(true);
            cell.setIsMinimapCell(loc.r);
            this.buffer.set(id, cell);
            this.addChild(cell);
        }
        else if (type === 'VIRUS') {
            location = helpers_1.transformMinimapLocation(location, this.world.view.firstTab.getShiftedMapOffsets(), this.world.settings);
            var virus = new Virus_1.default(location, subtype, this.world);
            virus.setIsMinimap(location.r);
            this.buffer.set(id, virus);
            this.addChild(virus);
        }
    };
    RealPlayersCells.prototype.remove = function (id, removeType) {
        if (!this.world.settings.all.settings.game.minimap.realPlayersCells) {
            return;
        }
        var removeImmediately = Date.now() - this.lastRenderTime > 100;
        if (this.buffer.has(id)) {
            var obj = this.buffer.get(id);
            if (removeImmediately) {
                this.buffer.delete(id);
                this.removeChild(obj);
            }
            else {
                obj.remove(removeType);
            }
            this.buffer.delete(id);
        }
    };
    RealPlayersCells.prototype.update = function (id, location) {
        if (!this.world.settings.all.settings.game.minimap.realPlayersCells) {
            return;
        }
        if (this.buffer.has(id)) {
            var loc = helpers_1.transformMinimapLocation(location, this.world.view.firstTab.getShiftedMapOffsets(), this.world.settings);
            this.buffer.get(id).update(loc);
        }
    };
    RealPlayersCells.prototype.renderTick = function () {
        if (this.world.settings.all.settings.game.minimap.realPlayersCells) {
            this.renderCells();
        }
        else {
            if (this.children.length) {
                this.reset();
            }
        }
    };
    RealPlayersCells.prototype.reset = function () {
        this.buffer.forEach(function (obj) {
            obj.destroy({ children: true });
        });
        this.buffer.clear();
        while (this.children.length > 0) {
            this.removeChildAt(0);
        }
    };
    return RealPlayersCells;
}(pixi_js_1.Container));
exports.default = RealPlayersCells;
