<?php
namespace app\model\main_soft;

use app\controller\Main_softController;
use app\model\MongoManager;
use core\lib\Util;
use MongoDB\BSON\UTCDateTime;

class DeviceInfo {
    /**
     * @param $using
     * @param $lon
     * @param $lat
     * @param $radius
     * @return string
     */
    public function setPositionStatus($using,$lon,$lat,$radius = 0){
        $userCollection = new MongoManager(Main_softController::DB_NAME, Main_softController::USER_COLLECTION);

        //找到using为obj的user
        $filter = [join('.',[Main_softController::USER_DEVICES,$using])=>['$type'=>3]];
        $option = $userCollection->arr2need([
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_FENCE]),
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_LOCATION_TYPE])
        ]);
        $res = $userCollection->find($filter,$option);
        $arr = @Util::object2array($res[0][0]);

        //初始化 $positionStatus
        $positionStatus = Main_softController::DEVICE_LOCATION_OUT;
        if(is_array($arr)) {
            //改变 $positionStatus
            foreach ($arr[Main_softController::USER_DEVICES][$using][Main_softController::DEVICE_FENCE] as $v) {
                $status = $v[Main_softController::FENCE_STATUS];
                if (!$status) {
                    continue;
                }
                $fenceLon = $v[Main_softController::FENCE_LON];
                $fenceLat = $v[Main_softController::FENCE_LAT];
                $isDanger = $v[Main_softController::FENCE_ISDANGER];
                $fenceRadius = $v[Main_softController::FENCE_RADIUS];
                //todo PHP2C
                $distance = Util::GetDistance($fenceLat, $fenceLon, $lat, $lon);
                if ($distance < $fenceRadius) {
                    if ($isDanger) {
                        $positionStatus = Main_softController::DEVICE_LOCATION_INDANGER;
                    } else {
                        $positionStatus = Main_softController::DEVICE_LOCATION_INSAVE;
                    }
                    break;
                }
            }
        }

        //得到 之前的 $positionStatus
        $lastType = @$arr[Main_softController::USER_DEVICES][$using][Main_softController::DEVICE_INFO][Main_softController::DEVICE_LOCATION_TYPE];
        if(!$lastType){
            $lastType = Main_softController::DEVICE_LOCATION_OUT;
        }
        if($positionStatus != $lastType) {//添加event
            $message = '';
            if ($positionStatus == Main_softController::DEVICE_LOCATION_INSAVE) {//进入安全区域
                $message = '进入安全区域';
            } else if ($positionStatus == Main_softController::DEVICE_LOCATION_INDANGER) {//进入危险区域
                $message = '进入危险区域';
            } else if ($lastType == Main_softController::DEVICE_LOCATION_INSAVE) {//离开安全区域
                $message = '离开安全区域';
            } else if ($lastType == Main_softController::DEVICE_LOCATION_INDANGER) {//离开危险区域
                $message = '离开危险区域';
            }

            if ($message) {
                $eventsCollection = new MongoManager(Main_softController::DB_NAME, Main_softController::EVENTS_COLLECTION);
                $now = time();
                $eventsCollection->insert([
                    Main_softController::USER_USING => $using,
                    Main_softController::DEVICE_EVENT_UTCTIME => (new UTCDateTime($now*1000)),
                    Main_softController::DEVICE_EVENT_INTTIME => $now,
                    Main_softController::DEVICE_EVENT_ISRECIEVE => 1,
                    Main_softController::DEVICE_EVENT_TYPE => Main_softController::DEVICE_EVENT_TYPE_POSITIONWARNING,
                    Main_softController::DEVICE_EVENT_MESSAGE => $message,
                    Main_softController::DEVICE_EVENT_STATUS => 0,
                ]);
            }
        }

        //update user info
        $filter = [join('.',[Main_softController::USER_DEVICES,$using])=>['$type'=>3]];
        $arr = [
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_LON])=>$lon,
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_LAT])=>$lat,
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_LOCATION_TYPE])=>$positionStatus,
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_RADIUS])=>$radius,
            join('.',[Main_softController::USER_DEVICES,$using,Main_softController::DEVICE_INFO,Main_softController::DEVICE_LOCATIONTYPE])=>Main_softController::DEVICE_LOCATIONTYPE_WIFI,
        ];
        return $userCollection->update($filter, $arr);
    }
}