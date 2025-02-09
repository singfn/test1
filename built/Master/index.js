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
var Regions_1 = __importDefault(require("./Regions"));
var EnvConfig_1 = __importDefault(require("./EnvConfig"));
var GameMode_1 = __importDefault(require("./GameMode"));
var Skins_1 = __importDefault(require("./Skins"));
var FacebookLogin_1 = __importDefault(require("../tabs/Login/FacebookLogin"));
var GoogleLogin_1 = __importDefault(require("../tabs/Login/GoogleLogin"));
var MasterCache_1 = __importDefault(require("./MasterCache"));
var Master = /** @class */ (function () {
    function Master(settings) {
        this.settings = settings;
        this.AGAR_CORE = "https://agar.io/agario.core.js";
        this.MC_CORE = "https://agar.io/mc/agario.js";
        this.clientVersionInt = -1;
        this.clientVersionString = '';
        this.supportProtocolVersion = '';
        this.protocolVersion = -1;
        this.latestId = 0;
        this.envConfig = new EnvConfig_1.default();
        this.gameMode = new GameMode_1.default();
        this.regions = new Regions_1.default(this.gameMode);
        this.skins = new Skins_1.default();
        this.cache = new MasterCache_1.default();
        this.gameMode.set(settings.all.game.mode);
        this.regions.setCurrent(settings.all.game.currentServerIndex);
    }
    Master.prototype.send = function (url, payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: {
                                "Accept": "text/plain, */*, q=0.01",
                                "Content-Type": "application/octet-stream",
                                "x-support-proto-version": String(this.supportProtocolVersion),
                                "x-client-version": String(this.clientVersionInt),
                            },
                            body: payload
                        }).then(function (res) { return res.json(); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Master.prototype.fetch = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(url, {
                        method: "GET",
                        headers: {
                            'Cache-Control': 'no-cache',
                        }
                    })];
            });
        });
    };
    Master.prototype.xhr = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                                resolve(xhr.responseText);
                            }
                        };
                        xhr.send();
                    })];
            });
        });
    };
    Master.prototype.getTokenIp = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var GET_TOKEN_URL, region, arr, i, i;
            return __generator(this, function (_a) {
                GET_TOKEN_URL = this.envConfig.GET_TOKEN_URL;
                region = this.regions.getCurrent();
                arr = new Array(10, 4 + region.length, 10, region.length);
                arr[4 + region.length] = 18;
                arr[5 + region.length] = 0;
                arr[6 + region.length] = 26;
                arr[7 + region.length] = 8;
                arr[8 + region.length] = 10;
                arr[9 + region.length] = token.length;
                for (i = 0; i < region.length; i++) {
                    arr[4 + i] = region.charCodeAt(i);
                }
                for (i = 0; i < token.length; i++) {
                    arr[10 + region.length + i] = token.charCodeAt(i);
                }
                return [2 /*return*/, this.send(GET_TOKEN_URL, new Uint8Array(arr))];
            });
        });
    };
    Master.prototype.getRegionsInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send(this.envConfig.REGIONS_INFO_URL, null)];
                    case 1:
                        regions = (_a.sent()).regions;
                        this.regions.setFetched(regions);
                        this.regions.setUpdatingInterval(function () { return _this.getRegionsInfo(); }, 2.5 * 60000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Master.prototype.getSkins = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.xhr(this.envConfig.CFG_URL + "/" + this.latestId + "/GameConfiguration.json")];
                    case 1:
                        data = _a.sent();
                        this.skins.parse(data, this.envConfig.CFG_URL, this.latestId);
                        return [2 /*return*/];
                }
            });
        });
    };
    Master.prototype.changeRegion = function (index) {
        this.regions.setCurrent(index);
    };
    Master.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var cache;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.envConfig.init()];
                                case 1:
                                    _a.sent();
                                    FacebookLogin_1.default.FB_APP_ID = this.envConfig.FB_APP_ID;
                                    GoogleLogin_1.default.GOOGLE_CLIENT_ID = this.envConfig.GOOGLE_CLIENT_ID;
                                    cache = this.cache.get();
                                    if (!(cache === null)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, this.setClientAndsupportProtocolVersion()];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, this.setProtocolVersion()];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, this.setLatestId()];
                                case 4:
                                    _a.sent();
                                    this.cache.set({
                                        clientVersionInt: this.clientVersionInt,
                                        clientVersionString: this.clientVersionString,
                                        supportProtocolVersion: this.supportProtocolVersion,
                                        protocolVersion: this.protocolVersion,
                                        latestId: this.latestId
                                    });
                                    return [3 /*break*/, 6];
                                case 5:
                                    this.clientVersionInt = cache.clientVersionInt;
                                    this.clientVersionString = cache.clientVersionString;
                                    this.supportProtocolVersion = cache.supportProtocolVersion;
                                    this.protocolVersion = cache.protocolVersion;
                                    this.latestId = cache.latestId;
                                    _a.label = 6;
                                case 6: return [4 /*yield*/, this.getRegionsInfo()];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, this.getSkins()];
                                case 8:
                                    _a.sent();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    Master.prototype.connectByServerToken = function (token) {
        return {
            address: "wss://live-arena-" + token + ".agar.io:443",
            https: "wss://live-arena-" + token + ".agar.io:443",
            protocolVersion: this.protocolVersion,
            clientVersionInt: this.clientVersionInt,
            clientVersionString: this.clientVersionString,
            serverToken: token
        };
    };
    Master.prototype.connect = function (token, serverToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.isPrivate = false;
                if (serverToken) {
                    return [2 /*return*/, Promise.resolve(this.connectByServerToken(token))];
                }
                if (this.gameMode.get() === ':party') {
                    return [2 /*return*/, this.joinParty(token)];
                }
                else {
                    return [2 /*return*/, this.getServer()];
                }
                return [2 /*return*/];
            });
        });
    };
    Master.prototype.getPrivateServerWs = function () {
        var wsList = {
            'Arctida': 'wss://imsolo.pro:2109/',
            'Dagestan': 'wss://imsolo.pro:2108/',
            'Delta FFA': 'wss://us.mi.com:2001',
            'FeelForeverAlone': 'wss://imsolo.pro:2102',
            'N.A. FFA': 'wss://delta-ffa-production.up.railway.app',
            'N.A. Party': 'wss://delta-server-production.up.railway.app',
            'Private Party': 'wss://tragedy-party.glitch.me',
            'Rookery': 'wss://imsolo.pro:2104/',
            'Zimbabwe': 'wss://delta-selffeed.glitch.me',
        };
        return wsList[this.regions.getCurrent()];
    };
    Master.prototype.connectPrivate = function (serverToken) {
        return __awaiter(this, void 0, void 0, function () {
            var ws;
            return __generator(this, function (_a) {
                this.isPrivate = true;
                ws = this.getPrivateServerWs();
                if (serverToken) {
                    ws = serverToken;
                }
                return [2 /*return*/, Promise.resolve({
                        address: ws,
                        https: ws,
                        protocolVersion: 22,
                        clientVersionInt: 31100
                    })];
            });
        });
    };
    Master.prototype.findServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.send(this.envConfig.FIND_SERVER_URL, this.setRequestMsg())];
            });
        });
    };
    Master.prototype.getServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var realm, arr, i, FIND_SERVER_URL, message;
            var _this = this;
            return __generator(this, function (_a) {
                realm = this.regions.getCurrent() + this.gameMode.get();
                arr = new Array(10, 4 + realm.length, 10, realm.length);
                arr[4 + realm.length] = 18;
                arr[5 + realm.length] = 0;
                for (i = 0; i < realm.length; i++) {
                    arr[4 + i] = realm.charCodeAt(i);
                }
                FIND_SERVER_URL = this.envConfig.FIND_SERVER_URL;
                message = this.setRequestMsg();
                return [2 /*return*/, this.send(FIND_SERVER_URL, message).then(function (data) { return _this.assembleSocketData(data); })];
            });
        });
    };
    Master.prototype.joinParty = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!token) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.findServer()];
                    case 1:
                        data = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.getTokenIp(token)];
                    case 3:
                        data = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.assembleSocketData(__assign(__assign({}, data), { token: data.token ? data.token : token }))];
                }
            });
        });
    };
    Master.prototype.setRequestMsg = function () {
        var region = this.regions.getCurrent();
        var mode = this.gameMode.get();
        var output = [10, 4 + region.length + mode.length, 10];
        var addCharCode = function (data) {
            output.push(data.length);
            for (var i = 0; i < data.length; i++) {
                output.push(data.charCodeAt(i));
            }
        };
        addCharCode(region);
        output.push(18);
        addCharCode(mode);
        return new Uint8Array(output);
    };
    Master.prototype.setLatestId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.xhr(this.envConfig.LATEST_ID_URL)];
                    case 1:
                        _a.latestId = _b.sent();
                        return [2 /*return*/, this.latestId];
                }
            });
        });
    };
    Master.prototype.setClientAndsupportProtocolVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch(this.MC_CORE).then(function (data) { return data.text(); }).then(function (data) {
                        _this.clientVersionString = data.match(/versionString="(\d+\.\d+\.\d+)"/)[1]; // 3.10.9
                        _this.clientVersionInt =
                            10000
                                * parseInt(_this.clientVersionString.split(".")[0])
                                + 100
                                    * parseInt(_this.clientVersionString.split(".")[1])
                                + parseInt(_this.clientVersionString.split(".")[2]);
                        _this.supportProtocolVersion = data.match(/x-support-proto-version","(\d+\.\d+\.\d+)"/)[1]; // 15.0.3 
                    })];
            });
        });
    };
    Master.prototype.setProtocolVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fetch(this.AGAR_CORE).then(function (data) { return data.text(); }).then(function (data) {
                        _this.protocolVersion = Number(data.match(/\w\[\w\+\d+>>\d\]=\w;\w+\(\w,(\d+)\);/)[1]); // 22
                    })];
            });
        });
    };
    Master.prototype.assembleSocketData = function (data) {
        var address = data.token ? "wss://" + data.endpoints.https + "?party_id=" + data.token : "wss://" + data.endpoints.https;
        var serverToken = data.endpoints.https.split('-')[2].split('.')[0]; // 'live-arena-1jkvvq9.agar.io:443' -> 1jkvvq9
        return {
            address: address,
            token: data.token,
            serverToken: serverToken,
            https: data.endpoints.https,
            protocolVersion: this.protocolVersion,
            clientVersionInt: this.clientVersionInt,
            clientVersionString: this.clientVersionString,
        };
    };
    return Master;
}());
exports.default = Master;
