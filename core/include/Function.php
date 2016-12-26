<?php
use core\App;

if(!defined('IS_SWOOLE')){
    define('IS_SWOOLE',true);
}

function e($str=""){
    if(IS_SWOOLE){
        App::getInstance()->getResponse()->write($str);
    }else{
        echo $str;
    }
}
function q(){
    if(IS_SWOOLE){
        throw new Exception('0');
    }else{
        exit();
    }
}
function d($obj){
    ob_start();
    echo "<pre>";
    var_dump($obj);
    $res = ob_get_contents();
    ob_clean();
    e($res);
    q();
}
function o($str){
    require_once(EXTENSION_DIR.$str."/".$str.".php");
}