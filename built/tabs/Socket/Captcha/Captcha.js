"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaVersion = exports.setVidgetVisibility = void 0;
var FrontAPI_1 = __importDefault(require("../../../communication/FrontAPI"));
var CaptchaHandlerV2_1 = __importDefault(require("./CaptchaHandlerV2"));
var CaptchaHandlerV3_1 = __importDefault(require("./CaptchaHandlerV3"));
var setVidgetVisibility = function (value, element) {
    if (!element) {
        return;
    }
    if (value) {
        element.style.position = 'absolute';
        element.style.top = '0px';
        element.style.left = '0px';
        element.style.right = '0px';
        element.style.bottom = '0px';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        element.style.background = 'rgba(20, 20, 20, .8)';
        element.style.zIndex = '100';
    }
    else {
        element.style.display = 'none';
    }
};
exports.setVidgetVisibility = setVidgetVisibility;
exports.default = new /** @class */ (function () {
    function Captcha() {
        this.initTries = 0;
        this.MAX_INIT_TRIES = 5;
        this.INIT_TIMEOUT = 1000;
        this.init();
        this.V2 = new CaptchaHandlerV2_1.default();
        this.V3 = new CaptchaHandlerV3_1.default();
    }
    Captcha.prototype.init = function () {
        var _this = this;
        setTimeout(function () {
            if (!window.grecaptcha) {
                if (_this.initTries > _this.MAX_INIT_TRIES) {
                    FrontAPI_1.default.sendChatGameMessage('ReCaptcha load failed. Please, refresh the page.');
                    throw new Error("ReCaptcha load failed.");
                }
                else {
                    _this.initTries++;
                    _this.init();
                }
            }
        }, this.INIT_TIMEOUT);
    };
    return Captcha;
}());
exports.CaptchaVersion = {
    V2: 2,
    V3: 3
};
