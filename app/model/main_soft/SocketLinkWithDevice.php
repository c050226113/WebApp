<?php
namespace app\model\main_soft;

use app\model\main_soft\util\SocketServer;
use core\delegate\ISocketLink;
use Exception;


class SocketLinkWithDevice extends SocketLink implements ISocketLink{
    private $using;//一定是与 某一个设备进行连接
    private $maybeNoUsing = false;
    private $info = [];

    public function __construct($server,$fd,$data){
        parent::__construct($server,$fd,$data);
        if(!empty(SocketServer::getInstance()->getConnector()[$fd])){
            $this->setUsing(SocketServer::getInstance()->getConnector()[$fd]);
        }else{
            $this->setUsing("");
        }
    }

    private function getInfoAndCheckUsing(){
        if(!$this->getUsing() && !$this->getMaybeNoUsing()){
            $this->getServer()->close($this->getFd());
            throw new Exception("has_no_using\r\n");
        }else{
            $this->setInfo(explode("\r\n",substr($this->getData(),$this->getDataBegin(),-2)));
        }
    }

    public function analysisData(){
        $this->getInfoAndCheckUsing();
        $this->analysis();
    }

    /**
     * @return mixed
     */
    public function getUsing()
    {
        return $this->using;
    }

    /**
     * @param mixed $using
     */
    public function setUsing($using)
    {
        $this->using = $using;
        SocketServer::getInstance()->getConnector()[$this->getFd()] = $using;
    }

    /**
     * @return mixed
     */
    public function getMaybeNoUsing()
    {
        return $this->maybeNoUsing;
    }

    /**
     * @param mixed $maybeNoUsing
     */
    public function setMaybeNoUsing($maybeNoUsing)
    {
        $this->maybeNoUsing = $maybeNoUsing;
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
