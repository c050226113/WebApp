<?php

namespace server;


use Exception;

class ServerFactory {
    const MODEL_UTIL = 'util';

    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new ServerFactory();
        }
        return self::$self;
    }

    public function createServer(){
        $this->changeUser();
        $this->includeLib();
    }

    private function changeUser(){
        $user = posix_getpwnam('ljm');
        posix_setuid($user['uid']);
        posix_setgid($user['gid']);
    }

    private function includeLib(){
        $dirArr = [CORE_DIR.'include/',CORE_DIR.'lib/',CORE_DIR.'delegate/'];
        $modelDir = ROOT_DIR.'app/model/';
        $modelDirArr = scandir($modelDir);
        $nameLength = count($modelDirArr);
        for( $index = 2; $index<$nameLength; $index++){
            if(is_dir($modelDir.$modelDirArr[$index]) && is_dir($modelDir.$modelDirArr[$index].'/'.self::MODEL_UTIL.'/')){
                array_push($dirArr,$modelDir.$modelDirArr[$index].'/'.self::MODEL_UTIL.'/');
            }
        }

        foreach($dirArr as $dir){
            $nameArr = scandir($dir);
            $nameLength = count($nameArr);
            for( $index = 2; $index<$nameLength; $index++)
                require_once($dir.$nameArr[$index].'');
        }
    }

    public static function autoLoad($class)
    {
        $filePath = ROOT_DIR . str_replace('\\','/',$class) . ".php";
        if (is_file($filePath)) {
            require_once($filePath . "");
        } else {
            throw new Exception("没有找到该类：" . $filePath);
        }
    }
}