"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = __importDefault(require("../../../utils/Logger"));
var Captcha_1 = require("./Captcha");
var CpatchaHandlerV2 = /** @class */ (function () {
    function CpatchaHandlerV2() {
        this.V2_KEY = '6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl';
        this.v2_id = null;
        this.logger = new Logger_1.default('CaptchaV2Handler');
    }
    CpatchaHandlerV2.prototype.handle = function (socket) {
        var _this = this;
        Captcha_1.setVidgetVisibility(true, document.querySelector('#ReCaptchaV2'));
        if (this.v2_id !== null) {
            window.grecaptcha.reset(this.v2_id);
        }
        else {
            this.v2_id = window.grecaptcha.render('ReCaptchaV2', {
                theme: "dark",
                sitekey: this.V2_KEY,
                callback: function (token) { return _this.handler(token, socket); },
                'expired-callback': function () { return _this.expireHandler(); }
            });
        }
    };
    CpatchaHandlerV2.prototype.handler = function (token, socket) {
        socket.emitter.sendCaptcha(token, Captcha_1.CaptchaVersion.V2);
        Captcha_1.setVidgetVisibility(false, document.querySelector('#ReCaptchaV2'));
    };
    CpatchaHandlerV2.prototype.expireHandler = function () {
        this.logger.warning('Expired');
    };
    return CpatchaHandlerV2;
}());
exports.default = CpatchaHandlerV2;
