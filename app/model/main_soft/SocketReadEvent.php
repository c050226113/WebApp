<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22 0022
 * Time: 14:27
 */

namespace app\model\main_soft;


use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use core\delegate\ISocketLinkWithDevice;
use Exception;

class SocketReadEvent extends SocketLinkWithDevice implements ISocketLinkWithDevice{
    private $eventTime;
    public function analysis()
    {
        $this->setEventTime($this->getInfo()[0]);

        if(!$this->getEventTime())
            throw new Exception('SocketReadEvent time data error');
    }

    public function saveData(){
        //zaodao events zhong  条件 为 using 和 inttime  的 event  修改  他的 status
        $filter = [
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::DEVICE_EVENT_INTTIME => $this->getEventTime()
        ];
        $arr = [
            Main_softUtil::DEVICE_EVENT_HAS_READ => 1
        ];
        return Main_softUtil::getInstance()->getEventsCollection()->update($filter,$arr);
    }

    /**
     * @return mixed
     */
    public function getEventTime()
    {
        return $this->eventTime;
    }

    /**
     * @param mixed $eventTime
     */
    public function setEventTime($eventTime)
    {
        $this->eventTime = $eventTime;
    }
}