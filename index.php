<?php
use core\App;
use core\lib\Response;


if(defined("IS_SWOOLE")){
    App::getInstance()->run();
}else{
    define("ROOT_DIR",strtr(__DIR__,'\\','/')."/");
    define("CORE_DIR",ROOT_DIR."core/");
    require_once('./server/ServerFactory.php');
    spl_autoload_register('server\ServerFactory::autoLoad');

    //include下的所有类文件
    $fileIterator = new FilesystemIterator(CORE_DIR.'include');
    foreach($fileIterator as $fileInfo){
        if(!$fileInfo->isDir()){
            require_once(CORE_DIR.'include/'.$fileInfo->getFileName().'');
        }
    }

    App::getInstance()->create();
    try{
        App::getInstance()->run();
    }catch (Exception $err){
        Response::getInstance()->responseErrorJsCode($err->getMessage());
    }
}