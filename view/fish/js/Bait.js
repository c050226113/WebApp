var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bait = (function (_super) {
    __extends(Bait, _super);
    function Bait(box) {
        var _this = _super.call(this) || this;
        _this.speed = 4;
        _this.offsetX = 236;
        _this.offsetY = 150;
        _this.posX = 214;
        _this.posY = 130;
        _this.volumeRadius = 11;
        _this.isDead = false;
        _this.ymoved = false;
        _this.bait = new Laya.Sprite();
        _this.bait.loadImage('./res/ui/hook3.png?20161212');
        _this.bait.pos(_this.posX, _this.posY);
        _this.addChild(_this.bait);
        box.addChild(_this);
        return _this;
        // this.graphics.drawCircle(this.offsetX, this.offsetY, this.volumeRadius, null, '#000');
    }
    return Bait;
}(Laya.Sprite));
//# sourceMappingURL=Bait.js.map