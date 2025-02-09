"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pixi_js_1 = require("pixi.js");
var Shadow = /** @class */ (function () {
    function Shadow(cellSprite, cell) {
        this.cellSprite = cellSprite;
        this.cell = cell;
        this.TEXTURE_OFFSET = this.cell.world.textureGenerator.cellShadow.width / this.cell.world.textureGenerator.cell.width;
        this.sprite = new pixi_js_1.Sprite(this.cell.world.textureGenerator.cellShadow);
        this.sprite.anchor.set(0.5);
        this.sprite.zIndex = 1;
    }
    Shadow.prototype.setSize = function (size) {
        this.sprite.width = size * this.TEXTURE_OFFSET;
        this.sprite.height = size * this.TEXTURE_OFFSET;
    };
    Shadow.prototype.update = function () {
        var shadow = this.cell.world.settings.all.settings.game.cells.shadow;
        if (this.cell.isMinimap || this.cell.width <= 70) {
            this.sprite.visible = this.sprite.renderable = false;
        }
        else if (shadow === 'All') {
            this.sprite.visible = this.sprite.renderable = true;
        }
        else if (shadow === 'Disabled') {
            this.sprite.visible = this.sprite.renderable = false;
        }
        else if (shadow === 'Only me') {
            this.sprite.visible = this.sprite.renderable = this.cell.isPlayerCell;
        }
    };
    Shadow.prototype.updateTexture = function () {
        if (this.cell.isPlayerCell) {
            this.sprite.texture = this.cell.world.textureGenerator.myCellShadow;
            this.TEXTURE_OFFSET = this.cell.world.textureGenerator.myCellShadow.width / this.cell.world.textureGenerator.cell.width;
        }
        else {
            this.sprite.texture = this.cell.world.textureGenerator.cellShadow;
            this.TEXTURE_OFFSET = this.cell.world.textureGenerator.cellShadow.width / this.cell.world.textureGenerator.cell.width;
        }
        this.sprite.width = this.sprite.height = this.cellSprite.width * this.TEXTURE_OFFSET;
    };
    return Shadow;
}());
exports.default = Shadow;
