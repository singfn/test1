"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Storage = /** @class */ (function () {
    function Storage() {
        this.name = 'AGARIX:DATA';
    }
    Storage.prototype.swap = function (str) {
        var left = str.slice(0, str.length / 2);
        var right = str.slice(str.length / 2);
        return right + left;
    };
    Storage.prototype.init = function () {
        var storage = localStorage.getItem(this.name);
        if (storage) {
            try {
                var swapped = this.swap(storage);
                // will throw exception if it has invalid format
                var decoded = JSON.parse(atob(swapped));
                return decoded;
            }
            catch (_a) {
                // decoding failed, valid format
                return JSON.parse(storage);
            }
        }
    };
    return Storage;
}());
exports.default = Storage;
