<?php

namespace app\model\main_soft;

class SocketLink {
    private $server;
    private $fd;
    private $data;
    private $data_begin;//数据内容起始位置 协议标识2字节 包长度4字节
    private $length;//数据包的长度 包括 length本身的数据

    public function __construct($server = null,$fd = null,$data = null,$isClient = false){
        if(!$isClient){
            $this->setServer($server);
            $this->setFd($fd);
            $this->setData($data);
        }
        $this->setDataBegin(6);
        $this->setLength(unpack("N",$data)[1]);
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * @param mixed $fd
     */
    public function setFd($fd)
    {
        $this->fd = $fd;
    }

    /**
     * @return mixed
     */
    public function getFd()
    {
        return $this->fd;
    }

    /**
     * @param mixed $server
     */
    public function setServer($server)
    {
        $this->server = $server;
    }

    /**
     * @return mixed
     */
    public function getServer()
    {
        return $this->server;
    }

    public function closeLink(){
        $this->getServer()->close($this->getFd());
    }

    public function sendMsg($msg){
        $this->getServer()->send($this->getFd(),$msg);
    }

    public function addHeader($body){
        return pack("N",strlen($body)+4).$body;
    }

    /**
     * @return mixed
     */
    public function getDataBegin()
    {
        return $this->data_begin;
    }

    /**
     * @param mixed $data_begin
     */
    public function setDataBegin($data_begin)
    {
        $this->data_begin = $data_begin;
    }

    /**
     * @return mixed
     */
    public function getLength()
    {
        return $this->length;
    }

    /**
     * @param mixed $length
     */
    public function setLength($length)
    {
        $this->length = $length;
    }
}