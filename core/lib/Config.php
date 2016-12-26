<?php
namespace core\lib;
use Exception;

class Config{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Config();
        }
        return self::$self;
    }

    private $config = [];

    public function getConf($fileName,$key){
        $confArr = Util::getInstance()->hasArr($this->config,$fileName);
        if($confArr){
            return $confArr[$key];
        }else{
            $path=ROOT_DIR."core/config/".$fileName.".php";
            if(is_file($path)){
                $confArr = require_once($path."");
                $this->config[$fileName] = $confArr;
                return $confArr[$key];
            }else{
                throw new Exception("没有找到该配置文件".$path);
            }
        }
    }

    public function getConfArr($fileName){
        $confArr = Util::getInstance()->hasArr($this->config,$fileName);
        if($confArr){
            return $confArr;
        }else{
            $path=ROOT_DIR."core/config/".$fileName.".php";
            if(is_file($path)){
                $confArr = require_once($path."");
                $this->config[$fileName] = $confArr;
                return $confArr;
            }else{
                throw new Exception("没有找到该配置文件".$path);
            }
        }
    }
}