"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Socket_1 = __importDefault(require("./Socket"));
var Ogar = /** @class */ (function () {
    function Ogar(settings, master) {
        this.settings = settings;
        this.master = master;
        this.connected = false;
        this.firstTab = new Socket_1.default(false, settings, master);
        this.secondTab = new Socket_1.default(true, settings, master);
    }
    Ogar.prototype.join = function (serverToken, partyToken) {
        if (partyToken === void 0) { partyToken = ''; }
        this.firstTab.isConnected() && this.firstTab.join(serverToken, partyToken);
        this.secondTab.isConnected() && this.secondTab.join(serverToken, partyToken);
    };
    return Ogar;
}());
exports.default = Ogar;
