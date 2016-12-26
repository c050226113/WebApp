<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22 0022
 * Time: 11:44
 */

namespace app\model\main_soft;


use app\model\main_soft\util\Main_softUtil;
use app\model\main_soft\util\SocketServer;
use app\model\main_soft\util\TcpClientFactory;
use core\delegate\ISocketLinkWithMobile;
use Exception;

class SocketSetNotice extends SocketLinkWithMobile implements ISocketLinkWithMobile{
    /**
    通知下发协议- 服务器端发起
    下行协议号：0xA009
    下行参数：通知内容（UTF8编码，小于128字节），时间戳
    参数举例：“通知内容\r\n1469421531\r\n”
     */
    public function sendMessageToDevice()
    {
//        var_dump($this->getInfo());
        $index = array_search($this->getInfo()[0],SocketServer::getInstance()->getConnector());

        if($index !== false){
            if($this->getInfo()[1] == Main_softUtil::DEVICE_EVENT_TYPE_MESSAGE){
                $message = chr(0xA0).chr(0x09).$this->getInfo()[2]."\r\n".$this->getInfo()[3]."\r\n";
                $this->getServer()->send($index,$this->addHeader($message));
                throw new Exception(TcpClientFactory::MOBILE_RESPONSE_SUCCESS);
            }
        }else{
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_DEVICE_OFFLINE);
        }
    }
}