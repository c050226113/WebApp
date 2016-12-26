var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BackGround = (function (_super) {
    __extends(BackGround, _super);
    function BackGround() {
        var _this = _super.call(this) || this;
        _this.width = 750;
        _this.height = 1206;
        Laya.init(_this.width, _this.height, Laya.WebGL); //, Laya.WebGL
        var background = new Laya.Sprite();
        background.loadImage('./res/background.jpg?20161212');
        Laya.stage.addChild(background);
        return _this;
    }
    return BackGround;
}(Laya.Sprite));
//# sourceMappingURL=BackGround.js.map