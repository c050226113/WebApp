<?php
namespace app\model\main_soft;


use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use app\model\MongoManager;
use core\delegate\ISocketLinkWithDevice;
use Exception;
use MongoDB\BSON\UTCDateTime;

class SocketGpsUpload extends SocketLinkWithDevice implements ISocketLinkWithDevice{
    private $lon;
    private $lat;
    private $uploadTime;

    /**
    上行协议号： 0x0003
    上行数据参数: 纬度，南北纬，经度，东西经，此条数据对应的世界秒（时间戳）
    参数举例：“220.123456\r\nS\r\n12.123456\r\nW\r\n1469421531\r\n”
     */
    public function analysis(){
        if($this->getInfo()[0] && $this->getInfo()[2] && $this->getInfo()[4]){
            $this->setLon($this->getInfo()[0]);
            $this->setLat($this->getInfo()[2]);
            $this->setUploadTime($this->getInfo()[4]);
            if($this->getLon() && $this->getLat()){
                Main_softUtil::getInstance()->setPositionStatus($this->getUsing(),$this->getLon(),$this->getLat(),50);
            }else{
                throw new Exception("SocketPositionUpload_api_error1\r\n");
            }
        }else{
            $this->closeLink();
            throw new Exception("data_error\r\n");
        }
    }

    public function saveData(){
        $now = time();
        return Main_softUtil::getInstance()->getWaypointCollection()->insert([
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::WAYPOINT_UTCTIME => (new UTCDateTime($now*1000)),
            Main_softUtil::WAYPOINT_INTTIME => $now,
            Main_softUtil::WAYPOINT_POINTS => [$this->getLon(),$this->getLat()],
            Main_softUtil::WAYPOINT_UPLOAD_TIME => $this->getUploadTime()
        ]);
    }

    /**
    下行协议号：0xA003
    下行参数：世界秒（时间戳）
    （服务器回复的时间戳是设备上传此条数据的时间戳，设备判断时间戳相同，认为数据上传成功，否则会重新上传）
    参数举例：“1469421531\r\n”
     */
    public function response(){
        $msg_body = chr(0xA0).chr(0x03).$this->getUploadTime()."\r\n";
        $this->sendMsg($this->addHeader($msg_body));
    }

    /**
     * @return mixed
     */
    public function getLat()
    {
        return $this->lat;
    }

    /**
     * @param mixed $lat
     */
    public function setLat($lat)
    {
        $this->lat = $lat;
    }

    /**
     * @return mixed
     */
    public function getLon()
    {
        return $this->lon;
    }

    /**
     * @param mixed $lon
     */
    public function setLon($lon)
    {
        $this->lon = $lon;
    }

    /**
     * @return mixed
     */
    public function getUploadTime()
    {
        return $this->uploadTime;
    }

    /**
     * @param mixed $uploadTime
     */
    public function setUploadTime($uploadTime)
    {
        $this->uploadTime = (int)$uploadTime;
    }
}