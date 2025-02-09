"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Versions_1 = require("../Versions");
exports.default = new /** @class */ (function () {
    function UICommunicationService() {
    }
    UICommunicationService.prototype.sendChatMessage = function (nick, message, type) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.addChatMessage(nick, message, type, Date.now());
    };
    UICommunicationService.prototype.sendChatGameMessage = function (message, author) {
        var _a;
        if (author === void 0) { author = ''; }
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.addChatMessage(author, message, 'GAME', Date.now());
    };
    UICommunicationService.prototype.setGameVersion = function () {
        var interval = setInterval(function () {
            var _a, _b;
            if ((_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setGameLoaderStatus) {
                (_b = window.FrontAPI) === null || _b === void 0 ? void 0 : _b.setGameLoaderStatus(Versions_1.LOADER_TEXT);
                clearInterval(interval);
            }
        }, 100);
    };
    UICommunicationService.prototype.setGameLoaderShown = function (shown) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setGameLoaderShown(shown);
    };
    UICommunicationService.prototype.updateStats = function (fps, loss) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.updateStats(fps, loss);
    };
    UICommunicationService.prototype.updateLeaderboard = function (leaderboard) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.updateLeaderboard(leaderboard);
    };
    UICommunicationService.prototype.updateGhostCells = function (ghostCells) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.updateGhostCells(ghostCells);
    };
    UICommunicationService.prototype.setFacebookLogged = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setFacebookLoggedIn(value);
    };
    UICommunicationService.prototype.setGoogleLogged = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setGoogleLoggedIn(value);
    };
    UICommunicationService.prototype.setRegions = function (regions) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setRegions(regions);
    };
    UICommunicationService.prototype.setIsPlayerPlaying = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setIsPlayerPlaying(value);
    };
    UICommunicationService.prototype.updateTopTeam = function (players) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.updateTopTeam(players);
    };
    UICommunicationService.prototype.setEllapsedFrametime = function (ms) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setEllapsedFrametime(ms);
    };
    UICommunicationService.prototype.setToken = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setToken(value);
    };
    UICommunicationService.prototype.setServerToken = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setServerToken(value);
    };
    UICommunicationService.prototype.setSocketConnecting = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setSocketConnecting(value);
    };
    UICommunicationService.prototype.setFirstTabStatus = function (status) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setFirstTabStatus(status);
    };
    UICommunicationService.prototype.setSecondTabStatus = function (status) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setSecondTabStatus(status);
    };
    UICommunicationService.prototype.setSpectatorTabStatus = function (status) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setSpectatorTabStatus(status);
    };
    UICommunicationService.prototype.setMyMass = function (value) {
        var _a;
        (_a = window.FrontAPI) === null || _a === void 0 ? void 0 : _a.setMyMass(value);
    };
    return UICommunicationService;
}());
