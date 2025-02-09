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
var Borders_1 = __importDefault(require("./Borders"));
var Background_1 = __importDefault(require("./Background"));
var GlobalBackground_1 = __importDefault(require("./GlobalBackground"));
var Logger_1 = __importDefault(require("../../utils/Logger"));
var GameMap = /** @class */ (function (_super) {
    __extends(GameMap, _super);
    function GameMap(world) {
        var _this = _super.call(this) || this;
        _this.world = world;
        _this.size = { width: 14142, height: 14142 };
        _this.eventListeners = new Map();
        _this.logger = new Logger_1.default('Map');
        _this.borders = new Borders_1.default(_this);
        _this.background = new Background_1.default(_this);
        _this.globalBackground = new GlobalBackground_1.default(_this);
        _this.addChild(_this.globalBackground, _this.background, _this.borders);
        return _this;
    }
    GameMap.prototype.renderTick = function () {
        this.borders.renderTick();
        this.background.renderTick();
        this.globalBackground.renderTick();
    };
    GameMap.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };
    GameMap.prototype.setSize = function (width, height) {
        if (~~this.width === ~~this.size.width && ~~this.height === ~~this.size.height) {
            return;
        }
        this.size.width = width;
        this.size.height = height;
        this.emitEvent('sizechange');
        // this.logger.info(`Size set - width: ${width}, height: ${height}`);
    };
    GameMap.prototype.listen = function (event, action) {
        var listeners = this.eventListeners.get(event) || [];
        listeners.push(action);
        this.eventListeners.set(event, listeners);
        // this.logger.info(`Event: ${event}, action: ${typeof action}`);
    };
    GameMap.prototype.emitEvent = function (event) {
        var events = this.eventListeners.get(event);
        if (events) {
            events.forEach(function (action) { return action(); });
            // this.logger.info(`Event emitted: ${event}, listeners: ${events.length}`);
        }
    };
    return GameMap;
}(pixi_js_1.Container));
exports.default = GameMap;
