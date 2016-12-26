var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Ui = (function (_super) {
    __extends(Ui, _super);
    function Ui() {
        var _this = _super.call(this) || this;
        _this.shipSpeed = 5;
        _this.shipInitX = 226;
        _this.loadShip();
        _this.loadArrow();
        _this.loadLaunch();
        _this.loadRod();
        return _this;
    }
    Ui.prototype.loadArrow = function () {
        this.left = new Laya.Sprite();
        this.right = new Laya.Sprite();
        this.left.loadImage('./res/ui/left.png?20161212');
        this.right.loadImage('./res/ui/right.png?20161212');
        this.left.pos(40, 1031);
        this.right.pos(310, 1031);
        Laya.stage.addChild(this.left);
        Laya.stage.addChild(this.right);
    };
    Ui.prototype.loadShip = function () {
        this.ship = new Laya.Sprite();
        this.ship.loadImage('./res/ui/ship.png?20161212');
        this.ship.pos(this.shipInitX, 63);
        Laya.stage.addChild(this.ship);
    };
    Ui.prototype.loadLaunch = function () {
        this.launch = new Laya.Sprite();
        this.launch.loadImage('./res/ui/launch.png?20161212');
        this.launch.pos(524, 1002);
        Laya.stage.addChild(this.launch);
    };
    Ui.prototype.loadRod = function () {
        this.rod = new Laya.Sprite();
        this.rod.loadImage('./res/ui/rod3.png?20161212');
        this.rod.pos(this.shipInitX, 96);
        Laya.stage.addChild(this.rod);
    };
    return Ui;
}(Laya.Sprite));
//# sourceMappingURL=Ui.js.map