<?php

namespace server;


use Exception;
use FilesystemIterator;

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

        $dirArr = [CORE_DIR.'include/',CORE_DIR.'lib/',CORE_DIR.'delegate/',ROOT_DIR.'app/model/'];
        foreach($dirArr as $dir){
            $this->includeFile($dir);
        }
    }

    private function changeUser(){
        $user = posix_getpwnam('ljm');
        posix_setuid($user['uid']);
        posix_setgid($user['gid']);
    }

    private function includeFile($dir){
        $fileIterator = new FilesystemIterator($dir);
        foreach($fileIterator as $fileInfo){
            if(!$fileInfo->isDir()){
                require_once($dir.$fileInfo->getFileName().'');
            }else{
                $this->includeFile($dir.$fileInfo->getFileName().'/');
            }
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