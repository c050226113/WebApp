<?php
namespace core\lib;
use Exception;

class EventCenter{ /* 事件中心 */
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new EventCenter();
        }
        return self::$self;
    }

    private $_events = [];

    public function subscribe($id,$func){ /*  注册事件 */
        $this->getEvents()[$id] = $func;
        return true;
    }

    public function unSubscribe($id){ /*  删除事件 */
        $this->getEvents()[$id] = null;
        unset($this->getEvents()[$id]);
        return true;
    }

    public function publish($id){  /*  触发事件    */
        try{
            $func = $this->getEvents()[$id];
            if(!$func){
                return false;
            }else{
                $func();
                return true;
            }
        }catch (Exception $e){
            throw new Exception('publish '.$id.' error');
        }
    }

    /**
     * @return array
     */
    public function getEvents()
    {
        return $this->_events;
    }

    /**
     * @param array $events
     */
    public function setEvents($events)
    {
        $this->_events = $events;
    }
}