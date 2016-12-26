var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bubble = (function (_super) {
    __extends(Bubble, _super);
    // private scaleSize = Math.random() * 0.15 + 0.05;
    // private offset = 0.0009;
    function Bubble() {
        var _this = _super.call(this) || this;
        var r = Math.random();
        if (r > 0.5) {
            // if (r > 0.98) this.offset = 0.0004
            _this.y = 1010;
            _this.x = Math.random() * 750;
            _this.loadImage("./res/ui/bubble.png?20161212");
            // this.scale(this.scaleSize, this.scaleSize);
            Laya.stage.addChild(_this);
            Laya.timer.frameLoop(1, _this, _this.up);
        }
        return _this;
        // var templet1 = new Laya.Templet();
        // templet1.loadAni('res/spine/pao/pao.sk');
        // templet1.on(Laya.Event.COMPLETE, this, function(){
        //     var pao = templet1.buildArmature(1); 
        //     pao.x = 300;
        //     pao.y = 1000;
        //     pao.play(0, true);
        //     // pao(fish);
        //     Laya.stage.addChild(pao);
        // });
        // console.log(templet1)
    }
    Bubble.prototype.up = function () {
        this.y -= 3;
        this.x += Math.sin(this.y * Math.PI / 180);
        // this.scaleSize += this.offset;
        // this.scale(this.scaleSize, this.scaleSize);
        if (this.y <= 380) {
            this.destroy();
        }
    };
    return Bubble;
}(Laya.Sprite));
//# sourceMappingURL=Bubble.js.map