<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/17 0017
 * Time: 14:15
 */

namespace app\model\main_soft;


use app\model\main_soft\util\Main_softUtil;
use app\model\main_soft\util\SocketServer;
use app\model\main_soft\util\TcpClientFactory;
use core\delegate\ISocketLinkWithMobile;
use Exception;

class SocketSetLocationType extends SocketLinkWithMobile implements ISocketLinkWithMobile{

    /**
    下行协议号：0xA004
    下行参数：1开启wifi+gps；2仅开启wifi；3仅开启gps
    参数举例： “1\r\n”
     */
    public function sendMessageToDevice()
    {
        var_dump($this->getInfo());
        $index = array_search(Main_softUtil::getInstance()->imei_to_key($this->getInfo()[0]),SocketServer::getInstance()->getConnector());
        if($index >= 0){
            $message = chr(0xA0).chr(0x04).$this->getInfo()[1]."\r\n";
            var_dump($message);
            $this->getServer()->send($index,$this->addHeader($message));
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_SUCCESS);
        }else{
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_DEVICE_OFFLINE);
        }
    }
}