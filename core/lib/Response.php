<?php
namespace core\lib;
use core\App;

class Response{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Response();
        }
        return self::$self;
    }

    public function responseErrorJsCode($msg){
        e('<!DOCTYPE html><html style="padding: 20px;"><head><meta charset="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1"><title>错误</title><link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet"><script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script><script src="http://libs.baidu.com/bootstrap/3.0.3/js/bootstrap.min.js"></script></head><body>
 <div class="well" style="color: red">'.$msg.'</div></body></html>');
        q();
    }

    /**
     * 渲染html页面
     * @param $fileName
     * @param $paramsArr
     */
    public function render($fileName,$paramsArr){
        extract($paramsArr);
        ob_start();
        include(VIEW_DIR.$fileName.".php");
        $res = ob_get_contents();
        ob_clean();
        e($res);
        q();
    }

//    public static function widget($fileName,$paramsArr){
//        global $c;
//        foreach($paramsArr as $str=>$val){
//            global $$str;
//            $$str = $val;
//        }
//
//        q(include(VIEW_DIR.$c.$fileName.".php"));
//    }

    /**
     * 页面重定向
     * @param $route
     * @param $getArr
     */
    public function redirect($route,$getArr){
        $url = App::getInstance()->getRequest()->server["path_info"]."?r=".$route;
        //add get params
        if(count($getArr)>=0){
            foreach($getArr as $k => $v){
                $url .= "&{$k}={$v}";
            }
        }
        //location
        e("<script>window.location.href='".$url."';</script>");
        q();
//        header("Location:{$url}");
    }
}