<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/21 0021
 * Time: 10:03
 */

namespace app\model\main_soft\util;

use Swoole\Client;
use Exception;

class TcpClientFactory{
    const IP = "127.0.0.1";
    const PORT = 9501;
    const MOBILE_KEY = 'ljm';
    const MOBILE_RESPONSE_SUCCESS = 0;
    const MOBILE_RESPONSE_DEVICE_OFFLINE = 1;
    const MOBILE_RESPONSE_NO_PACK_DATA = 2;
    const MOBILE_RESPONSE_NO_UNPACK_DATA = 3;
    const MOBILE_RESPONSE_NO_ACCESS = 4;

    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            try{
                self::$self = new TcpClientFactory();
            }catch (Exception $e){
                throw new Exception('TcpClient link fail');
            }
        }
        return self::$self;
    }

    public function packMobileSocketData($arr=[]){
        if(!$arr){
            throw new Exception(self::MOBILE_RESPONSE_NO_PACK_DATA);
        }else{
            $res[] = time();
            $res[] = $this->makeMobileCheckMd5Key($res[0]);
            return implode('|',array_merge($res,$arr));
        }
    }

    public function unPackMobileSocketData($data){
        if(!$data){
            throw new Exception(self::MOBILE_RESPONSE_NO_UNPACK_DATA);
        }else{
            $resArr = explode('|',$data);
            if(count($resArr)>2 && $this->makeMobileCheckMd5Key($resArr[0]) == $resArr[1]){
                return array_slice($resArr,2);
            }else{
                throw new Exception(self::MOBILE_RESPONSE_NO_ACCESS);
            }
        }
    }

    private function makeMobileCheckMd5Key($time){
        return md5($time.self::MOBILE_KEY);
    }


    /**
     * @return mixed
     */
    public function getClient()
    {
        return new Client(SWOOLE_SOCK_TCP);
    }
}