<?php

if($_POST && isset($_POST['phone_manifest'])){
//    $thisPath = dirname(__FILE__).'/';
//    foreach($_POST as $k => $v){
//        if(is_file($thisPath.$k)){
//            file_put_contents($thisPath.$k,$v);
//        }
//    }
    echo 'ok';
}else{
    var_dump($_POST);
}
