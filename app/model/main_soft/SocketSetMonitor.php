<?php

namespace app\model\main_soft;


use app\model\main_soft\util\Main_softUtil;
use app\model\main_soft\util\SocketServer;
use app\model\main_soft\util\TcpClientFactory;
use core\delegate\ISocketLinkWithMobile;
use Exception;

class SocketSetMonitor extends SocketLinkWithMobile implements ISocketLinkWithMobile{
    /**
    监听协议- 服务器端发起
    下行协议号：0xA008
    下行参数：监听号码
    参数举例：“15912345678/r/n”
     */
    public function sendMessageToDevice()
    {
//        var_dump($this->getInfo());
        $index = array_search(Main_softUtil::getInstance()->imei_to_key($this->getInfo()[0]),SocketServer::getInstance()->getConnector());
        if($index >= 0){
            $message = chr(0xA0).chr(0x08).$this->getInfo()[1]."\r\n";
            $this->getServer()->send($index,$this->addHeader($message));
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_SUCCESS);
        }else{
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_DEVICE_OFFLINE);
        }
    }
}