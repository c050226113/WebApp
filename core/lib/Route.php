<?php
namespace core\lib;
use core\App;

class Route{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Route();
        }
        return self::$self;
    }

    public function getRoute(){
        if(!Request::getInstance()->hasGet("r")){
            App::getInstance()->getRequest()->get["r"]="index/index";
        }

        $route = App::getInstance()->getRequest()->get["r"];

        $routeArr = explode("/",$route);
        $ctrl = $routeArr[0]?ucfirst(strtolower($routeArr[0]))."Controller":'IndexController';
        $action = $routeArr[1]?"action".ucfirst(strtolower($routeArr[1])):'actionIndex';

        return array($ctrl,$action);
    }
}