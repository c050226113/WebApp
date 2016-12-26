<?php
namespace app\model\main_soft;

use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use app\model\MongoManager;
use core\delegate\ISocketLinkWithDevice;
use core\lib\Socket;
use Exception;
use MongoDB\BSON\UTCDateTime;

class SocketHeartBeat extends SocketLinkWithDevice implements ISocketLinkWithDevice{
    private $power;
    private $steps;
    private $chargeStatus;
    private $signal;
    private $isWear;


    public function __construct($server,$fd,$data){
        $this->setMaybeNoUsing(true);
        parent::__construct($server,$fd,$data);
    }

    /**
    上行协议号： 0x0001
    上行数据参数: imei，电池电量，记步器步数，充电状态(0未充电，1充电，2充满)，信号强度，佩戴检测
    (计步器和佩戴检测需设备硬件支持)
    参数举例：“867567865767685\r\n100\r\n0\r\n0\r\n60\r\n1\r\n”
     */
    public function analysis(){

        if(!$this->getUsing()){
            if(!$this->getInfo()[0])
                throw new Exception('no using');
            $this->setUsing(Main_softUtil::getInstance()->imei_to_key($this->getInfo()[0]));
        }

        $this->setPower($this->getInfo()[1]?:0);
        $this->setSteps($this->getInfo()[2]?:0);
        $this->setChargeStatus($this->getInfo()[3]?:0);
        $this->setSignal($this->getInfo()[4]?:0);
        $this->setIsWear($this->getInfo()[5]?:0);
    }

    public function saveData(){
        $now = time();
        return Main_softUtil::getInstance()->getSportsCollection()->insert([
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::DEVICE_SPORTS_UTCTIME => (new UTCDateTime($now*1000)),
            Main_softUtil::DEVICE_SPORTS_INTTIME => $now,
            Main_softUtil::DEVICE_SPORTS_STEPS=>$this->getSteps(),
            Main_softUtil::DEVICE_SPORTS_POWER=>$this->getPower(),
            Main_softUtil::DEVICE_SPORTS_CHARGE_STATUS=>$this->getChargeStatus(),
            Main_softUtil::DEVICE_SPORTS_SIGNAL=>$this->getSignal(),
            Main_softUtil::DEVICE_SPORTS_IS_WEAR=>$this->getIsWear()
        ]);
    }

    /**
    下行协议号：0xA001
    下行参数：时区，世界秒，心跳周期（秒），lbs+wifi定位周期（秒），gps定位周期（秒），心律测试周期（秒）
    (lbs+wifi定位周期可设为0，为0时系统不会周期性进行lbs+wifi定位；
    gps定位周期可设为0，为0时系统不会周期性进行gps定位；
    心律测试周期可设为0，为0时系统不会周期性进行心律测试)
    参数举例：“8\r\n1469421531\r\n300\r\n300\r\n300\r\n300\r\n”
     */
    public function response(){
        $msg_body = chr(0xA0).chr(0x01)."8\r\n".time()."\r\n300\r\n300\r\n300\r\n300\r\n";
        $this->sendMsg($this->addHeader($msg_body));
    }

    /**
     * @return mixed
     */
    public function getPower()
    {
        return $this->power;
    }

    /**
     * @param mixed $power
     */
    public function setPower($power)
    {
        $this->power = $power;
    }

    /**
     * @param mixed $steps
     */
    public function setSteps($steps)
    {
        $this->steps = $steps;
    }

    /**
     * @return mixed
     */
    public function getSteps()
    {
        return $this->steps;
    }

    /**
     * @return mixed
     */
    public function getChargeStatus()
    {
        return $this->chargeStatus;
    }

    /**
     * @param mixed $chargeStatus
     */
    public function setChargeStatus($chargeStatus)
    {
        $this->chargeStatus = $chargeStatus;
    }

    /**
     * @return mixed
     */
    public function getIsWear()
    {
        return $this->isWear;
    }

    /**
     * @param mixed $isWear
     */
    public function setIsWear($isWear)
    {
        $this->isWear = $isWear;
    }

    /**
     * @return mixed
     */
    public function getSignal()
    {
        return $this->signal;
    }

    /**
     * @param mixed $signal
     */
    public function setSignal($signal)
    {
        $this->signal = $signal;
    }
}