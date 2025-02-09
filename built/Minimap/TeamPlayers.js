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
var index_1 = __importDefault(require("../objects/Cell/index"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var helpers_1 = require("../utils/helpers");
var TeamPlayers = /** @class */ (function (_super) {
    __extends(TeamPlayers, _super);
    function TeamPlayers(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.zIndex = 0;
        _this.buffer = new Map();
        return _this;
    }
    TeamPlayers.prototype.changeCellShadowTexture = function () {
        this.buffer.forEach(function (cell) { return cell.changeShadowTexture(); });
    };
    TeamPlayers.prototype.reset = function () {
        this.buffer.clear();
        while (this.children.length > 0) {
            this.removeChildAt(0);
        }
    };
    TeamPlayers.prototype.renderTick = function () {
        var _this = this;
        var playerSize = this.world.settings.all.settings.theming.minimap.playerSize;
        var animationSpeed = this.world.animationSettingsProvider.getAnimationSpeed();
        var fadeSpeed = this.world.animationSettingsProvider.getFadeSpeed();
        var soakSpeed = this.world.animationSettingsProvider.getSoakSpeed();
        this.world.ogar.firstTab.team.forEach(function (player) {
            if (_this.buffer.has(player.id)) {
                var cell = _this.buffer.get(player.id);
                var location_1 = helpers_1.transformMinimapLocation({
                    x: player.position.x,
                    y: player.position.y,
                    r: 0
                }, _this.world.view.firstTab.getShiftedMapOffsets(), _this.world.settings, true);
                cell.update({ x: location_1.x, y: location_1.y, r: playerSize / 2 });
                if (!player.alive) {
                    _this.removeChild(cell);
                    _this.buffer.delete(player.id);
                }
                else {
                    cell.animate(animationSpeed, fadeSpeed, soakSpeed);
                }
            }
            else {
                if (!player.alive) {
                    return;
                }
                if (player.nick === _this.world.settings.all.profiles.rightProfileNick && PlayerState_1.default.second.playing) {
                    return;
                }
                var location_2 = helpers_1.transformMinimapLocation({
                    x: player.position.x,
                    y: player.position.y,
                    r: 0
                }, _this.world.view.firstTab.getShiftedMapOffsets(), _this.world.settings, true);
                var cell = new index_1.default('FIRST_TAB', location_2, { red: 0, green: 0, blue: 0 }, player.nick, '', _this.world);
                cell.setIsMinimapCell(playerSize / 4);
                cell.isTeam = true;
                cell.update({ x: location_2.x, y: location_2.y, r: playerSize / 2 });
                cell.cell.tint = pixi_js_1.utils.string2hex(player.color.cell);
                _this.buffer.set(player.id, cell);
                _this.addChild(cell);
            }
        });
        this.buffer.forEach(function (cell, key) {
            if (!_this.world.ogar.firstTab.team.has(key)) {
                _this.removeChild(cell);
                _this.buffer.delete(key);
            }
        });
    };
    return TeamPlayers;
}(pixi_js_1.Container));
exports.default = TeamPlayers;
