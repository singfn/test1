"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("../utils/Logger"));
var MasterCache = /** @class */ (function () {
    function MasterCache() {
        this.clientVersionInt = -1;
        this.clientVersionString = '';
        this.supportProtocolVersion = '';
        this.protocolVersion = -1;
        this.latestId = -1;
        this.STORAGE_NAME = 'AGARIX:MASTER_CACHE';
        this.CACHE_LIFETIME = 60 * 60 * 48 * 1000; // 48 hours
        this.logger = new Logger_1.default('MasterCache');
        var storage = JSON.parse(localStorage.getItem(this.STORAGE_NAME));
        if (storage) {
            var difference = Date.now() - storage.savedTime;
            if (difference > this.CACHE_LIFETIME) {
                return;
            }
            this.clientVersionInt = storage.clientVersionInt;
            this.clientVersionString = storage.clientVersionString;
            this.supportProtocolVersion = storage.supportProtocolVersion;
            this.protocolVersion = storage.protocolVersion;
            this.latestId = storage.latestId;
        }
    }
    MasterCache.prototype.get = function () {
        if (this.clientVersionInt === -1) {
            return null;
        }
        else {
            return {
                clientVersionInt: this.clientVersionInt,
                clientVersionString: this.clientVersionString,
                supportProtocolVersion: this.supportProtocolVersion,
                protocolVersion: this.protocolVersion,
                latestId: this.latestId
            };
        }
    };
    MasterCache.prototype.set = function (data) {
        this.clientVersionInt = data.clientVersionInt;
        this.clientVersionString = data.clientVersionString;
        this.supportProtocolVersion = data.supportProtocolVersion;
        this.protocolVersion = data.protocolVersion;
        this.latestId = data.latestId;
        var saveData = __assign(__assign({}, data), { savedTime: Date.now() });
        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(saveData));
    };
    return MasterCache;
}());
exports.default = MasterCache;
