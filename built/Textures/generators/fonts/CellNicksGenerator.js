"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Logger_1 = __importDefault(require("../../../utils/Logger"));
var CellNicksGenerator = /** @class */ (function () {
    function CellNicksGenerator() {
        this.pool = new Map();
        this.textCreationPool = new Map();
        this.logger = new Logger_1.default('NicksGenerator');
    }
    CellNicksGenerator.prototype.has = function (nick) {
        return this.pool.has(nick);
    };
    CellNicksGenerator.prototype.get = function (nick) {
        return this.pool.get(nick);
    };
    CellNicksGenerator.prototype.set = function (nick, texture) {
        this.pool.set(nick, texture);
    };
    CellNicksGenerator.prototype.generateTexture = function (text) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var drawText = text === '__undefined__' ? '' : text;
        var font = 'bold 128px Lato';
        var lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.lineWidth = lineWidth;
        ctx.font = font;
        var width = ctx.measureText(drawText).width;
        width += lineWidth * 2;
        if (width > 2048) {
            width = 2048;
        }
        canvas.width = width;
        if (text.length <= 3) {
            canvas.height = width * 2;
        }
        else {
            canvas.height = width;
        }
        ctx.textAlign = 'center';
        ctx.font = font;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#606060';
        ctx.fillStyle = '#FFF';
        ctx.strokeText(drawText, canvas.width / 2, canvas.height / 2);
        ctx.fillText(drawText, canvas.width / 2, canvas.height / 2);
        var texture = pixi_js_1.Texture.from(canvas);
        texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.ON;
        texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
        return texture;
    };
    CellNicksGenerator.prototype.createNick = function (text, onCreateCallback) {
        var _this = this;
        // if there is already generated texture, return it
        if (this.has(text)) {
            onCreateCallback(this.get(text));
            return;
        }
        // if there is no generated texture, add text of the nickname to pool with callback
        // callback is gonna be fired right after the texture is generated
        var pool = this.textCreationPool.get(text) || [];
        pool.push(onCreateCallback);
        this.textCreationPool.set(text, pool);
        // texture creation is already in setTimeout
        if (pool.length > 1) {
            return;
        }
        // generate with delay to decrease lag spikes
        setTimeout(function () {
            var texture = _this.generateTexture(text);
            _this.set(text, texture);
            // loop over all listeners (callbacks) assigned to this text
            // pool is a link to array so no need to call get method for textCreationPool again
            pool.forEach(function (onCreate) { return onCreate(texture); });
            // remove text from pool 
            _this.textCreationPool.delete(text);
        }, (this.textCreationPool.size - 1) * 250);
    };
    CellNicksGenerator.prototype.clear = function () {
        var MAX_SAFE_SIZE = 768;
        this.logger.warning("Pool size: " + this.pool.size);
        if (this.pool.size <= MAX_SAFE_SIZE) {
            return;
        }
        this.pool.forEach(function (texture) { return texture.destroy(true); });
        this.logger.info("Max safe size reached (" + MAX_SAFE_SIZE + "). Pool size cleared: " + this.pool.size + " entries");
        this.pool.clear();
    };
    return CellNicksGenerator;
}());
exports.default = CellNicksGenerator;
