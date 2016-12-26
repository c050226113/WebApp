var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
var Game = (function() {
    function Game () {
        this.name = "lalala";
    }
    Game.prototype.publicName = 'publicName';
    Game.prototype.doSomething = function(){
        return 'doSomething-func';
    };
    return Game;
}());

var ChildGame = (function(_super){
    __extends(ChildGame, _super);
    function ChildGame(){

    }

    ChildGame.prototype.ddd = function(){
        return 'ddd';
    };
    return ChildGame;
}(Game));
var game = new Game();
console.log(game.name);
console.log(game.doSomething());
var ch = new ChildGame();
console.log(ch.ddd());
console.log(ch.name);
console.log(ch.publicName);
