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
Object.defineProperty(exports, "__esModule", { value: true });
var EnvCfg = /** @class */ (function () {
    function EnvCfg() {
        this.ENV_URL = 'https://agar.io/';
        this.MASTER_ENDPOINT_VERSION = 'v4';
    }
    EnvCfg.prototype.receiveConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(this.ENV_URL, {
                        method: "GET",
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    }).then(function (response) { return response.text(); })
                        .then(function (text) { return text.match(new RegExp(/EnvConfig\s+=\s+{([\s\S]+?)}/g))[0]; })];
            });
        });
    };
    EnvCfg.prototype.createUrl = function (request) {
        return this.MASTER_URL + '/' + this.MASTER_ENDPOINT_VERSION + '/' + request;
    };
    EnvCfg.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var strToEval;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.receiveConfig()];
                    case 1:
                        strToEval = _a.sent();
                        eval('window.' + strToEval);
                        this.MASTER_URL = EnvConfig.master_url;
                        this.CFG_URL = EnvConfig.config_url;
                        this.CFG_VERSION = Number(EnvConfig.configVersion);
                        this.CUSTOM_SKINS_URL = EnvConfig.custom_skins_url;
                        this.FB_APP_ID = Number(EnvConfig.fb_app_id);
                        this.GOOGLE_CLIENT_ID = EnvConfig.google_client_id;
                        this.XSOLLA_ENDPOINT = EnvConfig.xsolla_endpoint;
                        this.GET_COUNTRY_URL = this.createUrl('getCountry');
                        this.CREATE_TOKEN_URL = this.createUrl('createToken');
                        this.GET_TOKEN_URL = this.createUrl('getToken');
                        this.FIND_SERVER_URL = this.createUrl('findServer');
                        this.REGIONS_INFO_URL = this.MASTER_URL + '/info';
                        this.LATEST_ID_URL = this.MASTER_URL + '/getLatestID';
                        return [2 /*return*/];
                }
            });
        });
    };
    return EnvCfg;
}());
exports.default = EnvCfg;
