<?php
use core\App;
use core\lib\Response;

if(defined("LOADED")){
    App::getInstance()->run();
}else{
    define('IS_SWOOLE',false);

    define("ROOT_DIR",strtr(__DIR__,'\\','/')."/");
    define("CORE_DIR",ROOT_DIR."core/");

    //自动加载器
    require_once('./server/ServerFactory.php');
    spl_autoload_register('server\ServerFactory::autoLoad');

    //include下的所有类文件
    $nameArr = scandir(CORE_DIR."include");
    $count = count($nameArr);
    for( $index = 2; $index<$count; $index++){
        require_once(CORE_DIR."include/".$nameArr[$index]."");
    }

    DEBUG?error_reporting(1):error_reporting(0);

    App::getInstance()->create();
    try{
        App::getInstance()->run();
    }catch (Exception $err){
        Response::getInstance()->responseErrorJsCode($err->getMessage());
    }
}