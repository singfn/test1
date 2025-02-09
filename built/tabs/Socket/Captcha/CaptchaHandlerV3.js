"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Captcha_1 = require("./Captcha");
var CaptchaHandlerV3 = /** @class */ (function () {
    function CaptchaHandlerV3() {
        this.v3_id = null;
        this.V3_KEY = '6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY';
    }
    CaptchaHandlerV3.prototype.handle = function (socket) {
        var _this = this;
        if (this.v3_id !== null) {
            window.grecaptcha.reset(this.v3_id);
        }
        else {
            this.v3_id = window.grecaptcha.render('ReCaptchaV3', {
                sitekey: this.V3_KEY,
                badge: 'inline',
                size: 'invisible'
            });
        }
        return new Promise(function (resolve) {
            window.grecaptcha.execute(_this.v3_id, { action: 'play' }).then(function (token) {
                if (socket) {
                    socket.emitter.sendCaptcha(token, Captcha_1.CaptchaVersion.V3);
                }
                Captcha_1.setVidgetVisibility(false, document.querySelector('#ReCaptchaV3'));
                resolve(token);
            });
        });
    };
    return CaptchaHandlerV3;
}());
exports.default = CaptchaHandlerV3;
