"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FoodRenderer = /** @class */ (function () {
    function FoodRenderer(world) {
        this.world = world;
    }
    FoodRenderer.prototype.render = function (food) {
        var isPrivateServer = this.world.master.gameMode.get() === ':private';
        if (isPrivateServer) {
            food.show();
            return;
        }
        if (this.world.settings.all.settings.game.performance.culling) {
            if (this.world.view.shouldObjectBeCulled(food.x, food.y, food.width / 2)) {
                food.culled = true;
                food.renderable = false;
                return;
            }
            else {
                food.culled = false;
                food.renderable = true;
            }
        }
        if (this.world.settings.all.settings.game.gameplay.spectatorMode === 'Full map') {
            food.subtype === 'SPEC_TABS' ? food.show() : food.hide();
            return;
        }
        var _a = this.world.settings.all.settings.theming.food, firstTabEnabled = _a.firstTabEnabled, secondTabEnabled = _a.secondTabEnabled, topOneTabEnabled = _a.topOneTabEnabled;
        var _b = this.world.view, firstTab = _b.firstTab, secondTab = _b.secondTab, topOneTab = _b.topOneTab;
        var x = food.x, y = food.y, subtype = food.subtype;
        var visible = false;
        // always render first tab
        if (subtype === 'FIRST_TAB' && firstTabEnabled) {
            // if first tabs food has collision with second tab, instantly animate it
            var secondTabHas = secondTab.hasInViewBounds(x, y) && secondTabEnabled;
            secondTabHas && food.show(true);
            // if second tabs food has collision with top one tab, instantly animate it
            var topOneTabHas = topOneTab.hasInViewBounds(x, y) && topOneTabEnabled;
            topOneTabHas && food.show(true);
            visible = true;
        }
        // check second tab for collision with first tab
        if (subtype === 'SECOND_TAB' && secondTabEnabled) {
            var firstTabHas = firstTab.hasInViewBounds(x, y) && firstTabEnabled;
            visible = !firstTabHas;
        }
        // check top one tab for collision with first and second tab
        if (subtype === 'TOP_ONE_TAB' && topOneTabEnabled) {
            var firstTabHas = firstTab.hasInViewBounds(x, y) && firstTabEnabled;
            var secondTabHas = secondTab.hasInViewBounds(x, y) && secondTabEnabled;
            // visible if none of tabs has
            visible = !firstTabHas && !secondTabHas;
        }
        visible ? food.show() : food.hide();
    };
    return FoodRenderer;
}());
exports.default = FoodRenderer;
