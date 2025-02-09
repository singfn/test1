"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinTexture = void 0;
var pixi_js_1 = require("pixi.js");
var Logger_1 = __importDefault(require("./Logger"));
var SkinTexture = /** @class */ (function () {
    function SkinTexture(texture, url) {
        this.texture = texture;
        this.url = url;
        this.lastUsedTime = Date.now();
    }
    SkinTexture.prototype.update = function () {
        this.lastUsedTime = Date.now();
    };
    Object.defineProperty(SkinTexture.prototype, "canBeDestroyed", {
        get: function () {
            return ((Date.now() - this.lastUsedTime) / 1000) > 3 * 90; // 1.5 minutes
        },
        enumerable: false,
        configurable: true
    });
    SkinTexture.prototype.destroy = function () {
        this.texture.destroy(true);
    };
    return SkinTexture;
}());
exports.SkinTexture = SkinTexture;
var SkinsLoader = /** @class */ (function () {
    function SkinsLoader(world) {
        var _this = this;
        this.world = world;
        // actual skins cache
        this.cache = new Map();
        // used to store onload skin callbacks for multiple request of same skin 
        this.requestPool = new Map();
        // urls which failed to load. Used to ignore and prevent loading cycle
        this.failedToLoadUrls = new Set();
        this.logger = new Logger_1.default('SkinsLoader');
        window.SkinsLoader = this;
        setInterval(function () { return _this.cleaner(); }, 60000);
    }
    SkinsLoader.prototype.cleaner = function () {
        var _this = this;
        this.cache.forEach(function (skinTexture, url) {
            if (skinTexture.canBeDestroyed) {
                skinTexture.destroy();
                _this.cache.delete(url);
            }
        });
    };
    SkinsLoader.prototype.blobToTexture = function (blob) {
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function () {
                canvas.width = canvas.height = 512;
                if (img.width === 1024 && img.height === 512) {
                    // agar level skins are splitted by two parts (horizontal) of two 512x512 images
                    // so draw just left part of it
                    ctx.drawImage(img, 0, 0, 512, 512, 0, 0, 512, 512);
                }
                else {
                    ctx.drawImage(img, 0, 0, 512, 512);
                }
                ctx.globalCompositeOperation = 'destination-in';
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.beginPath();
                ctx.arc(256, 256, 256, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                var texture = pixi_js_1.Texture.from(canvas);
                texture.update();
                texture.baseTexture.mipmap = pixi_js_1.MIPMAP_MODES.ON;
                texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
                // return drawn image as texture
                resolve(texture);
            };
            img.onerror = function () { return reject(); };
            img.src = URL.createObjectURL(blob);
        });
    };
    SkinsLoader.prototype.getSkinTexture = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // load skin data by url
                    return [4 /*yield*/, fetch(url).then(function (response) { return response.blob(); }).then(function (blob) {
                            // transform loaded skin data to texture
                            _this.blobToTexture(blob).then(function (texture) {
                                resolve(new SkinTexture(texture, url));
                            }).catch(function (reason) {
                                _this.logger.error('Error while creating texture blob');
                                reject();
                            });
                        }).catch(function (reason) {
                            _this.logger.error("Error while fetching skin url " + url);
                            reject();
                        })];
                    case 1:
                        // load skin data by url
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SkinsLoader.prototype.checkUrlAndCache = function (url, onLoad) {
        if (url === '') {
            onLoad(null);
            return true;
        }
        if (this.failedToLoadUrls.has(url)) {
            onLoad(null);
            return true;
        }
        if (this.cache.has(url)) {
            onLoad(this.cache.get(url));
            return true;
        }
        return false;
    };
    SkinsLoader.prototype.startSkinGeneration = function (url, onLoad) {
        var _this = this;
        // there is no skin in cache. A new texture has to be generated
        var pool = this.requestPool.get(url) || [];
        pool.push(onLoad);
        this.requestPool.set(url, pool);
        // texture generation is already fired 
        if (pool.length > 1) {
            return;
        }
        // generate with delay to avoid lag spikes (freezes if image is cached)
        setTimeout(function () {
            _this.getSkinTexture(url).then(function (skinTexture) {
                _this.cache.set(url, skinTexture);
                // fire all onLoad callbacks which were assigned to this texture load
                pool.forEach(function (onLoad) { return onLoad(skinTexture); });
                // clean up
                _this.requestPool.delete(url);
            }).catch(function () {
                // error to load this url. Add to blacklist
                _this.failedToLoadUrls.add(url);
                pool.forEach(function (onLoad) { return onLoad(null); });
            });
        }, (this.requestPool.size - 1) * 100);
    };
    SkinsLoader.prototype.getCustomSkin = function (url, onLoad) {
        if (this.checkUrlAndCache(url, onLoad)) {
            return;
        }
        this.startSkinGeneration(url, onLoad);
    };
    SkinsLoader.prototype.getAgarSkinByPlayerNick = function (nick, onLoad) {
        var skinData = this.world.master.skins.get(nick);
        var url = '';
        if (!skinData) {
            onLoad(null);
            return;
        }
        url = skinData.url;
        if (this.checkUrlAndCache(url, onLoad)) {
            return;
        }
        this.startSkinGeneration(url, onLoad);
    };
    SkinsLoader.prototype.getAgarSkinBySkinName = function (skinName, onLoad) {
        var url = '';
        if (!skinName) {
            return;
        }
        if (skinName.includes('custom')) {
            url = "" + this.world.master.envConfig.CUSTOM_SKINS_URL + skinName + ".png";
        }
        else {
            try {
                url = this.world.master.skins.get(skinName).url;
            }
            catch (e) {
                if (url.includes('skin_')) {
                    url = url.split('_')[1];
                }
            }
        }
        if (this.checkUrlAndCache(url, onLoad)) {
            return;
        }
        this.startSkinGeneration(url, onLoad);
    };
    SkinsLoader.prototype.clear = function () {
        if (this.cache.size > 384) {
            this.logger.warning("Pool limit reached. Cleared " + this.cache.size + " items");
            this.cache.forEach(function (skinTexture) {
                skinTexture.destroy();
            });
            this.cache.clear();
            this.requestPool.clear();
            this.failedToLoadUrls.clear();
        }
        else {
            this.logger.warning("Pool size: " + this.cache.size + ". In request: " + this.requestPool.size);
        }
    };
    return SkinsLoader;
}());
exports.default = SkinsLoader;
