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
var Chat_1 = require("../../communication/Chat");
var Logger_1 = __importDefault(require("../../utils/Logger"));
var types_1 = require("../Socket/types");
var timeout = function (milliseconds) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(); }, milliseconds);
    });
};
var QuickRespawn = /** @class */ (function () {
    function QuickRespawn(controller) {
        this.controller = controller;
        this.logger = new Logger_1.default('QuickRespawn');
    }
    QuickRespawn.prototype.spawn = function (tabType) {
        var autoRespawnOnFail = this.controller.world.scene.settings.all.settings.game.gameplay.autoRespawnOnFail;
        switch (tabType) {
            case 'FIRST_TAB':
                try {
                    this.controller.spawnFirstTab();
                    this.controller.setFirstTabActive();
                }
                catch (reason) {
                    FrontAPI_1.default.sendChatGameMessage("Could not spawn (main)", Chat_1.ChatAuthor.QuickRespawn);
                    if (autoRespawnOnFail) {
                        this.handle();
                    }
                }
                break;
            case 'SECOND_TAB':
                try {
                    this.controller.spawnSecondTab();
                    this.controller.setSecondTabActive();
                }
                catch (reason) {
                    FrontAPI_1.default.sendChatGameMessage("Could not spawn (multi)", Chat_1.ChatAuthor.QuickRespawn);
                    if (autoRespawnOnFail) {
                        this.handle();
                    }
                }
                break;
        }
    };
    QuickRespawn.prototype.handle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reason_1, reason_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.controller.currentFocusedTab === 'FIRST_TAB')) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.controller.connectFirstPlayerTab()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        reason_1 = _a.sent();
                        if (reason_1 === types_1.SOCKET_CONNECTION_REJECT.NO_RESPONSE_FROM_SERVER) {
                            this.logger.error("Could not connect to server. Reason: " + reason_1);
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, timeout(100)];
                    case 5:
                        _a.sent();
                        this.spawn('FIRST_TAB');
                        return [3 /*break*/, 11];
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.controller.connectSecondPlayerTab()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        reason_2 = _a.sent();
                        if (reason_2 === types_1.SOCKET_CONNECTION_REJECT.NO_RESPONSE_FROM_SERVER) {
                            this.logger.error("Could not connect to server. Reason: " + reason_2);
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, timeout(100)];
                    case 10:
                        _a.sent();
                        this.spawn('SECOND_TAB');
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return QuickRespawn;
}());
exports.default = QuickRespawn;
