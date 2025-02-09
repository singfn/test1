"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Map_1 = __importDefault(require("../objects/Map/Map"));
var Food_1 = __importDefault(require("../objects/Food"));
var index_1 = __importDefault(require("../objects/Cell/index"));
var Virus_1 = __importDefault(require("../objects/Virus/Virus"));
var RemoveAnimation_1 = __importDefault(require("../objects/RemoveAnimation"));
var PlayerCells_1 = __importDefault(require("./PlayerCells"));
var WorldLoop_1 = __importDefault(require("./WorldLoop"));
var SocketCells_1 = __importDefault(require("./SocketCells"));
var TabsController_1 = __importDefault(require("../tabs/Contollers/TabsController"));
var View_1 = __importDefault(require("../View"));
var Hotkeys_1 = __importDefault(require("../tabs/Hotkeys/Hotkeys"));
var MinimapWEBGL_1 = __importDefault(require("../Minimap/MinimapWEBGL"));
var Logger_1 = __importDefault(require("../utils/Logger"));
var PlayerState_1 = __importDefault(require("../states/PlayerState"));
var SkinsLoader_1 = __importDefault(require("../utils/SkinsLoader"));
var helpers_1 = require("../utils/helpers");
var Ejected_1 = __importDefault(require("../objects/Ejected"));
var AnimationSettingsProvider_1 = __importDefault(require("./Renderer/AnimationSettingsProvider"));
var World = /** @class */ (function () {
    function World(scene) {
        this.scene = scene;
        this.lastRenderTime = 0;
        this.settings = scene.settings;
        this.master = scene.master;
        this.ogar = scene.ogar;
        this.textureGenerator = scene.textureGenerator;
        this.animationSettingsProvider = new AnimationSettingsProvider_1.default(this);
        this.skinsLoader = new SkinsLoader_1.default(this);
        this.cells = new pixi_js_1.Container();
        this.cells.sortableChildren = true;
        var PARTICLE_CONFIG = {
            vertices: true,
            position: true,
            rotation: false,
            uvs: false,
            tint: true,
            alpha: true
        };
        this.food = new pixi_js_1.ParticleContainer(3072, PARTICLE_CONFIG, 3072, false);
        this.ejected = new pixi_js_1.ParticleContainer(768, PARTICLE_CONFIG, 768, false);
        this.indexedCells = new Map();
        this.indexedFood = new Map();
        this.indexedEjected = new Map();
        this.playerCells = new PlayerCells_1.default(this.settings, this.ogar);
        this.socketCells = new SocketCells_1.default();
        this.view = new View_1.default({ playerCells: this.playerCells, socketCells: this.socketCells }, scene.app.view, this.scene.settings, this.ogar);
        this.map = new Map_1.default(this);
        this.minimap = new MinimapWEBGL_1.default(this);
        this.controller = new TabsController_1.default(this);
        this.hotkeys = new Hotkeys_1.default(this.controller);
        this.scene.hotkeys = this.hotkeys;
        this.renderer = new WorldLoop_1.default(this);
        this.cachePlayerSkins();
        this.logger = new Logger_1.default('World');
    }
    World.prototype.cachePlayerSkins = function () {
        var _this = this;
        var _a = this.settings.all.profiles, leftProfiles = _a.leftProfiles, rightProfiles = _a.rightProfiles;
        leftProfiles.forEach(function (profile) { return _this.skinsLoader.getCustomSkin(profile.skinUrl, function () { }); });
        rightProfiles.forEach(function (profile) { return _this.skinsLoader.getCustomSkin(profile.skinUrl, function () { }); });
    };
    World.prototype.addFood = function (id, location, type, subtype) {
        if (!this.indexedFood.has(id)) {
            var food = new Food_1.default(this, location, subtype);
            this.indexedFood.set(id, food);
            this.food.addChild(food);
            /* this.socketCells.add(subtype, food, id); */
        }
        else {
            this.update(id, location, type);
        }
    };
    World.prototype.addEjected = function (id, location, color, type, subtype) {
        if (!this.indexedEjected.has(id)) {
            var ejected = new Ejected_1.default(this, location, color, subtype);
            this.indexedEjected.set(id, ejected);
            this.ejected.addChild(ejected);
        }
        else {
            this.update(id, location, type);
        }
    };
    World.prototype.addCell = function (id, location, color, name, type, subtype, skin) {
        var cell;
        if (!this.indexedCells.has(id)) {
            // idk black cell fix
            if (color.red === undefined && color.green === undefined && color.blue === undefined) {
                return;
            }
            cell = new index_1.default(subtype, location, color, name, skin, this);
            this.indexedCells.set(id, cell);
            this.cells.addChild(cell);
            this.socketCells.add(subtype, cell, id);
            this.minimap.addRealPlayerCell(id, location, color, name, type, subtype, skin);
            this.renderer.checkIsTeam(cell);
        }
        else {
            cell = this.indexedCells.get(id);
            this.update(id, location, type);
        }
        if (subtype === 'FIRST_TAB' && this.playerCells.firstTabIds.has(id)) {
            this.playerCells.addFirstTabCell(id, cell);
            if (this.settings.all.settings.game.multibox.enabled && PlayerState_1.default.second.playing && this.controller.currentFocusedTab === 'FIRST_TAB') {
                cell.setIsFoucsedTab(true);
            }
        }
        else if (subtype === 'SECOND_TAB' && this.playerCells.secondTabIds.has(id)) {
            this.playerCells.addSecondTabCell(id, cell);
            if (PlayerState_1.default.first.playing && this.controller.currentFocusedTab === 'SECOND_TAB') {
                cell.setIsFoucsedTab(true);
            }
        }
    };
    World.prototype.addVirus = function (id, location, color, name, type, subtype) {
        if (!this.indexedCells.has(id)) {
            var virus = new Virus_1.default(location, subtype, this);
            this.cells.addChild(virus);
            this.indexedCells.set(id, virus);
            this.socketCells.add(subtype, virus, id);
            this.minimap.addRealPlayerCell(id, location, color, name, type, subtype);
        }
        else {
            this.update(id, location, type);
        }
    };
    World.prototype.add = function (id, location, color, name, type, subtype, skin) {
        switch (type) {
            case 'FOOD':
                this.addFood(id, location, type, subtype);
                break;
            case 'EJECTED':
                this.addEjected(id, location, color, type, subtype);
                break;
            case 'CELL':
                this.addCell(id, location, color, name, type, subtype, skin);
                break;
            case 'VIRUS':
                this.addVirus(id, location, color, name, type, subtype);
                break;
        }
    };
    World.prototype.addPlayer = function (id, subtype) {
        switch (subtype) {
            case 'FIRST_TAB':
                this.playerCells.addFirstTabId(id);
                break;
            case 'SECOND_TAB':
                this.playerCells.addSecondTabId(id);
                break;
        }
    };
    World.prototype.update = function (id, location, type) {
        if (type === 'FOOD') {
            this.indexedFood.get(id).update(location);
        }
        else {
            if (type === 'CELL' || type === 'VIRUS') {
                this.indexedCells.get(id).update(location);
                this.minimap.updateRealPlayerCell(id, location);
            }
            else {
                this.indexedEjected.get(id).update(location);
            }
        }
    };
    World.prototype.addRemoveAnimation = function (object) {
        var matchSize = object.type === 'CELL'
            ? object.cell.width > 150
            : object.type === 'VIRUS' ? object.virusSprite.width : false;
        var removeAnimation = this.settings.all.settings.game.effects.cellRemoveAnimation !== 'Disabled';
        if (removeAnimation && matchSize) {
            var location_1 = {
                x: object.x,
                y: object.y,
                r: object.width
            };
            var tint = 0xFFFFFF;
            if (object.type == 'CELL') {
                tint = object.cell.tint;
            }
            else if (object.type === 'VIRUS') {
                tint = helpers_1.getColor(this.settings.all.settings.theming.viruses.color);
            }
            this.cells.addChild(new RemoveAnimation_1.default(location_1, object.subtype, this, tint));
        }
    };
    World.prototype.remove = function (id, removeType, eaterId) {
        var removeImmediatly = Date.now() - this.lastRenderTime > 100;
        if (this.indexedFood.has(id)) {
            var food = this.indexedFood.get(id);
            if (removeImmediatly || this.settings.all.settings.game.performance.foodPerformanceMode) {
                this.food.removeChild(food);
            }
            else {
                food.remove();
            }
            this.indexedFood.delete(id);
            return;
        }
        if (this.indexedEjected.has(id)) {
            var object = this.indexedEjected.get(id);
            if (removeImmediatly) {
                this.ejected.removeChild(object);
            }
            else {
                var eatenBy = this.indexedCells.get(eaterId);
                if (eatenBy) {
                    object.remove(removeType, eatenBy);
                }
                else {
                    object.remove('REMOVE_CELL_OUT_OF_VIEW');
                }
            }
            this.indexedEjected.delete(id);
            this.playerCells.remove(object.subtype, id);
            this.socketCells.remove(object.subtype, id);
            return;
        }
        if (this.indexedCells.has(id)) {
            var object = this.indexedCells.get(id);
            if (removeImmediatly) {
                this.cells.removeChild(object);
            }
            else {
                var eatenBy = this.indexedCells.get(eaterId);
                if (eatenBy) {
                    object.remove(removeType, eatenBy);
                }
                else {
                    object.remove('REMOVE_CELL_OUT_OF_VIEW');
                }
                if (removeType === 'REMOVE_EATEN_CELL') {
                    this.addRemoveAnimation(object);
                }
            }
            this.playerCells.remove(object.subtype, id);
            this.socketCells.remove(object.subtype, id);
            this.indexedCells.delete(id);
            this.minimap.removeRealPlayerCell(id, removeType);
        }
    };
    World.prototype.removeEaten = function (id, eaterId) {
        this.remove(id, 'REMOVE_EATEN_CELL', eaterId);
    };
    World.prototype.removeOutOfView = function (id) {
        this.remove(id, 'REMOVE_CELL_OUT_OF_VIEW');
    };
    World.prototype.clear = function () {
        while (this.food.children[0]) {
            this.food.removeChild(this.food.children[0]);
        }
        while (this.cells.children[0]) {
            this.cells.removeChild(this.cells.children[0]);
        }
        while (this.ejected.children[0]) {
            this.ejected.removeChild(this.ejected.children[0]);
        }
        this.indexedCells.clear();
        this.indexedEjected.clear();
        this.indexedFood.clear();
        this.socketCells.clear();
        this.playerCells.clear();
        this.minimap.reset();
        this.textureGenerator.cellNicksGenerator.clear();
    };
    World.prototype.clearCellsByType = function (subtype) {
        var _this = this;
        var cellsEntries = 0;
        var foodEntries = 0;
        var ejectedEntries = 0;
        if (subtype === 'TOP_ONE_TAB') {
            this.minimap.reset();
        }
        this.indexedCells.forEach(function (cell, key) {
            if (cell.subtype === subtype) {
                _this.cells.removeChild(cell);
                _this.indexedCells.delete(key);
                _this.socketCells.remove(subtype, key);
                _this.playerCells.remove(subtype, key);
                cellsEntries++;
            }
        });
        this.indexedEjected.forEach(function (ejected, key) {
            if (ejected.subtype === subtype) {
                _this.ejected.removeChild(ejected);
                _this.indexedEjected.delete(key);
                _this.socketCells.remove(subtype, key);
                _this.playerCells.remove(subtype, key);
                ejectedEntries++;
            }
        });
        this.indexedFood.forEach(function (food, key) {
            if (food.subtype === subtype) {
                _this.food.removeChild(food);
                _this.indexedFood.delete(key);
                _this.socketCells.remove(subtype, key);
                foodEntries++;
            }
        });
        if (cellsEntries || foodEntries) {
            this.logger.info("[" + subtype + "] disconnected. Food: " + foodEntries + ", cells: " + cellsEntries + ", ejected - " + ejectedEntries);
        }
    };
    World.prototype.setMultiboxTabRingsActive = function (tabType) {
        if (tabType === 'FIRST_TAB') {
            if (!PlayerState_1.default.second.playing) {
                this.playerCells.firstTab.forEach(function (cell) { return cell.setIsFoucsedTab(false); });
            }
            else {
                this.playerCells.firstTab.forEach(function (cell) { return cell.setIsFoucsedTab(true); });
                this.playerCells.secondTab.forEach(function (cell) { return cell.setIsFoucsedTab(false); });
            }
        }
        else {
            if (!PlayerState_1.default.first.playing) {
                this.playerCells.secondTab.forEach(function (cell) { return cell.setIsFoucsedTab(false); });
            }
            else {
                this.playerCells.firstTab.forEach(function (cell) { return cell.setIsFoucsedTab(false); });
                this.playerCells.secondTab.forEach(function (cell) { return cell.setIsFoucsedTab(true); });
            }
        }
    };
    return World;
}());
exports.default = World;
