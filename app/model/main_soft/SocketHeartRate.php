<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22 0022
 * Time: 14:40
 */

namespace app\model\main_soft;

use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use core\delegate\ISocketLinkWithDevice;
use Exception;

class SocketHeartRate extends SocketLinkWithDevice implements ISocketLinkWithDevice{

    private $heartRate;
    private $heartRateTime;

    public function analysis()
    {
        if(!$this->getInfo()[0] || !$this->getInfo()[1])
            throw new Exception('data error');
        $this->setHeartRate($this->getInfo()[0]);
        $this->setHeartRateTime($this->getInfo()[1]);
    }

    public function saveData(){
        //zaodao events zhong  条件 为 using 和 inttime  的 event  修改  他的 status
        $arr = [
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::DEVICE_HEALTHY_HEART_RATE => $this->getHeartRate(),
            Main_softUtil::DEVICE_HEALTHY_UPLOAD_TIME => $this->getHeartRateTime()
        ];
        return Main_softUtil::getInstance()->getHealthyCollection()->insert($arr);
    }

    public function response(){
        $body = $this->getHeartRateTime()."\r\n";
        $this->sendMsg($this->addHeader($body));
    }

    /**
     * @return mixed
     */
    public function getHeartRate()
    {
        return $this->heartRate;
    }

    /**
     * @param mixed $heartRate
     */
    public function setHeartRate($heartRate)
    {
        $this->heartRate = $heartRate;
    }

    /**
     * @return mixed
     */
    public function getHeartRateTime()
    {
        return $this->heartRateTime;
    }

    /**
     * @param mixed $heartRateTime
     */
    public function setHeartRateTime($heartRateTime)
    {
        $this->heartRateTime = $heartRateTime;
    }
}