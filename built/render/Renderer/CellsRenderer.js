"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerState_1 = __importDefault(require("../../states/PlayerState"));
var SettingsState_1 = __importDefault(require("../../states/SettingsState"));
var CellsRenderer = /** @class */ (function () {
    function CellsRenderer(world) {
        this.world = world;
    }
    CellsRenderer.prototype.checkCellRender = function (cell, visible) {
        var _a = this.world.view, firstTab = _a.firstTab, secondTab = _a.secondTab;
        var type = cell.type, x = cell.x, y = cell.y;
        var isPlayerCell = false;
        if (PlayerState_1.default.first.playing && firstTab.hasInViewBounds(x, y)) {
            visible = false;
        }
        if (PlayerState_1.default.second.playing && secondTab.hasInViewBounds(x, y)) {
            visible = false;
        }
        if (PlayerState_1.default.first.playing && type === 'CELL' && this.world.playerCells.isFirstTab(cell)) {
            visible = false;
            isPlayerCell = true;
        }
        if (PlayerState_1.default.second.playing && type === 'CELL' && this.world.playerCells.isSecondTab(cell)) {
            visible = false;
            isPlayerCell = true;
        }
        return [visible, isPlayerCell];
    };
    CellsRenderer.prototype.render = function (cell) {
        if (this.world.view.shouldObjectBeCulled(cell.x, cell.y, cell.width / 2)) {
            cell.renderable = cell.visible = false;
            cell.culled = true;
            return;
        }
        else {
            cell.renderable = cell.visible = true;
            cell.culled = false;
        }
        // if cell subtype is TOP_ONE_TAB or SPEC_TABS and it is a player cell
        // its visibility should be immediately set to false 
        // (we dont have to wait until its opacity slowly goes down - it will make it look ugly)
        var isPrivateServer = this.world.master.gameMode.get() === ':private';
        var fullMapViewEnabled = this.world.settings.all.settings.game.gameplay.spectatorMode === 'Full map';
        var topOneViewEnabled = this.world.settings.all.settings.game.gameplay.spectatorMode === 'Top one';
        var subtype = cell.subtype, type = cell.type, x = cell.x, y = cell.y;
        var _a = this.world.view, firstTab = _a.firstTab, secondTab = _a.secondTab, topOneTab = _a.topOneTab;
        // only triggers if top one view is enabled or full map view is enabled
        if (subtype === 'TOP_ONE_TAB') {
            if (type === 'VIRUS' || type === 'REMOVE_ANIMATION') {
                cell.setIsVisible(!fullMapViewEnabled);
                cell.visible = !fullMapViewEnabled;
            }
            else {
                var _b = __read(this.checkCellRender(cell, true), 2), visible = _b[0], isPlayerCell = _b[1];
                cell.visible = isPlayerCell ? false : true;
                cell.setIsVisible(visible);
            }
        }
        // only triggers if full map view is enabled
        if (subtype === 'SPEC_TABS') {
            if (type === 'CELL') {
                var _c = __read(this.checkCellRender(cell, true), 2), visible = _c[0], isPlayerCell = _c[1];
                cell.visible = isPlayerCell ? false : true;
                cell.setIsVisible(visible);
                if (visible) {
                    if (topOneTab.hasInViewBounds(x, y)) {
                        cell.setIsVisible(false);
                    }
                    else {
                        cell.setIsVisible(true);
                    }
                }
            }
        }
        // only triggers if first tab or second tab is connected
        if (subtype === 'FIRST_TAB' || subtype === 'SECOND_TAB') {
            var visible = true;
            // first tab
            if (subtype === 'FIRST_TAB' && type === 'CELL') {
                if (this.world.playerCells.isSecondTab(cell)) {
                    visible = false;
                } /*  else if (!PlayerState.first.playing) {
                  visible = false;
                } */
            }
            // second tab
            if (subtype === 'SECOND_TAB' && type === 'CELL') {
                if (this.world.playerCells.isFirstTab(cell)) {
                    visible = false;
                } /* else if (!PlayerState.second.playing) {
                  visible = false;
                } */
            }
            if (type === 'VIRUS') {
                if (fullMapViewEnabled && !isPrivateServer) {
                    visible = false;
                }
                else if (this.world.settings.all.settings.game.multibox.enabled) {
                    if (PlayerState_1.default.first.playing && PlayerState_1.default.second.playing) {
                        if (subtype === 'SECOND_TAB') {
                            visible = !firstTab.hasInViewBounds(x, y);
                        }
                        if (topOneViewEnabled && visible) {
                            visible = !topOneTab.hasInViewBounds(x, y);
                        }
                    }
                    else {
                        if (subtype === 'FIRST_TAB') {
                            visible = PlayerState_1.default.first.playing;
                        }
                        if (subtype === 'SECOND_TAB') {
                            visible = PlayerState_1.default.second.playing;
                        }
                    }
                }
                else if (topOneViewEnabled && !isPrivateServer) {
                    visible = !topOneTab.hasInViewBounds(x, y);
                }
                else {
                    visible = true;
                }
            }
            if (type === 'REMOVE_ANIMATION' && fullMapViewEnabled) {
                visible = false;
            }
            cell.visible = visible;
            cell.setIsVisible(visible);
        }
        if (fullMapViewEnabled && !SettingsState_1.default.fullMapViewRender) {
            if (isPrivateServer) {
                return;
            }
            var visible = cell.isVisible;
            if (type === 'VIRUS' && subtype === 'SPEC_TABS') {
                visible = true;
            }
            else if (type === 'REMOVE_ANIMATION' && subtype === 'SPEC_TABS') {
                visible = this.world.settings.all.settings.game.effects.cellRemoveAnimationForHiddenSpectator;
            }
            else if (subtype === 'TOP_ONE_TAB' || subtype === 'SPEC_TABS') {
                if (type === 'CELL') {
                    visible = false;
                }
            }
            else if (type === 'SPAWN_ANIMATION') {
                visible = true;
            }
            if (!this.world.settings.all.settings.game.multibox.enabled) {
                if (subtype === 'FIRST_TAB') {
                    visible = true;
                }
            }
            if (subtype === 'FIRST_TAB' && type === 'VIRUS') {
                visible = false;
                cell.visible = false;
            }
            if (type === 'VIRUS' || type === 'CELL') {
                cell.setIsVisible(visible);
            }
            else {
                cell.visible = visible;
            }
        }
    };
    return CellsRenderer;
}());
exports.default = CellsRenderer;
