var Game = (function () {
    function Game(mode, music, study, succ, fail, cover, countdown, countdownNum) {//全局game 对象
        this.shipLMoving = false;
        this.shipRMoving = false;
        this.baitDMoving = false;
        this.baitUMoving = false;
        this.isStart = false;
        this.time = 11;
        // Sound
        this.silent = false;
        this.gamePaused = false;
        // 计数器
        this.i = 0;
        this.i_ = 0;
        this.MP3S = {
            bgm: 'res/music/bgm.mp3?20161212',
            moving: 'res/music/moving.mp3?20161212',
            hook: 'res/music/hook.mp3?20161212',
            fail: 'res/music/fail.mp3?20161212',
            succ: 'res/music/succ.mp3?20161212',
        };
        // 接口处理
        this.mode = mode;
        // 初始化页面DOM
        this.DOMsucc = succ;
        this.DOMfail = fail;
        this.DOMstudy = study;
        this.DOMmusic = music;
        this.DOMcover = cover;
        this.DOMcountdown = countdown;
        this.DOMcountdownNum = countdownNum;
        // 加载背景
        this.background = new BackGround();
        // 添加图层
        this.fishBox = new Laya.Sprite();
        Laya.stage.addChild(this.fishBox);
        this.lineBox = new Laya.Sprite();
        Laya.stage.addChild(this.lineBox);
        this.baitBox = new Laya.Sprite();
        Laya.stage.addChild(this.baitBox);
        this.baitBox.zOrder = 1;
        this.lineBox.zOrder = 2;
        this.fishBox.zOrder = 3;
        // 加载音乐
        Laya.SoundManager.playMusic(this.MP3S.bgm, 0);
        Laya.SoundManager.playSound(this.MP3S.moving, 0);
        Laya.SoundManager.playSound(this.MP3S.hook, 0);
        Laya.SoundManager.setSoundVolume(0, this.MP3S.moving);
        Laya.SoundManager.setSoundVolume(0, this.MP3S.hook);
        // 加载UI
        this.ui = new Ui();
        this.bait = new Bait(this.baitBox);
        this.fish = new Fish();
        this.line = new Line();
        // 绑定事件
        this.ui.left.on(Laya.Event.MOUSE_DOWN, this, function () {
            if (!this.baitDMoving && !this.baitUMoving) {
                this.shipLMoving = true;
                this.shipRMoving = false;
            }
        });
        this.ui.right.on(Laya.Event.MOUSE_DOWN, this, function () {
            if (!this.baitDMoving && !this.baitUMoving) {
                this.shipRMoving = true;
                this.shipLMoving = false;
            }
        });
        this.ui.left.on(Laya.Event.MOUSE_UP, this, function () {
            this.shipLMoving = false;
            this.shipRMoving = false;
        });
        this.ui.right.on(Laya.Event.MOUSE_UP, this, function () {
            this.shipLMoving = false;
            this.shipRMoving = false;
        });
        this.ui.launch.on(Laya.Event.MOUSE_DOWN, this, function () {
            // this.interfaceCls.get_redirect_url()
            this.launch();
        });
        Laya.stage.on(Laya.Event.BLUR, this, this.gamePause);
        Laya.stage.on(Laya.Event.FOCUS, this, this.gameRsume);
        // 初始化常量
        this.baitLLimit = this.bait.volumeRadius - this.bait.offsetX;
        this.baitRLimit = this.background.width - this.bait.volumeRadius - this.bait.offsetX;
        this.attackDistance = this.bait.volumeRadius + this.fish.volumeRadius;
        this.escapeDistance = this.attackDistance + 60;
        this.baitDownLimit = this.fish.poolMax - this.bait.offsetY;
        //开始教程
        this.study = new Study(this.fishBox);
        this.studyStart_();
        // 适配屏幕 铺满全屏
        Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        // 显示帧数
        Laya.Stat.show();
    }
    Game.prototype.studyStart_ = function () {
        Laya.timer.frameLoop(1, this, this.studyStart);
    };
    // 教程循环
    Game.prototype.studyStart = function () {
        if (!this.gamePaused) {
            this.i++;
            if (this.i <= 25) {
                this.study.hand.scale(this.i * 0.04, this.i * 0.04);
            }
            if (this.i > 75 && this.i <= 100) {
                this.study.tip1.scale((this.i - 75) * 0.04, (this.i - 75) * 0.04);
            }
            if (this.i > 25 && this.i <= 100) {
                this.study.hand.x -= 1.17;
                this.study.hand.y -= 4;
            }
            if (this.i > 275 && this.i <= 300) {
                this.study.tip2.scale((this.i - 275) * 0.04, (this.i - 275) * 0.04);
            }
            if (this.i > 200 && this.i <= 300) {
                this.study.hand.x -= 1.95;
                this.study.hand.y += 8.82;
            }
            if (this.i > 450 && this.i <= 475) {
                this.study.tip3.scale((this.i - 450) * 0.04, (this.i - 450) * 0.04);
            }
            if (this.i > 400 && this.i <= 475) {
                this.study.hand.x += 5.6;
                this.study.hand.y -= 0.14;
            }
            if (this.i > 630 && this.i <= 655) {
                this.study.tip4.scale((this.i - 630) * 0.04, (this.i - 630) * 0.04);
            }
            if (this.i > 575 && this.i <= 655) {
                if (this.i === 576)
                    this.fish.study(this.fishBox);
                this.study.hand.x -= 2.6;
                this.study.hand.y -= 4.88;
            }
            if (this.i > 755) {
                this.gameStart();
            }
        }
    };
    // 鱼生成循环
    Game.prototype.fishCreate = function () {
        if (!this.gamePaused && this.fish.t1loaded && this.fish.t2loaded && this.fish.t3loaded && this.fish.t4loaded) {
            this.i_++;
            this.fish.poolFish(this.i_, this.fishBox);
            if (this.i_ >= 8)
                Laya.timer.clear(this, this.fishCreate);
        }
    };
    Game.prototype.gameStart = function () {
        // this.interfaceCls.nodeUp(10300);
        this.shipLMoving = false;
        this.shipRMoving = false;
        this.baitDMoving = false;
        this.baitUMoving = false;
        this.i = 0;
        this.i_ = 0;
        this.bait.isDead = false;
        this.gamePaused = false;
        this.isStart = true;
        this.DOMstudy.addClass('none');
        for (var i = this.fishBox.numChildren - 1; i >= 0; i--) {
            this.fishBox.getChildAt(i).removeSelf();
        }
        Laya.timer.clear(this, this.studyStart);
        Laya.timer.frameLoop(1, this, this.gameLoop);
        Laya.timer.frameLoop(10, this, this.createBubble);
        Laya.timer.frameLoop(50, this, this.fishCreate);
    };
    Game.prototype.createBubble = function () {
        new Bubble();
    };
    Game.prototype.gameLoop = function () {
        if (!this.gamePaused) {
            this.mainLoop();
        }
    };
    Game.prototype.mainLoop = function () {
        if (this.shipLMoving || this.shipRMoving) {
            if (this.silent) {
                Laya.SoundManager.setSoundVolume(0, this.MP3S.moving);
            }
            else {
                Laya.SoundManager.setSoundVolume(1, this.MP3S.moving);
            }
            if (this.shipLMoving) {
                if (this.bait.x - this.ui.shipSpeed < this.baitLLimit) {
                    this.shipLMoving = false;
                }
                else {
                    this.ui.ship.x -= this.ui.shipSpeed;
                    this.ui.rod.x -= this.ui.shipSpeed;
                    this.bait.x -= this.ui.shipSpeed;
                    this.line.offsetX -= this.ui.shipSpeed;
                }
            }
            if (this.shipRMoving) {
                if (this.bait.x + this.ui.shipSpeed > this.baitRLimit) {
                    this.shipRMoving = false;
                }
                else {
                    this.ui.ship.x += this.ui.shipSpeed;
                    this.ui.rod.x += this.ui.shipSpeed;
                    this.bait.x += this.ui.shipSpeed;
                    this.line.offsetX += this.ui.shipSpeed;
                }
            }
        }
        else {
            Laya.SoundManager.setSoundVolume(0, this.MP3S.moving);
        }
        if (this.baitDMoving || this.baitUMoving) {
            if (this.silent) {
                Laya.SoundManager.setSoundVolume(0, this.MP3S.hook);
            }
            else {
                Laya.SoundManager.setSoundVolume(1, this.MP3S.hook);
            }
            if (this.baitDMoving) {
                if (this.bait.y >= this.baitDownLimit) {
                    this.baitUMoving = true;
                    this.baitDMoving = false;
                }
                else {
                    this.bait.y += this.bait.speed;
                    this.bait.ymoved = true;
                }
            }
            if (this.baitUMoving) {
                if (this.bait.y - this.bait.speed <= 0) {
                    this.bait.y = 0;
                    this.baitUMoving = false;
                    this.bait.ymoved = false;
                    this.gameOver();
                }
                else {
                    this.bait.y -= this.bait.speed;
                }
            }
        }
        var lineNum = this.lineBox.numChildren;
        if (lineNum === 0) {
            if (this.baitDMoving && !this.baitUMoving && this.bait.ymoved)
                this.line.create(this.lineBox);
        }
        else {
            for (var j = lineNum - 1; j >= 0; j--) {
                var line = this.lineBox.getChildAt(j);
                if (this.baitDMoving && !this.baitUMoving && this.bait.ymoved)
                    line.y += this.bait.speed;
                if (this.shipLMoving)
                    line.x -= this.ui.shipSpeed;
                if (this.shipRMoving)
                    line.x += this.ui.shipSpeed;
                if (j === 0) {
                    if (this.baitUMoving && !this.baitDMoving && this.bait.ymoved)
                        line.removeSelf();
                    if (this.baitDMoving && !this.baitUMoving && this.bait.ymoved)
                        this.line.create(this.lineBox);
                    if (!this.baitDMoving && !this.baitUMoving && !this.bait.ymoved)
                        line.removeSelf();
                }
            }
        }
        var bait = this.baitBox.getChildAt(0);
        var fishNum = this.fishBox.numChildren;
        for (var i = fishNum - 1; i >= 0; i--) {
            var fish = this.fishBox.getChildAt(i);
            fish.i++;
            var bx = bait.x + bait.offsetX;
            var by = bait.y + bait.offsetY;
            var fx = fish.x + fish.offsetX;
            var fy = fish.y + fish.offsetY;
            switch (this.mode) {
                case 0:
                    fish.isCautious = false;
                    if (!fish.hasReturned) {
                        if (this.baitDMoving) {
                            if (fish.isPositive && fx < bx && fy > by) {
                                var t = Math.abs(by - fy) / bait.speed;
                                var d = fish.speedX * t;
                                var distanceX = bx - fx;
                                if (Math.abs(fx + d - bx) < 50) {
                                    if (distanceX <= 155) {
                                        fish.isPositive = !fish.isPositive;
                                        fish.turnAround();
                                        fish.hasReturned = true;
                                    }
                                }
                            }
                            if (!fish.isPositive && fx > bx && fy > by) {
                                var t = Math.abs(by - fy) / bait.speed;
                                var d = fish.speedX * t;
                                var distanceX = fx - bx;
                                if (Math.abs(fx - d - bx) < 50) {
                                    if (distanceX <= 155) {
                                        fish.isPositive = !fish.isPositive;
                                        fish.turnAround();
                                        fish.hasReturned = true;
                                    }
                                }
                            }
                        }
                        if (this.baitUMoving) {
                            if (fish.isPositive && fx < bx && fy < by) {
                                var t = Math.abs(by - fy) / bait.speed;
                                var d = fish.speedX * t;
                                var distanceX = bx - fx;
                                if (Math.abs(fx + d - bx) < 50) {
                                    if (distanceX <= 155) {
                                        fish.isPositive = !fish.isPositive;
                                        fish.turnAround();
                                        fish.hasReturned = true;
                                    }
                                }
                            }
                            if (!fish.isPositive && fx > bx && fy < by) {
                                var t = Math.abs(by - fy) / bait.speed;
                                var d = fish.speedX * t;
                                var distanceX = fx - bx;
                                if (Math.abs(fx - d - bx) < 50) {
                                    if (distanceX <= 155) {
                                        fish.isPositive = !fish.isPositive;
                                        fish.turnAround();
                                        fish.hasReturned = true;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 1:
                    this.fishing(bx, by, fx, fy, this.attackDistance, fish, bait);
                    break;
                case 2:
                    this.fishing(bx, by, fx, fy, this.attackDistance, fish, bait);
                    break;
            }
            if (fish.isCautious && !fish.isHungry) {
                if (Math.abs(bx - fx) < this.escapeDistance && Math.abs(by - fy) < this.escapeDistance) {
                    fish.speedX = 6;
                    setTimeout((function () {
                        this.speedX = this.speedXs[this.type];
                    }).bind(fish), 350);
                    if ((fx < bx && fish.isPositive) || (fx > bx && !fish.isPositive)) {
                        fish.isPositive = !fish.isPositive;
                        fish.turnAround();
                    }
                }
            }
            var r = Math.random();
            if (r > 0.9 && fish.i > 230 && fish.i < 250 && !fish.isHungry && !fish.hasReturned) {
                if (this.baitUMoving && by < fy) {
                    fish.isPositive = !fish.isPositive;
                    fish.turnAround();
                }
                if (!this.baitUMoving && !this.baitDMoving && r > 0.97) {
                    fish.isPositive = !fish.isPositive;
                    fish.turnAround();
                }
            }
            // 状态更新
            var x = fish.x + fish.posX;
            if (x > 900 || x < -150) {
                this.fishBox.removeChild(fish);
                this.fish.createFish(this.fishBox);
            }
            else {
                if (fish.isDead) {
                    fish.x = this.bait.x + bait.offsetX - fish.offsetX;
                    fish.y = this.bait.y + bait.offsetY - fish.offsetY;
                    if (this.baitUMoving)
                        fish.y -= this.bait.speed;
                }
                else {
                    fish.x += fish.isPositive ? fish.speedX : -fish.speedX;
                }
            }
        }
        // 倒计时
        this.i++;
        var time = this.time * 60;
        if (this.i === time - 180)
            this.DOMcountdownNum.eq(0).addClass('on');
        if (this.i === time - 150)
            this.DOMcountdownNum.eq(0).removeClass('on');
        if (this.i === time - 120)
            this.DOMcountdownNum.eq(1).addClass('on');
        if (this.i === time - 90)
            this.DOMcountdownNum.eq(1).removeClass('on');
        if (this.i === time - 60)
            this.DOMcountdownNum.eq(2).addClass('on');
        if (this.i === time - 30)
            this.DOMcountdownNum.eq(2).removeClass('on');
        if (this.i === time)
            this.launch();
    };
    Game.prototype.gameOver = function () {
        // this.interfaceCls.nodeUp(10400);
        this.isStart = false;
        this.gamePause();
        this.DOMcover.removeClass('none');
        if (this.bait.isDead) {
            this.DOMsucc.removeClass('none');
            if (!this.silent)
                Laya.SoundManager.playSound(this.MP3S.succ);
        }
        else {
            // window.onbeforeunload = function () {
            //     location.href = this.interfaceCls.return_url
            // }
            this.DOMfail.removeClass('none');
            if (!this.silent)
                Laya.SoundManager.playSound(this.MP3S.fail);
        }
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.setSoundVolume(0, this.MP3S.hook);
        Laya.timer.clear(this, this.fishCreate);
    };
    Game.prototype.fishing = function (bx, by, fx, fy, attackDistance, fish, bait) {
        if (Math.abs(bx - fx) < attackDistance && Math.abs(by - fy) < attackDistance && !fish.isDead && !bait.isDead) {
            this.baitUMoving = true;
            this.baitDMoving = false;
            fish.isDead = true;
            bait.isDead = true;
            fish.die();
        }
    };
    Game.prototype.gamePause = function () {
        this.gamePaused = true;
        Laya.SoundManager.setSoundVolume(0, this.MP3S.hook);
    };
    Game.prototype.gameRsume = function () {
        this.gamePaused = false;
    };
    Game.prototype.launch = function () {
        if (!this.baitDMoving && !this.baitUMoving && this.isStart) {
            this.DOMcountdown.addClass('none');
            this.baitDMoving = true;
        }
    };
    Game.prototype.shutSound = function () {
        this.silent = true;
        Laya.SoundManager.setMusicVolume(0);
    };
    Game.prototype.playSound = function () {
        this.silent = false;
        Laya.SoundManager.setMusicVolume(1);
    };
    return Game;
}());
//# sourceMappingURL=Game.js.map