<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/20 0020
 * Time: 15:54
 */

namespace app\model\main_soft;


use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use app\model\MongoManager;
use core\delegate\ISocketLinkWithDevice;
use MongoDB\BSON\UTCDateTime;

class SocketSosReceive extends SocketLinkWithDevice implements ISocketLinkWithDevice{

    private $type;

    /**
    上行协议号： 0x0006
    上行数据参数: 求救类型（1：按键求救；2：跌倒求救；3：心律求救；4：签到）
    参数举例：“1\r\n”
    （跌倒求救，心律求救需设备硬件支持）
    00 00 00 09 00 06 31 0d 0a
     */
    public function analysis()
    {
        switch($this->getInfo()[0]){
            case '1':
                $this->setType(Main_softUtil::DEVICE_EVENT_TYPE_SOS_BTN);
                break;
            case '2':
                $this->setType(Main_softUtil::DEVICE_EVENT_TYPE_SOS_FALL);
                break;
            case '3':
                $this->setType(Main_softUtil::DEVICE_EVENT_TYPE_SOS_HEART_RATE);
                break;
            case '4':
                $this->setType(Main_softUtil::DEVICE_EVENT_TYPE_SOS_SIGN);
                break;
            default:
                break;
        }
    }

    public function saveData(){
        $now = time();
        return Main_softUtil::getInstance()->getEventsCollection()->insert([
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::DEVICE_EVENT_UTCTIME => (new UTCDateTime($now*1000)),
            Main_softUtil::DEVICE_EVENT_INTTIME => $now,
            Main_softUtil::DEVICE_EVENT_ISRECIEVE => 1,
            Main_softUtil::DEVICE_EVENT_TYPE => Main_softUtil::DEVICE_EVENT_TYPE_SOS,
            Main_softUtil::DEVICE_EVENT_MESSAGE => $this->getType(),
            Main_softUtil::DEVICE_EVENT_STATUS => 0,
        ]);
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }
}