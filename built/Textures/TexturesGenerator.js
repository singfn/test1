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
var pixi_js_1 = require("pixi.js");
var Borders_1 = __importDefault(require("./generators/world/Borders"));
var BordersRgb_1 = __importDefault(require("./generators/world/BordersRgb"));
var Cell_1 = __importDefault(require("./generators/world/Cell"));
var Food_1 = __importDefault(require("./generators/world/Food"));
var RemoveEffect_1 = __importDefault(require("./generators/world/RemoveEffect"));
var Virus_1 = __importDefault(require("./generators/world/Virus"));
var ViewBox_1 = __importDefault(require("./generators/world/ViewBox"));
var CellShadow_1 = __importDefault(require("./generators/world/CellShadow"));
var VirusShots_1 = __importDefault(require("./generators/world/VirusShots"));
var MultiboxRing_1 = __importDefault(require("./generators/world/MultiboxRing"));
var MyCellShadow_1 = __importDefault(require("./generators/world/MyCellShadow"));
var Logger_1 = __importDefault(require("../utils/Logger"));
var CellNicksGenerator_1 = __importDefault(require("./generators/fonts/CellNicksGenerator"));
var MassFontsGenerator_1 = __importDefault(require("./generators/fonts/MassFontsGenerator"));
var TextureGenerator = /** @class */ (function () {
    function TextureGenerator(settings) {
        this.settings = settings;
        this.removeAnimationsAcim = [];
        this.removeAnimationYue = [];
        this.logger = new Logger_1.default('TextureGenerator');
        this.cellNicksGenerator = new CellNicksGenerator_1.default();
        this.massFontsGenerator = new MassFontsGenerator_1.default();
    }
    TextureGenerator.prototype.loadImg = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.src = url;
                        img.onload = function () { return resolve(img); };
                        img.onerror = function () {
                            _this.logger.error("[GameLoader]: Reosurce not found: " + (!url ? '[EMPTY_URL]' : url) + " (skipped)");
                            resolve(new Image());
                        };
                    })];
            });
        });
    };
    TextureGenerator.prototype.generateNewTexture = function (width, height, img, isRect) {
        if (isRect === void 0) { isRect = true; }
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        if (!isRect) {
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        var texture = pixi_js_1.Texture.from(canvas);
        texture.baseTexture.scaleMode = pixi_js_1.SCALE_MODES.LINEAR;
        return texture;
    };
    TextureGenerator.prototype.loadRemoveAnimationAcim = function () {
        return __awaiter(this, void 0, void 0, function () {
            var s1, s2, s3, s4, s5, s6, s7, s8, s9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadImg('https://i.imgur.com/pbNStJi.png')];
                    case 1:
                        s1 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/sq7aL6t.png')];
                    case 2:
                        s2 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/3YzFPva.png')];
                    case 3:
                        s3 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/l6cJBC6.png')];
                    case 4:
                        s4 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/7LHFr7F.png')];
                    case 5:
                        s5 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/MmNUhC5.png')];
                    case 6:
                        s6 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/QCSiEdJ.png')];
                    case 7:
                        s7 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/IeaHa9h.png')];
                    case 8:
                        s8 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/4XdwjFG.png')];
                    case 9:
                        s9 = _a.sent();
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s1));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s2));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s3));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s4));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s5));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s6));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s7));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s8));
                        this.removeAnimationsAcim.push(this.generateNewTexture(512, 512, s9));
                        return [2 /*return*/];
                }
            });
        });
    };
    TextureGenerator.prototype.loadRemoveAnimationYue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var s1, s2, s3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadImg('https://i.imgur.com/0v90r6G.png')];
                    case 1:
                        s1 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/OZmc9LV.png')];
                    case 2:
                        s2 = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/LRtQovo.png')];
                    case 3:
                        s3 = _a.sent();
                        this.removeAnimationYue.push(this.generateNewTexture(512, 512, s1));
                        this.removeAnimationYue.push(this.generateNewTexture(512, 512, s2));
                        this.removeAnimationYue.push(this.generateNewTexture(512, 512, s3));
                        return [2 /*return*/];
                }
            });
        });
    };
    TextureGenerator.prototype.updateBackground = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mapBg, texture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadImg(this.settings.all.settings.theming.map.backgroundImageUrl)];
                    case 1:
                        mapBg = _a.sent();
                        texture = this.generateNewTexture(2048, 2048, mapBg);
                        this.removeFromCache(this.mapBackgroundImage);
                        this.mapBackgroundImage = texture;
                        return [2 /*return*/, texture];
                }
            });
        });
    };
    TextureGenerator.prototype.updateGlobalBackground = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sMapBg, texture;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadImg(this.settings.all.settings.theming.map.globalBackgroundImageUrl)];
                    case 1:
                        sMapBg = _a.sent();
                        texture = this.generateNewTexture(2048, 2048, sMapBg);
                        this.removeFromCache(this.secondBackgroundImage);
                        this.secondBackgroundImage = texture;
                        return [2 /*return*/, texture];
                }
            });
        });
    };
    TextureGenerator.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mapBg, rgbBorder, bgDispl, sMapBg, glDispl, outerRing, innerRing, hsloRing, rmAnimHslo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadImg(this.settings.all.settings.theming.map.backgroundImageUrl)];
                    case 1:
                        mapBg = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/7eDfixc.png')];
                    case 2:
                        rgbBorder = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://res.cloudinary.com/dvxikybyi/image/upload/v1486634113/2yYayZk_vqsyzx.png')];
                    case 3:
                        bgDispl = _a.sent();
                        return [4 /*yield*/, this.loadImg(this.settings.all.settings.theming.map.globalBackgroundImageUrl)];
                    case 4:
                        sMapBg = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/vtLSnyt.jpg')];
                    case 5:
                        glDispl = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/B24DABv.png')];
                    case 6:
                        outerRing = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/nr8ngwx.png')];
                    case 7:
                        innerRing = _a.sent();
                        return [4 /*yield*/, this.loadImg('https://i.imgur.com/Bx8Im3s.png')];
                    case 8:
                        hsloRing = _a.sent();
                        return [4 /*yield*/, (this.loadImg('https://i.imgur.com/ZTiEaOI.png'))];
                    case 9:
                        rmAnimHslo = _a.sent();
                        return [4 /*yield*/, this.loadRemoveAnimationAcim()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.loadRemoveAnimationYue()];
                    case 11:
                        _a.sent();
                        this.mapBackgroundImage = this.generateNewTexture(2048, 2048, mapBg);
                        this.rgbBorder = this.generateNewTexture(2048, 2048, rgbBorder);
                        this.secondBackgroundImage = this.generateNewTexture(2048, 2048, sMapBg);
                        this.globalDisplacement = this.generateNewTexture(512, 512, glDispl);
                        this.backgroundDisplacement = this.generateNewTexture(512, 512, bgDispl);
                        this.outerRing = this.generateNewTexture(512, 512, outerRing, true);
                        this.innerRing = this.generateNewTexture(512, 512, innerRing, true);
                        this.hsloRing = this.generateNewTexture(512, 512, hsloRing, true);
                        this.removeAnimationHSLO3D = this.generateNewTexture(512, 512, rmAnimHslo);
                        return [2 /*return*/];
                }
            });
        });
    };
    TextureGenerator.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var delay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.load()];
                    case 1:
                        _a.sent();
                        delay = function () { return new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, 1000 / 60); }); };
                        this.massFontsGenerator.generateLatoBitmap();
                        return [4 /*yield*/, delay()];
                    case 2:
                        _a.sent();
                        this.generateCell();
                        return [4 /*yield*/, delay()];
                    case 3:
                        _a.sent();
                        this.generateFood();
                        return [4 /*yield*/, delay()];
                    case 4:
                        _a.sent();
                        this.generateVirus();
                        return [4 /*yield*/, delay()];
                    case 5:
                        _a.sent();
                        this.generateMultiboxLinedRing();
                        return [4 /*yield*/, delay()];
                    case 6:
                        _a.sent();
                        this.generateMapBorders();
                        return [4 /*yield*/, delay()];
                    case 7:
                        _a.sent();
                        this.generateCellShadow();
                        return [4 /*yield*/, delay()];
                    case 8:
                        _a.sent();
                        this.generateRemoveEffect();
                        return [4 /*yield*/, delay()];
                    case 9:
                        _a.sent();
                        this.generateViewBox();
                        return [4 /*yield*/, delay()];
                    case 10:
                        _a.sent();
                        this.generateMyCellShadow();
                        return [4 /*yield*/, delay()];
                    case 11:
                        _a.sent();
                        this.mapBordersRgbLine = BordersRgb_1.default(this.settings);
                        return [4 /*yield*/, delay()];
                    case 12:
                        _a.sent();
                        this.virusShots = VirusShots_1.default();
                        return [4 /*yield*/, delay()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TextureGenerator.prototype.removeFromCache = function (texture) {
        if (texture) {
            texture.destroy(true);
            pixi_js_1.Texture.removeFromCache(texture);
        }
    };
    TextureGenerator.prototype.generateMultiboxLinedRing = function () {
        this.removeFromCache(this.multiboxLinedRing);
        this.multiboxLinedRing = MultiboxRing_1.default(this.settings);
    };
    TextureGenerator.prototype.generateCell = function () {
        this.removeFromCache(this.cell);
        this.cell = Cell_1.default();
    };
    TextureGenerator.prototype.generateFood = function () {
        this.removeFromCache(this.food);
        this.food = Food_1.default(this.settings);
    };
    TextureGenerator.prototype.generateVirus = function () {
        this.removeFromCache(this.virus);
        this.virus = Virus_1.default(this.settings);
    };
    TextureGenerator.prototype.generateMapBorders = function () {
        this.removeFromCache(this.mapBorders);
        this.mapBorders = Borders_1.default(this.settings);
    };
    TextureGenerator.prototype.generateRgbLine = function () {
        this.removeFromCache(this.mapBordersRgbLine);
        this.mapBordersRgbLine = BordersRgb_1.default(this.settings);
    };
    TextureGenerator.prototype.generateRemoveEffect = function () {
        this.removeFromCache(this.removeEffect);
        this.removeEffect = RemoveEffect_1.default();
    };
    TextureGenerator.prototype.generateViewBox = function () {
        this.removeFromCache(this.viewBox);
        this.viewBox = ViewBox_1.default();
    };
    TextureGenerator.prototype.generateCellShadow = function () {
        this.removeFromCache(this.cellShadow);
        this.cellShadow = CellShadow_1.default(this.settings);
    };
    TextureGenerator.prototype.generateMyCellShadow = function () {
        this.removeFromCache(this.myCellShadow);
        this.myCellShadow = MyCellShadow_1.default(this.settings);
    };
    return TextureGenerator;
}());
exports.default = TextureGenerator;
