<?php
namespace core;
use core\lib\app\NormalApp;
use core\lib\app\SwooleApp;
use MongoDB\BSON\UTCDateTime;

class App
{
    private static $self;
    private function __construct(){}
    public static function getInstance()
    {
        if (!self::$self) {
            if (defined("IS_SWOOLE")) {
                self::$self = new SwooleApp();
            } else {
                self::$self = new NormalApp();
            }
        }
        return self::$self;
    }
}