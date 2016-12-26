var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fish = (function (_super) {
    __extends(Fish, _super);
    function Fish() {
        var _this = _super.call(this) || this;
        _this.i = 0;
        _this.speedXs = [2.2, 2.4, 2.6, 3];
        _this.widths = [39, 64, 120, 140];
        _this.isPositive = Math.random() > 0.5 ? true : false;
        _this.volumeRadius = 18;
        _this.posX = 0;
        _this.posY = 0;
        _this.hasCalculated = false;
        _this.hasReturned = false;
        _this.hasDetected = false;
        _this.isCautious = Math.random() > 0.4 ? true : false;
        _this.isReturn = false;
        _this.isDead = false;
        _this.isHungry = null;
        _this.poolMin = 500;
        _this.poolSection = 430;
        _this.poolMax = _this.poolMin + _this.poolSection;
        _this.t1loaded = false;
        _this.t2loaded = false;
        _this.t3loaded = false;
        _this.t4loaded = false;
        if (!Fish.cached) {
            Fish.cached = true;
            Fish.templet1 = new Laya.Templet();
            Fish.templet1.loadAni('./res/spine/yu01/yu01.sk?20161212');
            Fish.templet1.on(Laya.Event.COMPLETE, _this, function () {
                this.t1loaded = true;
            });
            Fish.templet2 = new Laya.Templet();
            Fish.templet2.loadAni('./res/spine/yu02/yu02.sk?20161212');
            Fish.templet2.on(Laya.Event.COMPLETE, _this, function () {
                this.t2loaded = true;
            });
            Fish.templet3 = new Laya.Templet();
            Fish.templet3.loadAni('./res/spine/yu03/yu03.sk?20161212');
            Fish.templet3.on(Laya.Event.COMPLETE, _this, function () {
                this.t3loaded = true;
            });
            Fish.templet4 = new Laya.Templet();
            Fish.templet4.loadAni('./res/spine/yu04/yu04.sk?20161212');
            Fish.templet4.on(Laya.Event.COMPLETE, _this, function () {
                this.t4loaded = true;
            });
        }
        return _this;
    }
    ;
    Fish.prototype.skeleton1 = function () {
        this.fish = Fish.templet1.buildArmature(1);
        this.fish.x = this.posX;
        this.fish.y = this.posY;
        if (!this.isPositive)
            this.fish.scaleX = -1;
        this.fish.play(1, true);
        this.addChild(this.fish);
    };
    Fish.prototype.skeleton2 = function () {
        this.fish = Fish.templet2.buildArmature(1);
        this.fish.x = this.posX;
        this.fish.y = this.posY;
        if (!this.isPositive)
            this.fish.scaleX = -1;
        this.fish.play(1, true);
        this.addChild(this.fish);
    };
    Fish.prototype.skeleton3 = function () {
        this.fish = Fish.templet3.buildArmature(1);
        this.fish.x = this.posX;
        this.fish.y = this.posY;
        if (!this.isPositive)
            this.fish.scaleX = -1;
        this.fish.play(1, true);
        this.addChild(this.fish);
    };
    Fish.prototype.skeleton4 = function () {
        this.fish = Fish.templet4.buildArmature(1);
        this.fish.x = this.posX;
        this.fish.y = this.posY;
        if (!this.isPositive)
            this.fish.scaleX = -1;
        this.fish.play(1, true);
        this.addChild(this.fish);
    };
    Fish.prototype.init = function (type) {
        this.type = type;
        this.speedX = this.speedXs[type];
        var r = Math.random();
        this.towards = r > 0.82 ? 0 : r > 0.41 ? 1 : 2;
        this.posY = this.poolSection * Math.random() + this.poolMin;
        if (this.isPositive) {
            this.posX = -this.widths[type];
            switch (this.type) {
                case 0:
                    this.skeleton1();
                    this.offsetX = this.posX + 20;
                    this.offsetY = this.posY - 35;
                    break;
                case 1:
                    this.skeleton2();
                    this.offsetX = this.posX + 42;
                    this.offsetY = this.posY - 30;
                    break;
                case 2:
                    this.skeleton3();
                    this.offsetX = this.posX + 95;
                    this.offsetY = this.posY - 10;
                    break;
                case 3:
                    this.skeleton4();
                    this.offsetX = this.posX + 82;
                    this.offsetY = this.posY - 35;
                    break;
            }
        }
        else {
            this.posX = 750 + this.widths[type];
            switch (this.type) {
                case 0:
                    this.skeleton1();
                    this.offsetX = this.posX - 20;
                    this.offsetY = this.posY - 35;
                    break;
                case 1:
                    this.skeleton2();
                    this.offsetX = this.posX - 42;
                    this.offsetY = this.posY - 30;
                    break;
                case 2:
                    this.skeleton3();
                    this.offsetX = this.posX - 95;
                    this.offsetY = this.posY - 10;
                    break;
                case 3:
                    this.skeleton4();
                    this.offsetX = this.posX - 82;
                    this.offsetY = this.posY - 35;
                    break;
            }
        }
        // this.graphics.drawCircle(this.offsetX, this.offsetY, this.volumeRadius, '#000', '#000');
    };
    Fish.prototype.createFish = function (box) {
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.init(this.getType());
        box.addChild(fish);
    };
    Fish.prototype.die = function () {
        switch (this.type) {
            case 0:
                this.posX += this.isPositive ? 56 : 10;
                this.fish.pos(this.posX, this.posY);
                break;
            case 1:
                this.posX += this.isPositive ? 80 : -5;
                this.fish.pos(this.posX, this.posY + 30);
                break;
            case 2:
                this.posX += this.isPositive ? 120 : -70;
                this.fish.pos(this.posX, this.posY + 100);
                break;
            case 3:
                this.posX += this.isPositive ? 125 : -40;
                this.fish.pos(this.posX, this.posY + 62);
                break;
        }
        this.fish.scaleX = 1;
        this.fish.rotation -= 90;
        this.fish.play(0, true);
    };
    Fish.prototype.turnAround = function () {
        if (!this.isDead) {
            this.fish.scaleX = this.isPositive ? 1 : -1;
            setTimeout((function () {
                this.fish.play(3, false);
            }).bind(this), Math.random() * 450 + 50);
            setTimeout((function () {
                switch (this.type) {
                    case 0:
                        this.offsetX += this.isPositive ? 40 : -42;
                        break;
                    case 1:
                        this.offsetX += this.isPositive ? 80 : -82;
                        break;
                    case 2:
                        this.offsetX += this.isPositive ? 190 : -190;
                        break;
                    case 3:
                        this.offsetX += this.isPositive ? 164 : -164;
                        break;
                }
                // this.graphics.drawCircle(this.offsetX, this.offsetY, this.volumeRadius, '#555', '#555');
                this.fish.play(1, true);
            }).bind(this), Math.random() * 100 + 50);
        }
    };
    Fish.prototype.study = function (box) {
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isPositive = true;
        fish.init(0);
        fish.x = -fish.posX + 210;
        fish.y = -fish.posY + 570;
        box.addChild(fish);
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isPositive = true;
        fish.init(1);
        fish.x = -fish.posX + 400;
        fish.y = -fish.posY + 670;
        box.addChild(fish);
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isPositive = true;
        fish.init(2);
        fish.x = -fish.posX + 200;
        fish.y = -fish.posY + 720;
        box.addChild(fish);
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isPositive = true;
        fish.init(3);
        fish.x = -fish.posX + 300;
        fish.y = -fish.posY + 860;
        box.addChild(fish);
    };
    Fish.prototype.createASpecial = function (box, x, baifsetY, speed) {
        var position = 50;
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isHungry = true;
        fish.isPositive = true;
        fish.init(Math.floor(Math.random() * 4));
        fish.x = -fish.offsetX - position;
        fish.y = this.poolMin + this.poolSection / 2 - fish.offsetY;
        fish.speedX = (position + x) / (this.poolMax - baifsetY + this.poolSection / 2) * speed;
        box.addChild(fish);
    };
    Fish.prototype.poolFish = function (i, box) {
        var fish = Laya.Pool.getItemByClass('fish', Fish);
        fish.isPositive = i % 2 === 0 ? false : true;
        fish.init(this.getType());
        box.addChild(fish);
    };
    Fish.prototype.getType = function () {
        var r = Math.random();
        var type = r > 0.9 ? 3 : r < 0.3 ? 0 : r < 0.6 ? 1 : 2;
        return type;
    };
    return Fish;
}(Laya.Sprite));
Fish.cached = false;
//# sourceMappingURL=Fish.js.map