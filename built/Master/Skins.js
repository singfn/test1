"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var AgarSkinsList = /** @class */ (function () {
    function AgarSkinsList() {
        this.list = new Map();
        this.reservedSkinsByName = new Set();
    }
    AgarSkinsList.prototype.has = function (name) {
        if (name === void 0) { name = ''; }
        return this.list.has(name.toLowerCase());
    };
    AgarSkinsList.prototype.get = function (name) {
        if (name === void 0) { name = ''; }
        return this.list.get(name.toLowerCase());
    };
    AgarSkinsList.prototype.skinsByNameHas = function (name) {
        return this.reservedSkinsByName.has(name.toLowerCase());
    };
    AgarSkinsList.prototype.parse = function (data, CFG_URL, latestId) {
        var e_1, _a, e_2, _b, e_3, _c;
        var gameConfig = JSON.parse(data).gameConfig;
        var GES = gameConfig["Gameplay - Equippable Skins"];
        var GFS = gameConfig["Gameplay - Free Skins"];
        ;
        var VPSP = gameConfig["Visual - Prod. Spine Animations"];
        this.list.clear();
        this.reservedSkinsByName.clear();
        try {
            for (var GES_1 = __values(GES), GES_1_1 = GES_1.next(); !GES_1_1.done; GES_1_1 = GES_1.next()) {
                var skin = GES_1_1.value;
                var url = CFG_URL + "/" + latestId + "/" + skin.image;
                var name_1 = skin.productId.slice(5);
                skin.url = url;
                this.list.set(name_1, skin);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (GES_1_1 && !GES_1_1.done && (_a = GES_1.return)) _a.call(GES_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var VPSP_1 = __values(VPSP), VPSP_1_1 = VPSP_1.next(); !VPSP_1_1.done; VPSP_1_1 = VPSP_1.next()) {
                var skin = VPSP_1_1.value;
                var url = CFG_URL + "/" + latestId + "/" + skin.spineFileName + ".png";
                var name_2 = skin.productId.slice(5);
                skin.url = url;
                this.list.set(name_2, skin);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (VPSP_1_1 && !VPSP_1_1.done && (_b = VPSP_1.return)) _b.call(VPSP_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var GFS_1 = __values(GFS), GFS_1_1 = GFS_1.next(); !GFS_1_1.done; GFS_1_1 = GFS_1.next()) {
                var skin = GFS_1_1.value;
                var url = CFG_URL + "/" + latestId + "/" + skin.image;
                var name_3 = skin.id.toLowerCase();
                skin.url = url;
                this.list.set(name_3, skin);
                this.reservedSkinsByName.add(name_3);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (GFS_1_1 && !GFS_1_1.done && (_c = GFS_1.return)) _c.call(GFS_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    return AgarSkinsList;
}());
exports.default = AgarSkinsList;
