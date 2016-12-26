var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Line = (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super.call(this) || this;
        _this.posX = 231;
        _this.posY = 130;
        _this.offsetX = 0;
        return _this;
    }
    Line.prototype.create = function (shipBox) {
        this.line = new Laya.Sprite();
        this.line.loadImage('./res/ui/line3.png?20161212');
        this.line.pos(this.posX + this.offsetX, this.posY);
        shipBox.addChild(this.line);
    };
    return Line;
}(Laya.Sprite));
//# sourceMappingURL=Line.js.map