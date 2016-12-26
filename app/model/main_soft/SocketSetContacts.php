<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/20 0020
 * Time: 17:34
 */

namespace app\model\main_soft;

use app\model\main_soft\util\SocketServer;
use app\model\main_soft\util\TcpClientFactory;
use core\delegate\ISocketLinkWithMobile;
use Exception;

class SocketSetContacts  extends SocketLinkWithMobile implements ISocketLinkWithMobile{

    /**
    app通讯录设置协议- 服务器端发起
    下行协议号：0xA007
    下行参数：编号/r/n操作/r/n姓名/r/n号码/r/n  （编号为0-9，可设置10组号码；操作，0为删除，1为设置；操作为1时，带姓名和号码，姓名为UTF8编码，姓名和号码不可为空）
    参数举例：
    "1/r/n1/r/n小明/r/n15912345678/r/n"
    "1/r/n0/r/n"
    1
     */
    public function sendMessageToDevice()
    {
        $using = $this->getInfo()[0];
        $index = array_search($using,SocketServer::getInstance()->getConnector());
        if($index !== false){
            $str = '';
            $arr = explode('&',$this->getInfo()[1]);
            for($i=0;$i<10;$i++){
                if($arr[$i]){
                    $name_tel = explode(',',$arr[$i]);
                    $str .= $i."\r\n".'1'."\r\n".$name_tel[0]."\r\n".$name_tel[1]."\r\n";
                }else{
                    $str .= $i."\r\n".'0'."\r\n";
                }
            }

            $message = chr(0xA0).chr(0x07).$str;
            $this->getServer()->send($index,$this->addHeader($message));
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_SUCCESS);
        }else{
            throw new Exception(TcpClientFactory::MOBILE_RESPONSE_DEVICE_OFFLINE);
        }
    }
}