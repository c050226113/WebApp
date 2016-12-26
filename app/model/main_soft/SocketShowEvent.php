<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/22 0022
 * Time: 14:09
 */

namespace app\model\main_soft;


use app\controller\Main_softController;
use app\model\main_soft\util\Main_softUtil;
use core\delegate\ISocketLinkWithDevice;
use Exception;

class SocketShowEvent extends SocketLinkWithDevice implements ISocketLinkWithDevice{

    private $eventTime;


    public function analysis()
    {
        $this->setEventTime($this->getInfo()[0]);

        if(!$this->getEventTime()){
            throw new Exception('Socket ShowEvent time data error');
        }
    }

    public function saveData(){
        //zaodao events zhong  条件 为 using 和 inttime  的 event  修改  他的 status
        $filter = [
            Main_softUtil::USER_USING => $this->getUsing(),
            Main_softUtil::DEVICE_EVENT_INTTIME => $this->getEventTime()
        ];
        $arr = [
            Main_softUtil::DEVICE_EVENT_STATUS => 1
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