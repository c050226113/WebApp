<?php

namespace app\model\main_soft;

use app\model\main_soft\util\TcpClientFactory;
use core\delegate\ISocketLink;

class SocketLinkWithMobile extends SocketLink implements ISocketLink{
    private $info = [];

    private function getInfoAndCheck(){
        $this->setData(substr($this->getData(),$this->getDataBegin(),$this->getLength()-$this->getDataBegin()));
        $this->setInfo(TcpClientFactory::getInstance()->unPackMobileSocketData($this->getData()));
    }

    public function analysisData(){
        $this->getInfoAndCheck();
        $this->sendMessageToDevice();
    }

    /**
     * @return array
     */
    public function getInfo()
    {
        return $this->info;
    }

    /**
     * @param array $info
     */
    public function setInfo($info)
    {
        $this->info = $info;
    }
}