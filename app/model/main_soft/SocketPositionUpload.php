<?php
namespace app\model\main_soft;

use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use core\delegate\ISocketLinkWithDevice;
use core\lib\HttpHelper;
use core\lib\Util;
use Exception;
use MongoDB\BSON\UTCDateTime;

class SocketPositionUpload extends SocketLinkWithDevice implements ISocketLinkWithDevice{
    private $lon;
    private $lat;
    private $radius;
    private $uploadTime;

    /**
    上行协议号： 0x0002
    上行数据参数: 基站，WIFI，此条数据对应的世界秒（时间戳）
    基站：mcc|mnc|基站数量|lac,cid,rx|lac,cid,rx|
    WIFI：WIFI数量|MAC,信号强度,SSID|MAC,信号强度,SSID|
    参数举例：
    “460|01|3|16515,41143,52|16515,41143,52|16515,41143,52|\r\n2|c8:3a:35:15:71:38,-84,Tenda_157138|70:3a:d8:11:78:60,-86,WXlmjd|\r\n1469421531\r\n”
     */
    public function analysis(){
        if($this->getInfo()[0] && $this->getInfo()[1] && $this->getInfo()[2]) {
            $this->setUploadTime($this->getInfo()[2]);

            $jizhanArr = explode("|", $this->getInfo()[0]);
            $mcc = $jizhanArr[0];
            $mnc = (int)$jizhanArr[1];
            $i = 3;
            $str = "";
            while ($jizhanArr[$i]) {
                $str .= $mcc . ',' . $mnc . "," . $jizhanArr[$i] . ";";
                $i++;
            }
            $cl = substr($str, 0, -1);

            $wifiArr = explode("|", $this->getInfo()[1]);
            $i = 1;
            $str = "";
            while ($wifiArr[$i]) {
                $arr = explode(",", $wifiArr[$i]);
                $str .= $arr[0] . ',' . $arr[1] . ";";
                $i++;
            }
            $wl = substr($str, 0, -1);

            //todo change api, this api for test, api example: http://api.cellocation.com/loc/?cl=460,0,4467,1542,-15;460,0,4467,1024,-22&wl=00:87:36:05:5d:eb,-23;00:19:e0:e7:5e:b4,-13&output=json
            $url = 'http://api.cellocation.com/loc/?cl=' . $cl . '&wl=' . $wl . '&output=json';
            $res = HttpHelper::getInstance()->httpCurl($url);
            $arr = json_decode($res,true);
            $errorCode = Util::getInstance()->hasArr($arr,'errcode');
            if($errorCode !== '' && $errorCode == 0){
                $this->setLon($arr['lon']?:0);
                $this->setLat($arr['lat']?:0);
                if($this->getLon() && $this->getLat()){
                    $this->setRadius($arr['radius']?:0);
                    Main_softUtil::getInstance()->setPositionStatus($this->getUsing(),$this->getLon(),$this->getLat(),$this->getRadius());
                }else{
                    throw new Exception("SocketPositionUpload_api_error1\r\n");
                }
            }else{
                throw new Exception("SocketPositionUpload_api_error2\r\n");
            }
        }else{
            $this->closeLink();
            throw new Exception("SocketPositionUpload_data_error\r\n");
        }
    }

    public function saveData(){
        $now = time();
        return Main_softUtil::getInstance()->getWaypointCollection()->insert([
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::WAYPOINT_UTCTIME => (new UTCDateTime($now*1000)),
            Main_softUtil::WAYPOINT_INTTIME => $now,
            Main_softUtil::WAYPOINT_UPLOAD_TIME => $this->getUploadTime(),
            Main_softUtil::WAYPOINT_POINTS => [$this->getLon(),$this->getLat()]
        ]);
    }

    /**
    下行协议号：0xA002
    下行参数：世界秒（时间戳）
    （服务器回复的时间戳是设备上传此条数据的时间戳，设备判断时间戳相同，认为数据上传成功，否则会重新上传）
    参数举例：“1469421531\r\n”
     */
    public function response(){
        $msg_body = chr(0xA0).chr(0x02).$this->getUploadTime()."\r\n";
        $this->sendMsg($this->addHeader($msg_body));
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
    public function getRadius()
    {
        return $this->radius;
    }

    /**
     * @param mixed $radius
     */
    public function setRadius($radius)
    {
        $this->radius = $radius;
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