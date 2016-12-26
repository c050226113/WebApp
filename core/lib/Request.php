<?php
namespace core\lib;

use core\App;

class Request{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Request();
        }
        return self::$self;
    }
    
    public function getBaseUrl(){
        return preg_replace('#index\.php#is','',$_SERVER["SCRIPT_NAME"]);
    }

    public function isPost(){
        return (isset(App::getInstance()->getRequest()->post) && count(App::getInstance()->getRequest()->post))? true:false;
    }

    public function isGet(){
        return (isset(App::getInstance()->getRequest()->get) && count(App::getInstance()->getRequest()->get))? true:false;
    }

    public function hasGet($key){
        return (isset(App::getInstance()->getRequest()->get[$key]) && (App::getInstance()->getRequest()->get[$key]))? (App::getInstance()->getRequest()->get[$key]):"";
    }

    public function hasPost($key){
        return (isset(App::getInstance()->getRequest()->post[$key]) && (App::getInstance()->getRequest()->post[$key]))? (App::getInstance()->getRequest()->post[$key]):"";
    }

    public function hasCookie($key){
        return (isset(App::getInstance()->getRequest()->cookie[$key]) && (App::getInstance()->getRequest()->cookie[$key]))? (App::getInstance()->getRequest()->cookie[$key]):"";
    }

    public function hasSession($key){
        return (isset(App::getInstance()->getSESSION()[$key]) && (App::getInstance()->getSESSION()[$key]))? (App::getInstance()->getSESSION()[$key]):"";
    }
}