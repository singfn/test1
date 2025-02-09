"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Storage_1 = __importDefault(require("./Storage/Storage"));
var SettingsState_1 = __importDefault(require("../states/SettingsState"));
var Settings = /** @class */ (function () {
    function Settings(stage) {
        this.stage = stage;
        var storage = new Storage_1.default();
        this.all = storage.init();
        this.transformProfilesState();
    }
    Settings.prototype.transformProfilesState = function () {
        var profiles = this.all.profiles;
        profiles.leftProfileNick = profiles.leftProfiles[profiles.leftSelectedIndex].nick;
        profiles.leftProfileSkinUrl = profiles.leftProfiles[profiles.leftSelectedIndex].skinUrl;
        profiles.tag = profiles.leftProfiles[profiles.leftSelectedIndex].tag;
        profiles.rightProfileNick = profiles.rightProfiles[profiles.rightSelectedIndex].nick;
        profiles.rightProfileSkinUrl = profiles.rightProfiles[profiles.rightSelectedIndex].skinUrl;
    };
    Settings.prototype.updateThemingCells = function (type) {
        switch (type) {
            case 'Shadow':
                this.stage.textureGenerator.generateCellShadow();
                this.stage.world.cells.children.filter(function (cell) { return cell.type === 'CELL'; }).forEach(function (cell) {
                    cell.changeShadowTexture();
                });
                this.stage.world.minimap.changeCellShadowTexture();
                break;
            case 'MyShadow':
                this.stage.textureGenerator.generateMyCellShadow();
                this.stage.world.cells.children.filter(function (cell) { return cell.type === 'CELL'; }).forEach(function (cell) {
                    cell.changeShadowTexture();
                });
                this.stage.world.minimap.changeCellShadowTexture();
                break;
        }
    };
    Settings.prototype.updateThemingFood = function () {
        this.stage.textureGenerator.generateFood();
        var foodTexture = this.stage.textureGenerator.food;
        this.stage.world.food.children.forEach(function (food) {
            food.texture = foodTexture;
        });
    };
    Settings.prototype.updateThemingMap = function (type) {
        switch (type) {
            case 'BgImgUrl':
                this.stage.world.map.background.updateTexture();
                break;
            case 'BgTint':
                this.stage.world.map.background.updateTint();
                this.stage.updateRendererBackgroundColor();
                break;
            case 'Border':
                this.stage.world.map.borders.updateTextures();
                break;
            case 'GlobalBgImgUrl':
                this.stage.world.map.globalBackground.updateTexture();
                break;
            case 'GlobalBgImgTint':
                this.stage.world.map.globalBackground.updateTint();
                break;
        }
    };
    Settings.prototype.updateThemingMinimap = function (type) {
        switch (type) {
            case 'BgColor':
                this.stage.world.minimap.updateBackgroundColor();
                break;
            case 'GhostCellsColor':
                this.stage.world.minimap.ghostCells.updateColor();
                break;
            case 'ViewportColors':
                this.stage.world.minimap.viewports.updateColors();
                break;
            case 'PlayerColor':
                this.stage.world.minimap.staticPlayerCells.updateColors();
                break;
        }
    };
    Settings.prototype.updateThemingMultibox = function (type) {
        switch (type) {
            case 'LinedRing':
                this.stage.textureGenerator.generateMultiboxLinedRing();
                break;
        }
    };
    Settings.prototype.updateThemingViewports = function () {
    };
    Settings.prototype.updateThemingViruses = function () {
        this.stage.textureGenerator.generateVirus();
        this.stage.world.minimap.changeVirusTexture();
        this.stage.world.cells.children.filter(function (cell) { return cell.type === 'VIRUS'; }).forEach(function (virus) {
            virus.updateTexture();
        });
    };
    Settings.prototype.updateThemingVirusesMassType = function (type) {
        var viruses = this.stage.world.cells.children.filter(function (cell) { return cell.type === 'VIRUS'; });
        switch (type) {
            case 'Disabled':
            case 'Full mass':
                viruses.forEach(function (virus) {
                    virus.shots.visible = false;
                });
                break;
            case 'Fill circle':
                viruses.forEach(function (virus) {
                    virus.shots.visible = true;
                });
                break;
        }
    };
    Settings.prototype.updateSystemCells = function () {
    };
    Settings.prototype.updateSystemCellsRings = function (type) {
        if (type !== 'Disabled' && !SettingsState_1.default.rings) {
            SettingsState_1.default.rings = true;
        }
    };
    Settings.prototype.updateSystemEffects = function () {
    };
    Settings.prototype.updateSystemGameplay = function () {
    };
    Settings.prototype.updateSystemMinimap = function () {
    };
    Settings.prototype.updateSystemMultibox = function () {
    };
    Settings.prototype.updateSystemPerformance = function () {
    };
    return Settings;
}());
exports.default = Settings;
