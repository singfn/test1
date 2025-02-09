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
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var Logger_1 = __importDefault(require("../../utils/Logger"));
var Chat_1 = require("../../communication/Chat");
exports.default = new /** @class */ (function () {
    function FacebookLogin() {
        var _this = this;
        this.loggedIn = false;
        this.token = null;
        this.FB_APP_ID = 0;
        this.expirationDate = 0;
        this.SDKLoaded = false;
        this.initTries = 0;
        this.MAX_INIT_TRIES = 5;
        this.INIT_TIMEOUT = 4000;
        this.logger = new Logger_1.default('FacebookLogin');
        setTimeout(function () { return _this.initLoginSystem(); }, this.INIT_TIMEOUT);
    }
    FacebookLogin.prototype.initLoginSystem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.initSDK()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getLoginStatus()];
                    case 1:
                        response = _a.sent();
                        if (response.status === 'connected') {
                            this.handleSuccessfulLogin(response.authResponse.accessToken, response.authResponse.expiresIn);
                        }
                        else {
                            FrontAPI_1.default.setFacebookLogged(false);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        if (this.initTries < this.MAX_INIT_TRIES) {
                            this.initTries++;
                            setTimeout(function () { return _this.initLoginSystem(); }, this.INIT_TIMEOUT);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FacebookLogin.prototype.initSDK = function () {
        if (!window.FB) {
            this.logger.error("SDK hasn't beed loaded yet (INIT_BEFORE_LOAD_ERROR)");
            this.SDKLoaded = false;
            return false;
        }
        window.FB.init({
            appId: this.FB_APP_ID,
            cookie: true,
            xfbml: true,
            status: true,
            version: "v3.2",
        });
        this.logger.info('SDK successfully initialized');
        this.SDKLoaded = true;
        return true;
    };
    FacebookLogin.prototype.getLoginStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        window.FB.getLoginStatus(function (response) {
                            resolve(response);
                        });
                    })];
            });
        });
    };
    FacebookLogin.prototype.handleSuccessfulLogin = function (token, expiresIn) {
        this.token = token;
        this.loggedIn = true;
        this.expirationDate = Date.now() + (1000 * expiresIn);
        var expires = ~~((this.expirationDate - Date.now()) / 1000 / 60);
        FrontAPI_1.default.setFacebookLogged(true);
        FrontAPI_1.default.sendChatGameMessage("Logged in. Re-login required in " + expires + " minutes.", Chat_1.ChatAuthor.Facebook);
    };
    FacebookLogin.prototype.prepareToken = function (controller) {
        var _this = this;
        if (!this.SDKLoaded) {
            return;
        }
        window.FB.login(function (response) {
            if (response.status === 'connected') {
                _this.handleSuccessfulLogin(response.authResponse.accessToken, response.authResponse.expiresIn);
                _this.forceSendLogin(controller);
            }
            else {
                FrontAPI_1.default.sendChatGameMessage('Login error.', Chat_1.ChatAuthor.Facebook);
                FrontAPI_1.default.setFacebookLogged(false);
            }
        }, {
            scope: "public_profile, email",
        });
    };
    FacebookLogin.prototype.logOut = function () {
        this.token = null;
        this.loggedIn = false;
        window.FB.logout(function (response) { return console.log(response); });
        this.logger.info('Log out');
        FrontAPI_1.default.setFacebookLogged(false);
    };
    FacebookLogin.prototype.forceSendLogin = function (controller) {
        controller.firstTabSocket && this.logIn(controller.firstTabSocket);
        controller.secondTabSocket && this.logIn(controller.secondTabSocket);
    };
    FacebookLogin.prototype.logIn = function (socket) {
        if (!this.loggedIn || !this.token || !socket) {
            return;
        }
        var _a = window.GameSettings.all.profiles, leftProfileLoginType = _a.leftProfileLoginType, rightProfileLoginType = _a.rightProfileLoginType;
        if (PlayerState_1.default.first.loggedIn && socket.tabType === 'FIRST_TAB') {
            return;
        }
        if (PlayerState_1.default.second.loggedIn && socket.tabType === 'SECOND_TAB') {
            return;
        }
        var shouldLogInWithFirstTab = socket.tabType === 'FIRST_TAB' && leftProfileLoginType === 'FACEBOOK';
        var shouldLogInWithSecondTab = socket.tabType === 'SECOND_TAB' && rightProfileLoginType === 'FACEBOOK';
        if (shouldLogInWithFirstTab) {
            socket.emitter.sendLogin(this.token, 2);
            PlayerState_1.default.first.loggedIn = true;
            this.logger.info('Logged in' + ' [' + socket.tabType + ']');
        }
        else if (shouldLogInWithSecondTab) {
            socket.emitter.sendLogin(this.token, 2);
            PlayerState_1.default.second.loggedIn = true;
            this.logger.info('Logged in' + ' [' + socket.tabType + ']');
        }
    };
    return FacebookLogin;
}());
