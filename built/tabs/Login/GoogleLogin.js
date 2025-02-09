"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FrontAPI_1 = __importDefault(require("../../communication/FrontAPI"));
var Logger_1 = __importDefault(require("../../utils/Logger"));
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var Chat_1 = require("../../communication/Chat");
exports.default = new /** @class */ (function () {
    function GoogleLogin() {
        this.loggedIn = false;
        this.token = null;
        this.GOOGLE_CLIENT_ID = '';
        this.storage_key = 'GOOGLE_TOKEN';
        this.SDKLoaded = false;
        this.initTries = 0;
        this.MAX_INIT_TRIES = 5;
        this.INIT_TIMEOUT = 4000;
        this.token = null;
        this.checkLogin();
        this.checkSdkLoaded();
        this.logger = new Logger_1.default('GoogleLogin');
    }
    GoogleLogin.prototype.checkLogin = function () {
        var data = this.getTokenData();
        if (data) {
            var token = data.token, expiry = data.expiry;
            if (expiry > Date.now()) {
                var expiresIn = ~~((expiry - Date.now()) / 1000 / 60);
                this.token = token;
                this.loggedIn = true;
                FrontAPI_1.default.setGoogleLogged(true);
                FrontAPI_1.default.sendChatGameMessage("Logged in. Re-login required in " + expiresIn + " minutes.", Chat_1.ChatAuthor.Google);
            }
            else {
                FrontAPI_1.default.setGoogleLogged(false);
                FrontAPI_1.default.sendChatGameMessage('Token expired. Please, log in again.', Chat_1.ChatAuthor.Google);
                this.logOut();
            }
        }
        else {
            FrontAPI_1.default.setGoogleLogged(false);
            this.logOut();
        }
    };
    GoogleLogin.prototype.checkSdkLoaded = function () {
        var _this = this;
        if (this.SDKLoaded) {
            return;
        }
        if (this.GOOGLE_CLIENT_ID && window.gapi) {
            this.googleAuth = window.gapi.auth2.init({
                client_id: this.GOOGLE_CLIENT_ID,
                cookie_policy: "single_host_origin",
                scope: "https://www.googleapis.com/auth/plus.login email",
                app_package_name: "com.miniclip.agar.io",
            });
            this.SDKLoaded = true;
            this.logger.info('SDK succesfully initialized');
        }
        else {
            if (this.initTries > this.MAX_INIT_TRIES) {
                FrontAPI_1.default.sendChatGameMessage("Login error: SKD hasn't been loaded yet.", Chat_1.ChatAuthor.Google);
                FrontAPI_1.default.setFacebookLogged(false);
                this.SDKLoaded = false;
            }
            else {
                this.initTries++;
                setTimeout(function () { return _this.checkSdkLoaded(); }, this.INIT_TIMEOUT);
            }
        }
    };
    GoogleLogin.prototype.logOut = function () {
        this.token = null;
        this.loggedIn = false;
        localStorage.removeItem(this.storage_key);
        FrontAPI_1.default.setGoogleLogged(false);
    };
    GoogleLogin.prototype.setToken = function (token, expiry) {
        localStorage.setItem(this.storage_key, JSON.stringify({ token: token, expiry: expiry }));
    };
    GoogleLogin.prototype.getTokenData = function () {
        return JSON.parse(localStorage.getItem(this.storage_key));
    };
    GoogleLogin.prototype.logIn = function (socket) {
        if (this.loggedIn && this.token && socket) {
            var _a = window.GameSettings.all.profiles, leftProfileLoginType = _a.leftProfileLoginType, rightProfileLoginType = _a.rightProfileLoginType;
            if (PlayerState_1.default.first.loggedIn && socket.tabType === 'FIRST_TAB') {
                return;
            }
            if (PlayerState_1.default.second.loggedIn && socket.tabType === 'SECOND_TAB') {
                return;
            }
            switch (socket.tabType) {
                case 'FIRST_TAB':
                    if (leftProfileLoginType === 'GOOGLE') {
                        socket.emitter.sendLogin(this.token, 4);
                        PlayerState_1.default.first.loggedIn = true;
                        this.logger.info('Logged in' + ' [' + socket.tabType + ']');
                    }
                    break;
                case 'SECOND_TAB':
                    if (rightProfileLoginType === 'GOOGLE') {
                        socket.emitter.sendLogin(this.token, 4);
                        PlayerState_1.default.first.loggedIn = true;
                        this.logger.info('Logged in' + ' [' + socket.tabType + ']');
                    }
                    break;
            }
        }
    };
    GoogleLogin.prototype.forceSendLogin = function (controller) {
        this.logIn(controller.firstTabSocket);
        this.logIn(controller.secondTabSocket);
    };
    GoogleLogin.prototype.prepareToken = function (controller) {
        var _this = this;
        if (!this.SDKLoaded) {
            return;
        }
        this.googleAuth.signIn().then(function (instance) {
            var data = instance.getAuthResponse(true);
            var token = data.id_token;
            if (token) {
                _this.token = token;
                _this.loggedIn = true;
                _this.setToken(token, data.expires_at);
                FrontAPI_1.default.sendChatGameMessage('Token received successfully.', Chat_1.ChatAuthor.Google);
                FrontAPI_1.default.setGoogleLogged(true);
                _this.forceSendLogin(controller);
            }
            else {
                FrontAPI_1.default.sendChatGameMessage('Could not receive token.', Chat_1.ChatAuthor.Google);
                FrontAPI_1.default.setFacebookLogged(false);
            }
        });
    };
    return GoogleLogin;
}());
