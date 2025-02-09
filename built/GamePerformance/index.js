"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FPSCounter = /** @class */ (function () {
    function FPSCounter() {
        this.decimalPlaces = 2;
        this.updateEachSecond = 1;
        this.decimalPlacesRatio = Math.pow(10, this.decimalPlaces);
        this.timeMeasurements = [];
        this.fps = 0;
    }
    FPSCounter.prototype.tick = function () {
        this.timeMeasurements.push(performance.now());
        var msPassed = this.timeMeasurements[this.timeMeasurements.length - 1] - this.timeMeasurements[0];
        if (msPassed >= this.updateEachSecond * 1000) {
            this.fps = Math.round(this.timeMeasurements.length / msPassed * 1000 * this.decimalPlacesRatio) / this.decimalPlacesRatio;
            this.timeMeasurements = [];
        }
    };
    return FPSCounter;
}());
exports.default = new /** @class */ (function () {
    function GamePerformance() {
        this.DEFAULT_SERVER_RENDER_TIME = 25;
        this.loss = 0;
        this.FPSCounter = new FPSCounter();
        this.update();
    }
    GamePerformance.prototype.updateLoss = function () {
        this.loss++;
    };
    GamePerformance.prototype.getLoss = function () {
        var value = (100 - this.loss / this.DEFAULT_SERVER_RENDER_TIME * 100) * 1.5;
        value = value > 100 ? 100 : value;
        this.loss = 0;
        return +value.toFixed(0);
    };
    GamePerformance.prototype.update = function () {
        var _this = this;
        setInterval(function () {
            var _a;
            var fps = Math.round(_this.FPSCounter.fps);
            var loss = _this.getLoss();
            (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.updateStats(fps > 0 ? fps : 0, loss > 0 ? loss : 0);
        }, 1000);
    };
    return GamePerformance;
}());
