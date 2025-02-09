"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Subview = /** @class */ (function () {
    function Subview(socketCells, playerCells) {
        this.viewport = { x: 0, y: 0, scale: 0 };
        this.cursor = { x: 0, y: 0 };
        this.playerBox = { width: 0, height: 0, mass: 0 };
        this.bounds = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
        this.mapOffsets = { minX: 0, minY: 0, maxY: 0, maxX: 0, width: 0, height: 0 };
        this.mapOffsetsShift = { x: 0, y: 0 };
        this.sortRequired = false;
        this.socketCells = socketCells;
        this.playerCells = playerCells;
    }
    Subview.prototype.setMapOffsets = function (mapOffsets, mapOffsetsShift) {
        this.mapOffsets = mapOffsets;
        if (mapOffsetsShift) {
            this.mapOffsetsShift = mapOffsetsShift;
        }
    };
    Subview.prototype.calcBounds = function () {
        var cells = __spreadArray([], __read(this.socketCells.values()));
        if (!cells.length) {
            this.bounds = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
            return;
        }
        var posX = cells.slice().sort(function (cellA, cellB) { return cellA.x - cellB.x; });
        var posY = cells.slice().sort(function (cellA, cellB) { return cellA.y - cellB.y; });
        this.bounds.left = posX[0].x;
        this.bounds.right = posX[posX.length - 1].x;
        this.bounds.top = posY[0].y;
        this.bounds.bottom = posY[posY.length - 1].y;
        this.bounds.width = Math.abs(this.bounds.right - this.bounds.left);
        this.bounds.height = Math.abs(this.bounds.bottom - this.bounds.top);
    };
    Subview.prototype.hasInViewBounds = function (x, y, size) {
        var _a = this.bounds, left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
        if (left === 0 && right === 0 && top === 0 && bottom === 0) {
            return false;
        }
        size = size ? size : 0;
        var matchX = x + size >= left && x - size <= right;
        var matchY = y + size >= top && y - size <= bottom;
        return matchX && matchY;
    };
    Subview.prototype.viewportUpdate = function (viewport) {
        this.viewport = viewport;
    };
    Subview.prototype.getShiftedMapOffsets = function () {
        if (this.mapOffsetsShift.x === 0 && this.mapOffsetsShift.y === 0) {
            return this.mapOffsets;
        }
        return {
            minX: this.mapOffsets.minX + this.mapOffsetsShift.x,
            minY: this.mapOffsets.minY + this.mapOffsetsShift.y,
            maxX: this.mapOffsets.maxX + this.mapOffsetsShift.x,
            maxY: this.mapOffsets.maxY + this.mapOffsetsShift.y,
            width: Math.abs(this.mapOffsets.maxX - this.mapOffsets.minX),
            height: Math.abs(this.mapOffsets.maxY - this.mapOffsets.minY)
        };
    };
    Subview.prototype.getShiftedViewport = function () {
        if (this.mapOffsetsShift.x === 0 && this.mapOffsetsShift.y === 0) {
            return this.viewport;
        }
        return {
            x: this.viewport.x + this.mapOffsetsShift.x,
            y: this.viewport.y + this.mapOffsetsShift.y,
            scale: this.viewport.scale
        };
    };
    Subview.prototype.calcPlayingStats = function () {
        var _this = this;
        if (this.playerCells.size) {
            this.viewport.x = 0;
            this.viewport.y = 0;
            var targetSize_1 = 0;
            var size_1 = 0;
            this.playerCells.forEach(function (cell) {
                size_1 += cell.originalSize;
                targetSize_1 += cell.newOriginalSize * cell.newOriginalSize;
                _this.viewport.x += (cell.x - _this.mapOffsetsShift.x) / _this.playerCells.size;
                _this.viewport.y += (cell.y - _this.mapOffsetsShift.y) / _this.playerCells.size;
            });
            this.viewport.scale = Math.pow(Math.min(64 / size_1, 1), 0.4000);
            this.playerBox.mass = ~~(targetSize_1 / 100);
        }
    };
    return Subview;
}());
exports.default = Subview;
