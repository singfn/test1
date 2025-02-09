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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var Regions = /** @class */ (function () {
    function Regions(gameMode) {
        var _this = this;
        this.gameMode = gameMode;
        this.selected = 0;
        this.data = [];
        this.privateServersList = [];
        this.updatingInterval = null;
        var privateServersData = [
            'Arctida', 'Dagestan', 'Delta FFA', 'FeelForeverAlone', 'N.A. FFA', 'N.A. Party', 'Private Party', 'Rookery', 'Zimbabwe'
        ];
        privateServersData.forEach(function (name, i) {
            _this.privateServersList[i] = {
                location: name,
                playersAmount: -1
            };
        });
    }
    Regions.prototype.getName = function (region) {
        switch (region) {
            case "EU-London": return "Europe";
            case "US-Atlanta": return "North America";
            case "RU-Russia": return "Russia";
            case "BR-Brazil": return "South America";
            case "TK-Turkey": return "Turkey";
            case "JP-Tokyo": return "East Asia";
            case "CN-China": return "China";
            case "SG-Singapore": return "Oceania";
            default: return "Europe";
        }
    };
    Regions.prototype.unname = function (name) {
        switch (name) {
            case "Europe": return "EU-London";
            case "North America": return "US-Atlanta";
            case "Russia": return "RU-Russia";
            case "South America": return "BR-Brazil";
            case "Turkey": return "TK-Turkey";
            case "East Asia": return "JP-Tokyo";
            case "China": return "CN-China";
            case "Oceania": return "SG-Singapore";
            default: return name;
        }
    };
    Regions.prototype.setFetched = function (regions) {
        this.data.length = 0;
        for (var region in regions) {
            var displayedRegionName = this.getName(region);
            var numPlayers = regions[region].numPlayers;
            this.data.push({
                location: displayedRegionName,
                playersAmount: numPlayers
            });
        }
        FrontAPI_1.default.setRegions(__spreadArray(__spreadArray([], __read(this.data)), __read(this.privateServersList)));
    };
    Regions.prototype.setCurrent = function (index) {
        this.selected = index;
    };
    Regions.prototype.getCurrent = function () {
        if (this.gameMode.get() === ':private') {
            return this.unname(this.privateServersList[this.selected].location);
        }
        else {
            return this.unname(this.data[this.selected].location);
        }
    };
    Regions.prototype.setUpdatingInterval = function (callback, time) {
        if (this.updatingInterval) {
            return;
        }
        this.updatingInterval = setInterval(function () { return callback(); }, time);
    };
    Regions.prototype.clearUpdatingInterval = function () {
        clearInterval(this.updatingInterval);
        this.updatingInterval = null;
    };
    return Regions;
}());
exports.default = Regions;
