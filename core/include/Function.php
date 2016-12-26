<?php
use core\App;

function e($str=""){
    App::getInstance()->funcEcho($str);
}
function q(){
    App::getInstance()->funcQuit();
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