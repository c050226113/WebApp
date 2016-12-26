<?php

namespace app\model\main_soft\util;

use app\model\MongoManager;
use core\lib\Util;
use MongoDB\BSON\UTCDateTime;

class Main_softUtil {
    const MAIN_SOFT_ACCOUNT = 'main_soft_account';
    const MAIN_SOFT_PASSWORD = 'main_soft_password';
    const MAIN_SOFT_USING = 'main_soft_using';

    /**
     * mongo collection
     * */
    const DB_NAME = 'ljm';
    const SESSION_COLLECTION = 'session';
    const USER_COLLECTION = 'user';
    const WAY_POINT_COLLECTION = 'waypoint';
    const SPORTS_COLLECTION = 'sports';
    const EVENTS_COLLECTION = 'events';
    const FAMILY_COLLECTION = 'family';
    const HEALTHY_COLLECTION = 'healthy';


    /**
     * mongo key
     * */
    const USER_DEVICES = 'devices';
    const USER_PASSWORD = 'pwd';
    const USER_USING = 'using';
    const USER_HASDEVICES = 'hasdevices';
    const USER_NAME = 'username';
    const USER_AVT = 'useravt';
    /**
     * devices info
     */
    const DEVICE_INFO = 'info';
    const DEVICE_IMEI = 'a';
    const DEVICE_NUM = 'b';
    const DEVICE_NAME = 'c';
    const DEVICE_AVT = 'd';
    const DEVICE_SCHOOL = 'e';
    const DEVICE_POWER = 'f';
    const DEVICE_STEPS = 'g';
    const DEVICE_LAT = 'h';
    const DEVICE_LON = 'i';
    const DEVICE_LOCATIONTYPE = 'j';
    const DEVICE_LOCATIONTYPE_GSM = 'a';
    const DEVICE_LOCATIONTYPE_WIFI = 'b';
    const DEVICE_LOCATIONTYPE_GPS = 'c';
    const DEVICE_RADIUS = 'k';
    const DEVICE_LOCATION_TYPE = 'l';
    const DEVICE_LOCATION_INSAVE = 'a';
    const DEVICE_LOCATION_INDANGER = 'b';
    const DEVICE_LOCATION_OUT = 'c';
    const DEVICE_SEX = 'r';
    const DEVICE_BIRTH = 's';
    const DEVICE_ID = 't';
    const DEVICE_HU = 'u';
    const DEVICE_TYPE = 'v';
    const DEVICE_CLASS = 'w';
    const DEVICE_FACE = 'x';
    const DEVICE_SCHOOLWAY = 'y';
    const DEVICE_LIVE = 'z';
    /**
     * devices family
     */
    const DEVICE_FAMILY = 'family';
    const FAMILY_PHONE = 'a';
    const FAMILY_NAME = 'b';
    /**
     * devices setting
     */
    const DEVICE_SETTING = 'setting';
    const SETTING_CLASS = 'a';
    const SETTING_CLASS_STATUS = 'a';
    const SETTING_CLASS_WEEK = 'b';
    const SETTING_CLASS_STARTH = 'c';
    const SETTING_CLASS_STARTM = 'd';
    const SETTING_CLASS_ENDH = 'e';
    const SETTING_CLASS_ENDM = 'f';
    const SETTING_INTERVALSHUTDOWN = 'b';
    const SETTING_INTERVALSHUTDOWN_STATUS = 'a';
    const SETTING_INTERVALSHUTDOWN_TIMEH = 'b';
    const SETTING_INTERVALSHUTDOWN_TIMEM = 'c';
    const SETTING_SYS = 'c';
    const SETTING_CONTROL = 'd';
    const SETTING_REMOVE_BIND = 'e';
    const SETTING_BACKUP = 'f';
    /**
     * devices fence
     */
    const DEVICE_FENCE = 'fence';
    const FENCE_LAT = 'a';
    const FENCE_LON = 'b';
    const FENCE_RADIUS = 'c';
    const FENCE_NAME = 'd';
    const FENCE_STATUS = 'e';
    const FENCE_ISDANGER = 'f';
    /**
     * devices waypoint
     */
    const DEVICE_WAYPOINT = 'waypoint';
    const WAYPOINT_INTTIME = 'a';
    const WAYPOINT_POINTS = 'b';
    const WAYPOINT_UTCTIME = 'c';
    const WAYPOINT_UPLOAD_TIME = 'd';
    /**
     * devices events
     */
    const DEVICE_EVENT = 'events';
    const DEVICE_EVENT_STATUS = 'a';
    const DEVICE_EVENT_TYPE = 'b';
    const DEVICE_EVENT_TYPE_MESSAGE = 'a';
    const DEVICE_EVENT_TYPE_POSITIONWARNING = 'b';
    const DEVICE_EVENT_TYPE_SOS = 'c';
    const DEVICE_EVENT_TYPE_SOS_BTN = 'a';
    const DEVICE_EVENT_TYPE_SOS_FALL = 'b';
    const DEVICE_EVENT_TYPE_SOS_HEART_RATE = 'c';
    const DEVICE_EVENT_TYPE_SOS_SIGN = 'd';
    const DEVICE_EVENT_MESSAGE = 'c';
    const DEVICE_EVENT_ISRECIEVE = 'd';
    const DEVICE_EVENT_INTTIME = 'e';
    const DEVICE_EVENT_UTCTIME = 'f';
    const DEVICE_EVENT_HAS_READ = 'g';

    /**
     * devices sports
     */
    const DEVICE_SPORTS = 'sports';
    const DEVICE_SPORTS_INTTIME = 'a';
    const DEVICE_SPORTS_POWER = 'b';
    const DEVICE_SPORTS_STEPS = 'c';
    const DEVICE_SPORTS_UTCTIME = 'd';
    const DEVICE_SPORTS_CHARGE_STATUS = 'e';
    const DEVICE_SPORTS_SIGNAL = 'f';
    const DEVICE_SPORTS_IS_WEAR = 'g';
    /**
     * devices family
     */
    const DEVICE_PRE_FAMILY = 'family';
    const DEVICE_PRE_FAMILY_INTTIME = 'a';
    const DEVICE_PRE_FAMILY_LIST = 'b';
    const DEVICE_PRE_FAMILY_LIST_NAME = 'a';
    const DEVICE_PRE_FAMILY_LIST_PHONE = 'b';
    /**
     * devices healthy
     */
    const DEVICE_HEALTHY = 'healthy';
    const DEVICE_HEALTHY_HEART_RATE = 'a';
    const DEVICE_HEALTHY_UPLOAD_TIME = 'b';

    private $userCollection;
    private $eventsCollection;
    private $waypointCollection;
    private $sportsCollection;
    private $prefamilyCollection;
    private $healthyCollection;
    private $sessionCollection;

    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Main_softUtil();
            self::$self->setUserCollection(new MongoManager(self::DB_NAME, self::USER_COLLECTION));
            self::$self->setWaypointCollection(new MongoManager(self::DB_NAME,self::WAY_POINT_COLLECTION));
            self::$self->setEventsCollection(new MongoManager(self::DB_NAME, self::EVENTS_COLLECTION));
            self::$self->setWaypointCollection(new MongoManager(self::DB_NAME,self::WAY_POINT_COLLECTION));
            self::$self->setSportsCollection(new MongoManager(self::DB_NAME,self::SPORTS_COLLECTION));
            self::$self->setPrefamilyCollection(new MongoManager(self::DB_NAME,self::FAMILY_COLLECTION));
            self::$self->setHealthyCollection(new MongoManager(self::DB_NAME,self::HEALTHY_COLLECTION));
            self::$self->setSessionCollection(new MongoManager(self::DB_NAME,self::SESSION_COLLECTION));
        }
        return self::$self;
    }

    /**
     * @param $using
     * @param $lon
     * @param $lat
     * @param $radius
     * @return string
     */
    public function setPositionStatus($using,$lon,$lat,$radius = 0){
        //找到using为obj的user
        $filter = [join('.',[self::USER_DEVICES,$using])=>['$type'=>3]];
        $option = $this->getUserCollection()->arr2need([
            join('.',[self::USER_DEVICES,$using,self::DEVICE_FENCE]),
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_LOCATION_TYPE])
        ]);
        $res = $this->getUserCollection()->find($filter,$option);
        $arr = @Util::getInstance()->object2array($res[0][0]);

        //初始化 $positionStatus
        $positionStatus = self::DEVICE_LOCATION_OUT;
        if(is_array($arr)) {
            //改变 $positionStatus
            foreach ($arr[self::USER_DEVICES][$using][self::DEVICE_FENCE] as $v) {
                $status = $v[self::FENCE_STATUS];
                if (!$status) {
                    continue;
                }
                $fenceLon = $v[self::FENCE_LON];
                $fenceLat = $v[self::FENCE_LAT];
                $isDanger = $v[self::FENCE_ISDANGER];
                $fenceRadius = $v[self::FENCE_RADIUS];
                //todo PHP2C
                $distance = Util::getInstance()->GetDistance($fenceLat, $fenceLon, $lat, $lon);
                if ($distance < $fenceRadius) {
                    if ($isDanger) {
                        $positionStatus = self::DEVICE_LOCATION_INDANGER;
                    } else {
                        $positionStatus = self::DEVICE_LOCATION_INSAVE;
                    }
                    break;
                }
            }
        }

        //得到 之前的 $positionStatus
        $lastType = @$arr[self::USER_DEVICES][$using][self::DEVICE_INFO][self::DEVICE_LOCATION_TYPE];
        if(!$lastType){
            $lastType = self::DEVICE_LOCATION_OUT;
        }
        if($positionStatus != $lastType) {//添加event
            $message = '';
            if ($positionStatus == self::DEVICE_LOCATION_INSAVE) {//进入安全区域
                $message = '进入安全区域';
            } else if ($positionStatus == self::DEVICE_LOCATION_INDANGER) {//进入危险区域
                $message = '进入危险区域';
            } else if ($lastType == self::DEVICE_LOCATION_INSAVE) {//离开安全区域
                $message = '离开安全区域';
            } else if ($lastType == self::DEVICE_LOCATION_INDANGER) {//离开危险区域
                $message = '离开危险区域';
            }

            if ($message) {
                $now = time();
                $this->getEventsCollection()->insert([
                    self::USER_USING => $using,
                    self::DEVICE_EVENT_UTCTIME => (new UTCDateTime($now*1000)),
                    self::DEVICE_EVENT_INTTIME => $now,
                    self::DEVICE_EVENT_ISRECIEVE => 1,
                    self::DEVICE_EVENT_TYPE => self::DEVICE_EVENT_TYPE_POSITIONWARNING,
                    self::DEVICE_EVENT_MESSAGE => $message,
                    self::DEVICE_EVENT_STATUS => 0,
                ]);
            }
        }

        //update user info
        $filter = [join('.',[self::USER_DEVICES,$using])=>['$type'=>3]];
        $arr = [
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_LON])=>$lon,
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_LAT])=>$lat,
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_LOCATION_TYPE])=>$positionStatus,
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_RADIUS])=>$radius,
            join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_LOCATIONTYPE])=>self::DEVICE_LOCATIONTYPE_WIFI,
        ];
        return $this->getUserCollection()->update($filter, $arr);
    }

    public function imei_to_key($imei){
        $num = Util::getInstance()->decb64($imei);
        if(is_numeric($num)){
            return 'i'.$num;
        }else{
            return $num;
        }
    }

    public function addHeader($body){
        return pack("N",strlen($body)+4).$body;
    }

    /**
     * @return mixed
     */
    public function getUserCollection()
    {
        return $this->userCollection;
    }

    /**
     * @param mixed $userCollection
     */
    public function setUserCollection($userCollection)
    {
        $this->userCollection = $userCollection;
    }

    /**
     * @return mixed
     */
    public function getSessionCollection()
    {
        return $this->sessionCollection;
    }

    /**
     * @param mixed $sessionCollection
     */
    public function setSessionCollection($sessionCollection)
    {
        $this->sessionCollection = $sessionCollection;
    }

    /**
     * @return mixed
     */
    public function getEventsCollection()
    {
        return $this->eventsCollection;
    }

    /**
     * @param mixed $eventsCollection
     */
    public function setEventsCollection($eventsCollection)
    {
        $this->eventsCollection = $eventsCollection;
    }

    /**
     * @return mixed
     */
    public function getWaypointCollection()
    {
        return $this->waypointCollection;
    }

    /**
     * @param mixed $waypointCollection
     */
    public function setWaypointCollection($waypointCollection)
    {
        $this->waypointCollection = $waypointCollection;
    }

    /**
     * @return mixed
     */
    public function getSportsCollection()
    {
        return $this->sportsCollection;
    }

    /**
     * @param mixed $sportsCollection
     */
    public function setSportsCollection($sportsCollection)
    {
        $this->sportsCollection = $sportsCollection;
    }

    /**
     * @return mixed
     */
    public function getPrefamilyCollection()
    {
        return $this->prefamilyCollection;
    }

    /**
     * @param mixed $prefamilyCollection
     */
    public function setPrefamilyCollection($prefamilyCollection)
    {
        $this->prefamilyCollection = $prefamilyCollection;
    }

    /**
     * @return mixed
     */
    public function getHealthyCollection()
    {
        return $this->healthyCollection;
    }

    /**
     * @param mixed $healthyCollection
     */
    public function setHealthyCollection($healthyCollection)
    {
        $this->healthyCollection = $healthyCollection;
    }


}