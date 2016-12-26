<?php
namespace core\lib;

class HttpHelper{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new HttpHelper();
        }
        return self::$self;
    }

//    public $bskey="Qxcifiewrn@%sadf(@19T234";
//    public $debug= false;
//    public $token="cccccccccccccccccccccccccccccccccccccccc";
//
//    public static function curlPost($url, $data)
//    {
//        $ch = curl_init();
//        curl_setopt($ch, CURLOPT_URL, $url);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
////        curl_setopt($ch, CURLOPT_USERAGENT,"usercpadfaf23324");
////        curl_setopt($ch, CURLOPT_USERAGENT,HttpHelper::$bskey);
////        curl_setopt($ch, CURLOPT_USERAGENT,"aw9zzgvmc2u");
//        curl_setopt($ch, CURLOPT_USERAGENT,DB_AGENT);
//
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
//        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
//
//        $output = curl_exec($ch);
//        curl_close($ch);
//        return ($output);
//    }


    private function initCurl($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        return $ch;
    }

    private function setCurl($ch){
        curl_setopt($ch, CURLOPT_HEADER, 0); //不返回header部分

    }

    public function httpCurl($url, $data=[], $cookie='', $setArr = []){
        $ch = $this->initCurl($url);

        if($data){
            curl_setopt ( $ch, CURLOPT_POST, true);
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );
        }

        $this->setCurl($ch);

        $settingArr = [];
        if($cookie){
            $settingArr[] = "X-Requested-With: XMLHttpRequest";
            $settingArr[] = "Cookie:PHPSESSID={$cookie}";
        }
        if($setArr){
            array_merge($settingArr,$setArr);
        }

        if($settingArr){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $settingArr);
        }

        $o = curl_exec($ch);
        curl_close($ch);
        return $o;
    }

}