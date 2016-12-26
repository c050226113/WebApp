var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Study = (function (_super) {
    __extends(Study, _super);
    function Study(box) {
        var _this = _super.call(this) || this;
        // 添加手势
        _this.hand = new Laya.Sprite();
        _this.hand.loadImage('./res/ui/hand.png?20161212');
        _this.hand.x = 473;
        _this.hand.y = 468;
        _this.hand.scale(0, 0);
        box.addChild(_this.hand);
        // 添加tip1
        _this.tip1 = new Laya.Sprite();
        _this.tip1.loadImage('./res/ui/tip1.png?20161212');
        _this.tip1.x = 200;
        _this.tip1.y = 25;
        _this.tip1.scale(0, 0);
        box.addChild(_this.tip1);
        // 添加tip2
        _this.tip2 = new Laya.Sprite();
        _this.tip2.loadImage('./res/ui/tip2.png?20161212');
        _this.tip2.x = 135;
        _this.tip2.y = 935;
        _this.tip2.scale(0, 0);
        box.addChild(_this.tip2);
        // 添加tip3
        _this.tip3 = new Laya.Sprite();
        _this.tip3.loadImage('./res/ui/tip3.png?20161212');
        _this.tip3.x = 515;
        _this.tip3.y = 927;
        _this.tip3.scale(0, 0);
        box.addChild(_this.tip3);
        // 添加tip4
        _this.tip4 = new Laya.Sprite();
        _this.tip4.loadImage('./res/ui/tip4.png?20161212');
        _this.tip4.x = 250;
        _this.tip4.y = 480;
        _this.tip4.scale(0, 0);
        box.addChild(_this.tip4);
        return _this;
        // 放大 25z
        // 等待 100z
        // 移动 387 164 75z
        // 移动 180 1050 100z
        // 移动 607 1037 75z
        // 移动 397 640 80z
    }
    return Study;
}(Laya.Sprite));
//# sourceMappingURL=Study.js.map