<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/24 0024
 * Time: 15:22
 */

namespace app\model\main_soft\util;


class SocketServer {
    private $protoHead = [];
    private $connector = [];

    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new SocketServer();
            self::$self->setProtoHead([
                "heart"=>chr(0x00).chr(0x01),
                "wifi"=>chr(0x00).chr(0x02),
                "gps"=>chr(0x00).chr(0x03),
                "sos"=>chr(0x00).chr(0x06),
                "showEvent"=>chr(0x00).chr(0x09),
                "readEvent"=>chr(0x00).chr(0x10),
                "heartRate"=>chr(0x00).chr(0x13),


                "locationType"=>chr(0x10).chr(0x04),
                "shutDown"=>chr(0x10).chr(0x05),
                "setContacts"=>chr(0x10).chr(0x07),
                "setMonitor"=>chr(0x10).chr(0x08),
                "setNotice"=>chr(0x10).chr(0x09),
            ]);
        }
        return self::$self;
    }
    /**
     * @return array
     */
    public function getProtoHead()
    {
        return $this->protoHead;
    }

    /**
     * @param array $protoHead
     */
    public function setProtoHead($protoHead)
    {
        $this->protoHead = $protoHead;
    }

    /**
     * @return array
     */
    public function getConnector()
    {
        return $this->connector;
    }

    /**
     * @param array $connector
     */
    public function setConnector($connector)
    {
        $this->connector = $connector;
    }
}