<?php
namespace app\controller;

use app\model\main_soft\util\Main_softUtil;
use app\model\main_soft\util\TcpClientFactory;
use app\model\MongoManager;
use core\App;
use core\lib\Controller;
use core\lib\Request;
use core\lib\Util;
use Exception;
use MongoDB\BSON\UTCDateTime;

use app\model\tengjia\UserModel;

class Main_softController extends Controller{
    private $account;
    private $password;

    public function __construct(){
        $this->getSessionUser();
    }

    /**
     * @param $account
     * @param $password
     */
    protected function setSessionUser($account,$password){
        $session = App::getInstance()->getSESSION();
        $session[Main_softUtil::MAIN_SOFT_ACCOUNT] = $account;
        $session[Main_softUtil::MAIN_SOFT_PASSWORD] = $password;
        App::getInstance()->setSESSION($session);
    }

    /**
     * @return array [account,password]
     */
    protected function getSessionUser(){
        $this->setAccount(Request::getInstance()->hasSession(Main_softUtil::MAIN_SOFT_ACCOUNT));
        $this->setPassword(Request::getInstance()->hasSession(Main_softUtil::MAIN_SOFT_PASSWORD));
    }

    /**
     * @return string
     */
    protected function getSessionUsing(){
        return Request::getInstance()->hasSession(Main_softUtil::MAIN_SOFT_USING);
    }

    /**
     * @param $using
     */
    protected function setSessionUsing($using){
        $session = App::getInstance()->getSESSION();
        $session[Main_softUtil::MAIN_SOFT_USING] = $using;
        App::getInstance()->setSESSION($session);
    }


    public function actionLogin(){
        try{
            if(Request::getInstance()->isPost()){
                $account = Request::getInstance()->hasPost(self::ACCOUNT);
                if(!$account || !Util::getInstance()->isMobileNumber($account))
                    throw new Exception('用户名有误');

                $password = Request::getInstance()->hasPost(self::PASSWORD);
                if(!$password)
                    throw new Exception('密码有误');

                $res = Main_softUtil::getInstance()->getUserCollection()->find([
                    '_id'=>$account
                ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                    Main_softUtil::USER_USING,Main_softUtil::USER_PASSWORD,Main_softUtil::USER_NAME,Main_softUtil::USER_AVT
                ]));
                if(!is_array($res) || !$res[0] || !count($res[0])){
                    throw new Exception('账号还未注册');
                }else{
                    $arr = @Util::getInstance()->object2array($res[0][0]);
                    $pwd = Util::getInstance()->hasArr($arr,Main_softUtil::USER_PASSWORD);
                    if($pwd != $password){
                        throw new Exception('账号或密码有误');
                    }else{
                        $username = Util::getInstance()->hasArr($arr,Main_softUtil::USER_NAME);
                        if(!$username){
                            $username = '';
                        }
                        $avt = Util::getInstance()->hasArr($arr,Main_softUtil::USER_AVT);
                        $using = Util::getInstance()->hasArr($arr,Main_softUtil::USER_USING);
                        $this->setSessionUser($account,$password);
                        $this->setSessionUsing($using);
                        if(!$using){
                            $using = 0;
                            $devices = '';
                        }else{
                            $devices = [];
                            //get hasDeviceArr
                            $res = Main_softUtil::getInstance()->getUserCollection()->find([
                                '_id' => $account
                            ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                                Main_softUtil::USER_HASDEVICES
                            ]));
                            $arr = @Util::getInstance()->object2array($res[0][0]);
                            $hasDevices = Util::getInstance()->hasArr($arr,Main_softUtil::USER_HASDEVICES);
                            foreach($hasDevices as $k => $v){
                                if($v){
                                    $res = Main_softUtil::getInstance()->getUserCollection()->find([
                                        '_id' => $account
                                    ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                                        join('.',[Main_softUtil::USER_DEVICES,$v,Main_softUtil::DEVICE_INFO])
                                    ]));
                                    $arr = @Util::getInstance()->object2array($res[0][0]);
                                    $devices[$v] =  $arr[Main_softUtil::USER_DEVICES][$v];
                                }
                            }

                            $devices = json_encode($devices);
                        }
                        e(json_encode([self::CODE=>0,Main_softUtil::USER_NAME=>$username,Main_softUtil::USER_DEVICES=>$devices,Main_softUtil::USER_USING=>$using,Main_softUtil::USER_AVT=>$avt]));
                    }
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE => 1, self::MESSAGE => $e->getMessage()]));
        }
        q();
    }

//    public function actionRead_events(){
//        if(Request::isPost()){
//            $time = Request::hasPost(self::KEY);
//            if(!$time){
//                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
//                q();
//            }
//            $using = $this->getSessionUsing();
//
//            $user = new UserModel(SESSION_DB);
//            $res = $user->getManager()->update([
//                "_id" => $this->getAccount(),
//                join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_EVENT]) => $this->getAccount(),
//            ], [
//                join('.',[self::USER_DEVICES,$using,self::DEVICE_INFO,self::DEVICE_EVENT,'i-'.$index,self::FENCE_STATUS]) => $bool,
//            ]);
//            if(is_array($res)){
//                e(json_encode([self::CODE=>0]));
//            }else{
//                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
//            }
//            q();
//        }
//    }

    public function actionGet_last_position(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();

            $filter = [
                '_id'=>$this->getAccount()
            ];
            $arr = Main_softUtil::getInstance()->getUserCollection()->arr2need([
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_LON]),
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_LAT])
            ]);
            $res = Main_softUtil::getInstance()->getUserCollection()->find($filter,$arr);
            $arr = @Util::getInstance()->object2array($res[0][0]);

            $lon = @$arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_INFO][Main_softUtil::DEVICE_LON];
            $lat = @$arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_INFO][Main_softUtil::DEVICE_LAT];
            if(!$lon && !$lat){
                e(json_encode([self::CODE=>1]));
            }else{
                e(json_encode([self::CODE=>0, self::MESSAGE=>$lon."|".$lat]));
            }
            q();
        }
    }

    public function actionGet_info(){
        if(Request::getInstance()->isPost()){
            if(!$this->getAccount()){
                e(json_encode([self::CODE=>1]));
                q();
            }

            $filter = [
                '_id'=>$this->getAccount()
            ];
            $arr = Main_softUtil::getInstance()->getUserCollection()->arr2need([
                Main_softUtil::USER_USING,Main_softUtil::USER_NAME,Main_softUtil::USER_AVT
            ]);
            $res = Main_softUtil::getInstance()->getUserCollection()->find($filter,$arr);
            $arr = @Util::getInstance()->object2array($res[0][0]);
            $username = Util::getInstance()->hasArr($arr,Main_softUtil::USER_NAME)?:'';
            $avt = Util::getInstance()->hasArr($arr,Main_softUtil::USER_AVT)?:'';
            $using = Util::getInstance()->hasArr($arr,Main_softUtil::USER_USING)?:'';
            if(!$using){
                $devices = '';
            }else{
                $devices = [];
                //get hasDeviceArr
                $res = Main_softUtil::getInstance()->getUserCollection()->find([
                    '_id'=>$this->getAccount()
                ],[
                    Main_softUtil::USER_HASDEVICES
                ]);
                $arr = @Util::getInstance()->object2array($res[0][0]);
                $hasDevices = Util::getInstance()->hasArr($arr,Main_softUtil::USER_HASDEVICES);
                foreach($hasDevices as $k => $v){
                    if($v){
                        Main_softUtil::getInstance()->getUserCollection()->find([
                            '_id'=>$this->getAccount()
                        ],[
                            join('.',[Main_softUtil::USER_DEVICES,$v,Main_softUtil::DEVICE_INFO])
                        ]);
                        $arr = @Util::getInstance()->object2array($res[0][0]);
                        $devices[$v] =  $arr[Main_softUtil::USER_DEVICES][$v];
                    }
                }

                $devices = json_encode($devices);
            }
            e(json_encode([self::CODE=>0,Main_softUtil::USER_NAME=>$username,Main_softUtil::USER_DEVICES=>$devices,Main_softUtil::USER_USING=>$using,Main_softUtil::USER_AVT=>$avt]));
            q();
        }
    }

    public function actionAdd_event(){
        try{
            if(Request::getInstance()->isPost()){
                $using = $this->getSessionUsing();
                $sendValue = Request::getInstance()->hasPost(self::MESSAGE);
                if(!$sendValue)
                    throw new Exception('参数错误3');
                $type = Request::getInstance()->hasPost(self::TYPE);
                if(!$type)
                    $type = Main_softUtil::DEVICE_EVENT_TYPE_MESSAGE;
                $isrecieve = Request::getInstance()->hasPost(self::FACE);
                if(!$isrecieve)
                    $isrecieve = 0;
                //接收
                $status = 0;

                $relation = '';

                $filter = [
                    '_id'=>$this->getAccount()
                ];
                $arr = Main_softUtil::getInstance()->getUserCollection()->arr2need([
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FAMILY])
                ]);
                $res = Main_softUtil::getInstance()->getUserCollection()->find($filter,$arr);


                if(is_array($res)){
                    $arr =  @Util::getInstance()->object2array($res[0][0]);
                    $family = @$arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_FAMILY];
                    if($family){
                        foreach($family as $k => $v){
                            if($v[Main_softUtil::FAMILY_PHONE] == $this->getAccount()){
                                $relation =  $v[Main_softUtil::FAMILY_NAME];
                                break;
                            }
                        }
                    }else{
                        throw new Exception('参数错误4');
                    }
                }else{
                    throw new Exception('参数错误5');
                }

//                if(!$relation)
//                    throw new Exception('r');

                $now = time();
                $res = Main_softUtil::getInstance()->getEventsCollection()->insert([
                    Main_softUtil::USER_USING => $using,
                    Main_softUtil::DEVICE_EVENT_UTCTIME => (new UTCDateTime($now*1000)),
                    Main_softUtil::DEVICE_EVENT_INTTIME => $now,
                    Main_softUtil::DEVICE_EVENT_ISRECIEVE => $isrecieve,
                    Main_softUtil::DEVICE_EVENT_TYPE => $type,
                    Main_softUtil::DEVICE_EVENT_MESSAGE => $sendValue,
                    Main_softUtil::DEVICE_EVENT_STATUS => $status,
                ]);
                if(is_array($res)){
                    //通知手表
                    /**
                    通知下发协议- app端发起
                    下行协议号：0x1009
                    下行参数：通知内容（UTF8编码，小于128字节），时间戳
                    参数举例：“通知内容\r\n1469421531\r\n”
                     */
                    //链接
                    $client = TcpClientFactory::getInstance()->getClient();
                    if (!$client->connect(TcpClientFactory::IP, TcpClientFactory::PORT, 0.5))
                        throw new Exception('连接异常');
                    //组装
                    $body = chr(0x10).chr(0x09).TcpClientFactory::getInstance()->packMobileSocketData([$this->getSessionUsing(),$type,$relation.':'.$sendValue,$now]);
                    //发送
                    $client->send(Main_softUtil::getInstance()->addHeader($body));
                    //接收
                    $resArr = json_decode($client->recv(),true);
                    //关闭
                    $client->close();
                    if($resArr[self::CODE] !== '0'){
                        //发送失败
                       e(json_encode([self::CODE=>101,self::MESSAGE=>$resArr[self::CODE]])); //添加发送中图片
                    }else{
                        //通知成功 等待
                        e(json_encode([self::CODE=>0,self::MESSAGE=>$now])); //添加发送中图片
                    }
                }else{
                    throw new Exception('系统异常');
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_position_with_wifi(){
        if(Request::getInstance()->isPost()){
            $mac = Request::getInstance()->hasPost(self::CODE);
            if(!$mac){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }

            $res = file_get_contents('http://api.cellocation.com/wifi/?mac='.trim($mac).'&output=json');
            $arr = null;
            try{
                $arr = json_decode($res,true);
            }catch (\Exception $e){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"获取位置信息有误"]));
                q();
            }

            if($arr && Util::getInstance()->hasArr($arr, "errcode") == 0){
                e(json_encode([self::CODE=>0,self::MESSAGE=>$arr["address"]]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>Util::getInstance()->hasArr($arr, "errcode")]));
            }
            q();
        }
    }

    public function actionGet_position_with_baseStation(){
        if(Request::getInstance()->isPost()){
            $string = Request::getInstance()->hasPost(self::CODE);
            if(!$string){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }

            $resArr = explode('|',$string);
            $mcc = $resArr[0];
            $mnc = $resArr[1];
            $lac = $resArr[2];
            $cid = $resArr[3];

/**
http://api.cellocation.com/cell/?mcc=460&mnc=1&lac=4301&ci=20986&output=json
请求参数：
 * 460 1 9551 102289923
名称	类型	必填	说明
mcc	int	是	mcc国家代码：中国代码 460
mnc	int	是	mnc网络类型：0移动，1联通(电信对应sid)，十进制
lac	int	是	lac(电信对应nid)，十进制
ci	int	是	cellid(电信对应bid)，十进制
coord	string	否	坐标类型(wgs84/gcj02/bd09)，默认wgs84
output	string	否	返回格式(csv/json/xml)，默认csv
 * {"errcode":0, "lat":"22.568832", "lon":"113.855133", "radius":"289", "address":"广东省深圳市宝安区西乡街道宝源二区13号楼"}
 */
            $res = @file_get_contents("http://api.cellocation.com/cell/?mcc={$mcc}&mnc={$mnc}&lac={$lac}&ci={$cid}&output=json");
            $arr = null;
            try{
                $arr = json_decode($res,true);
            }catch (\Exception $e){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"获取位置信息有误"]));
                q();
            }

            if($arr && Util::getInstance()->hasArr($arr, "errcode") == 0){
                e(json_encode([self::CODE=>0,self::MESSAGE=>$arr["address"]]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>Util::getInstance()->hasArr($arr, "errcode")]));
            }
            q();
        }
    }


    public function actionGet_events(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();
            $dayago = Request::getInstance()->hasPost(self::KEY);
            if(!$dayago) {
                $dayago = 3;
            }
            $timeFlag = time()-86400*$dayago;

            //using = using && shijian xiaodatui 3tianqiand
            $filter = [
                Main_softUtil::USER_USING=>$using,
                Main_softUtil::DEVICE_EVENT_INTTIME => ['$gt' => $timeFlag]
            ];
            $option = Main_softUtil::getInstance()->getEventsCollection()->arr2need([
                Main_softUtil::DEVICE_EVENT_STATUS,
                Main_softUtil::DEVICE_EVENT_TYPE,
                Main_softUtil::DEVICE_EVENT_TYPE_MESSAGE,
                Main_softUtil::DEVICE_EVENT_TYPE_POSITIONWARNING,
                Main_softUtil::DEVICE_EVENT_MESSAGE,
                Main_softUtil::DEVICE_EVENT_ISRECIEVE,
                Main_softUtil::DEVICE_EVENT_INTTIME
            ]);
            $res = Main_softUtil::getInstance()->getEventsCollection()->find($filter,$option);
            $arr = $res[0];
            if(is_array($arr) && $arr){
                e(json_encode([self::CODE=>0,self::MESSAGE=>json_encode($arr)]));
            }else{
                e(json_encode([self::CODE=>1]));
            }
            q();
        }
    }

    public function actionSet_username(){
        if(Request::getInstance()->isPost()){
            $username = Request::getInstance()->hasPost(self::NAME);

            if(!$username || strlen($username) > 15){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"姓名错误"]));
                q();
            }

            $res = Main_softUtil::getInstance()->getUserCollection()->update([
                '_id' => $this->getAccount()
            ], [
                Main_softUtil::USER_NAME => $username,
            ],[false,false],'$set');

            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionFence_toggle(){
        if(Request::getInstance()->isPost()){
            $bool = Request::getInstance()->hasPost(self::TYPE);
            $bool = $bool? 1:0;

            $using = $this->getSessionUsing();
            $index = Request::getInstance()->hasPost(self::INDEX);
            if(!$index){
                $index = 0;
            }
            if($index!=0&&$index!=1&&$index!=2&&$index!=3&&$index!=4){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }

            $res = Main_softUtil::getInstance()->getUserCollection()->update(['_id'=>$this->getAccount()], [
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FENCE,'i-'.$index,Main_softUtil::FENCE_STATUS]) => $bool,
            ],[false,false],'$set');
            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionRegister(){
        try{
            if(Request::getInstance()->isPost()){
                $account = Request::getInstance()->hasPost(self::ACCOUNT);
                if(!$account || !Util::getInstance()->isMobileNumber($account))
                    throw new Exception('用户名有误');

                $password = Request::getInstance()->hasPost(self::PASSWORD);
                if(!$password)
                    throw new Exception('密码有误');

                if(strlen($password) != 32)
                    $password = md5($password);

                $res = Main_softUtil::getInstance()->getUserCollection()->insertById($account,[
                    Main_softUtil::USER_PASSWORD => $password
                ]);

                if(!is_array($res)){
                    switch($res){
                        default:
                        case MongoManager::ERR_DB:
                            throw new Exception('系统错误');
                            break;
                        case MongoManager::HAS_ID:
                            throw new Exception('该账号已经被注册');
                            break;
                    }
                }else{
                    e(json_encode([self::CODE=>0]));
                }

            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionBind(){
        try{
            if(Request::getInstance()->isPost()){
                //接收参数 进行 解析 todo
                $code = Request::getInstance()->hasPost(self::CODE);
                if(!is_numeric($code) || strlen($code.'')!=15)
                    throw new Exception('手表序列号格式错误');

                $num = Request::getInstance()->hasPost(self::NUM);
                if(!is_numeric($num) || strlen($num.'')!=4)
                    throw new Exception('S/N号码格式错误');

                $name = Request::getInstance()->hasPost(self::NAME);
                if(!$name || strlen($name.'')>15)
                    throw new Exception('姓名有误');

                $school = Request::getInstance()->hasPost(self::SCHOOL);
                if(!$school || strlen($school.'')>15)
                    throw new Exception('学校有误');

                //得到device_key
                $using = Main_softUtil::getInstance()->imei_to_key($code);

                //检测其他人是否已经注册过
                $filter = [ join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO]) => ['$type'=>3] ];//该key是一个对象
                $option = Main_softUtil::getInstance()->getUserCollection()->arr2need([
                    Main_softUtil::USER_PASSWORD
                ]);
                $res = Main_softUtil::getInstance()->getUserCollection()->find($filter,$option);
                $arr = @Util::getInstance()->object2array($res[0][0]);
                if($arr && $arr[Main_softUtil::USER_PASSWORD])
                    throw new Exception('该设备已经被关注');

                //这里先直接添加手表
                $res = Main_softUtil::getInstance()->getUserCollection()->find([
                    '_id'=>$this->getAccount()
                ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                    Main_softUtil::USER_HASDEVICES
                ]));
                if(count($res[0])){
                    $arr = @Util::getInstance()->object2array($res[0][0]);
                    $hasArr = Util::getInstance()->hasArr($arr,Main_softUtil::USER_HASDEVICES);
                }else{
                    $hasArr = null;
                }

                if($hasArr){
                    if(in_array($using,$hasArr)){
                        throw new Exception('不能重复绑定一个设备');
                    }else{
                        foreach($hasArr as $k => $v){
                            if(!$hasArr[$k]){
                                $hasArr[$k]=$using;
                                break;
                            }
                        }
                    }
                }else{
                    $hasArr = [
                        'i-0'=>$using,
                        'i-1'=>'',
                        'i-2'=>'',
                        'i-3'=>'',
                        'i-4'=>'',
                        'i-5'=>'',
                    ];
                }

                $filter = ['_id'=>$this->getAccount()];
                $res = Main_softUtil::getInstance()->getUserCollection()->update($filter,[
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO])=>[
                        Main_softUtil::DEVICE_IMEI=>$code,
                        Main_softUtil::DEVICE_NUM=>$num,
                        Main_softUtil::DEVICE_NAME=>$name,
                        Main_softUtil::DEVICE_AVT=>"a",
                        Main_softUtil::DEVICE_SCHOOL=>$school,
                        Main_softUtil::DEVICE_STEPS=>0,
                        Main_softUtil::DEVICE_LAT=>0,
                        Main_softUtil::DEVICE_LON=>0,
                        Main_softUtil::DEVICE_SEX=>1,
                        Main_softUtil::DEVICE_BIRTH=>0,
                    ],
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FAMILY])=>[
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                        [Main_softUtil::FAMILY_PHONE=>'',Main_softUtil::FAMILY_NAME=>''],
                    ],
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING])=>[
                        Main_softUtil::SETTING_CLASS=>[
                            'i-0'=>[
                                Main_softUtil::SETTING_CLASS_STATUS => 0,
                                Main_softUtil::SETTING_CLASS_WEEK => 0,
                                Main_softUtil::SETTING_CLASS_STARTH => 0,
                                Main_softUtil::SETTING_CLASS_STARTM => 0,
                                Main_softUtil::SETTING_CLASS_ENDH => 0,
                                Main_softUtil::SETTING_CLASS_ENDM => 0
                            ],
                            'i-1'=>[
                                Main_softUtil::SETTING_CLASS_STATUS => 0,
                                Main_softUtil::SETTING_CLASS_WEEK => 0,
                                Main_softUtil::SETTING_CLASS_STARTH => 0,
                                Main_softUtil::SETTING_CLASS_STARTM => 0,
                                Main_softUtil::SETTING_CLASS_ENDH => 0,
                                Main_softUtil::SETTING_CLASS_ENDM => 0
                            ],
                            'i-2'=>[
                                Main_softUtil::SETTING_CLASS_STATUS => 0,
                                Main_softUtil::SETTING_CLASS_WEEK => 0,
                                Main_softUtil::SETTING_CLASS_STARTH => 0,
                                Main_softUtil::SETTING_CLASS_STARTM => 0,
                                Main_softUtil::SETTING_CLASS_ENDH => 0,
                                Main_softUtil::SETTING_CLASS_ENDM => 0
                            ]
                        ],
                        Main_softUtil::SETTING_INTERVALSHUTDOWN=>[
                            'i-0'=>[
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 0,
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => 0,
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => 0
                            ],
                            'i-1'=>[
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 0,
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => 0,
                                Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => 0
                            ]
                        ],
                        Main_softUtil::SETTING_SYS=>[],
                        Main_softUtil::SETTING_CONTROL=>[],
                        Main_softUtil::SETTING_REMOVE_BIND=>[],
                        Main_softUtil::SETTING_BACKUP=>[]
                    ],
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FENCE])=>[
                        'i-0'=>[
                            Main_softUtil::FENCE_LAT => 0,
                            Main_softUtil::FENCE_LON => 0,
                            Main_softUtil::FENCE_NAME => '家',
                            Main_softUtil::FENCE_RADIUS => 0,
                            Main_softUtil::FENCE_ISDANGER => 0,
                            Main_softUtil::FENCE_STATUS => 0
                        ],
                        'i-1'=>[
                            Main_softUtil::FENCE_LAT => 0,
                            Main_softUtil::FENCE_LON => 0,
                            Main_softUtil::FENCE_NAME => '学校',
                            Main_softUtil::FENCE_RADIUS => 0,
                            Main_softUtil::FENCE_ISDANGER => 0,
                            Main_softUtil::FENCE_STATUS => 0
                        ],
                        'i-2'=>[
                            Main_softUtil::FENCE_LAT => 0,
                            Main_softUtil::FENCE_LON => 0,
                            Main_softUtil::FENCE_NAME => '公园',
                            Main_softUtil::FENCE_RADIUS => 0,
                            Main_softUtil::FENCE_ISDANGER => 0,
                            Main_softUtil::FENCE_STATUS => 0
                        ],
                        'i-3'=>[
                            Main_softUtil::FENCE_LAT => 0,
                            Main_softUtil::FENCE_LON => 0,
                            Main_softUtil::FENCE_NAME => '其他',
                            Main_softUtil::FENCE_RADIUS => 0,
                            Main_softUtil::FENCE_ISDANGER => 0,
                            Main_softUtil::FENCE_STATUS => 0
                        ],
                        'i-4'=>[
                            Main_softUtil::FENCE_LAT => 0,
                            Main_softUtil::FENCE_LON => 0,
                            Main_softUtil::FENCE_NAME => '其他',
                            Main_softUtil::FENCE_RADIUS => 0,
                            Main_softUtil::FENCE_ISDANGER => 0,
                            Main_softUtil::FENCE_STATUS => 0
                        ]
                    ],
                    Main_softUtil::USER_USING=>$using,
                    Main_softUtil::USER_HASDEVICES => $hasArr
                ],[false,true],'$set');

                if(is_array($res)){
                    $this->setSessionUsing($using);
                    $res = Main_softUtil::getInstance()->getUserCollection()->find([
                        '_id'=>$this->getAccount()
                    ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                        join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO])
                    ]));
                    $arr = @Util::getInstance()->object2array($res[0][0]);
                    $deviceInfo = $arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_INFO];
                    e(json_encode([self::CODE=>0,Main_softUtil::DEVICE_INFO=>json_encode($deviceInfo),Main_softUtil::USER_USING=>$using]));
                }else{
                    throw new Exception('系统错误');
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_sports_data(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();
            $dayago = Request::getInstance()->hasPost(self::STARTH);
            if(!$dayago) {
                $dayago = 3;
            }
            $timeFlag = time()-86400*$dayago;

            //using = using && shijian xiaodatui 3tianqiand
            $filter = [
                Main_softUtil::USER_USING=>$using,
                Main_softUtil::DEVICE_SPORTS_INTTIME => ['$gt' => $timeFlag]
            ];
            $option = Main_softUtil::getInstance()->getSportsCollection()->arr2need([
                Main_softUtil::DEVICE_SPORTS_INTTIME,
                Main_softUtil::DEVICE_SPORTS_POWER,
                Main_softUtil::DEVICE_SPORTS_STEPS
            ]);
            $res = Main_softUtil::getInstance()->getSportsCollection()->find($filter,$option);
            $arr = $res[0];
            if(is_array($arr) && $arr){
                e(json_encode([self::CODE=>0,self::MESSAGE=>json_encode($arr)]));
            }else{
                e(json_encode([self::CODE=>1]));
            }
            q();
        }
    }

    public function actionChange_using(){
        if(Request::getInstance()->isPost()){
            $code = Request::getInstance()->hasPost(self::CODE);
            if(!$code){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
                q();
            }

            //是否有这个using
            $res = Main_softUtil::getInstance()->getUserCollection()->find([
                '_id'=>$this->getAccount()
            ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                join('.',[Main_softUtil::USER_DEVICES,$code,Main_softUtil::DEVICE_INFO])
            ]));
            $arr = @Util::getInstance()->object2array($res[0][0]);
            if(is_array($arr[Main_softUtil::USER_DEVICES][$code][Main_softUtil::DEVICE_INFO])){
                $res = Main_softUtil::getInstance()->getUserCollection()->update([
                    '_id'=>$this->getAccount()
                ], [
                    Main_softUtil::USER_USING => $code
                ],[false,false],'$set');
                if(is_array($res)){
                    $this->setSessionUsing($code);
                    e(json_encode([self::CODE=>0]));
                }else{
                    e(json_encode([self::CODE=>1,self::MESSAGE=>$res]));
                }
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>'数据有误']));
            }
            q();
        }
    }

    public function actionDel_device(){
        try{
            if(Request::getInstance()->isPost()){
                $code = Request::getInstance()->hasPost(self::CODE);
                if(!$code)
                    throw new Exception('数据出错');

                $res = Main_softUtil::getInstance()->getUserCollection()->find([
                    '_id'=>$this->getAccount()
                ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                    Main_softUtil::USER_HASDEVICES
                ]));
                $arr = @Util::getInstance()->object2array($res[0][0]);
                $hasDevices = Util::getInstance()->hasArr($arr,Main_softUtil::USER_HASDEVICES);

                $flag = false;
                foreach($hasDevices as $k => $v){
                    if($v == $code){
                        $flag = true;
                        $hasDevices[$k] = '';
                        break;
                    }
                }
                if(!$flag)
                    throw new Exception('数据出错');


                //todo
                $res = Main_softUtil::getInstance()->getUserCollection()->update([
                    '_id'=>$this->getAccount()
                ],[
                    Main_softUtil::USER_HASDEVICES=>$hasDevices
                ],[false,false],'$set');
                $res = Main_softUtil::getInstance()->getUserCollection()->update([
                    '_id'=>$this->getAccount()
                ],[
                    join('.',[Main_softUtil::USER_DEVICES,$code])=>""
                ],[false,false],'$set');

                if(is_array($res)){
                    e(json_encode([self::CODE=>0]));
                }else{
                    throw new Exception($res);
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_setting(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();

            $res = Main_softUtil::getInstance()->getUserCollection()->find([
                '_id'=>$this->getAccount()
            ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING])
            ]));

            if(!is_array($res) || !$res[0] || !count($res[0])){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"系统出错"]));
            }else{
                $arr = @Util::getInstance()->object2array($res[0][0]);
                $setting = $arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_SETTING];
                e(json_encode([self::CODE=>0,Main_softUtil::DEVICE_SETTING=>json_encode($setting)]));
            }
            q();
        }
    }

    public function actionGet_family(){
        if(Request::getInstance()->isPost()){

            $using = $this->getSessionUsing();

            $res = Main_softUtil::getInstance()->getUserCollection()->find([
                '_id'=>$this->getAccount()
            ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FAMILY
            ]));

            if(!is_array($res) || !$res[0] || !count($res[0])){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"系统出错"]));
            }else{
                $arr = @Util::getInstance()->object2array($res[0][0]);
                $setting = $arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_FAMILY];
                e(json_encode([self::CODE=>0,self::MESSAGE=>json_encode($setting)]));
            }
            q();
        }
    }

    public function actionClass_hide_toggle(){
        if(Request::getInstance()->isPost()){
            $bool = Request::getInstance()->hasPost(self::TYPE);
            $bool = $bool? 1:0;

            $using = $this->getSessionUsing();
            $index = Request::getInstance()->hasPost('index');
            if(!$index){
                $index = 0;
            }
            if($index!=0&&$index!=1&&$index!=2){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }

            $res = Main_softUtil::getInstance()->getUserCollection()->update([
                '_id'=>$this->getAccount()
            ],[
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING,Main_softUtil::SETTING_CLASS,'i-'.$index,Main_softUtil::SETTING_CLASS_STATUS]) => $bool,
            ],[false,false],'$set');
            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionSet_user_avt(){
        if(Request::getInstance()->isPost()){
            $str = Request::getInstance()->hasPost(self::IMG);
            if(strlen($str)>20000){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"图片过大"]));
                q();
            }

            $res = Main_softUtil::getInstance()->getUserCollection()->update([
                '_id'=>$this->getAccount()
            ],[
                Main_softUtil::USER_AVT => $str
            ],[false,false],'$set');
            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionSet_avt(){
        if(Request::getInstance()->isPost()){
            $str = Request::getInstance()->hasPost(self::IMG);
            if(strlen($str)>20000){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"图片过大"]));
                q();
            }

            $using = $this->getSessionUsing();

            $res = Main_softUtil::getInstance()->getUserCollection()->update([
                '_id'=>$this->getAccount()
            ],[
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_AVT]) => $str
            ],[],'$set');
            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionAdd_class_hide(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();
            $index = Request::getInstance()->hasPost(self::INDEX);
            if(!$index){
                $index = 0;
            }
            if($index!=0&&$index!=1&&$index!=2){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }
            $week = (int)Request::getInstance()->hasPost(self::WEEK);
            $start_h = (int)Request::getInstance()->hasPost(self::STARTH);
            $start_m = (int)Request::getInstance()->hasPost(self::STARTM);
            $end_h = (int)Request::getInstance()->hasPost(self::ENDH);
            $end_m = (int)Request::getInstance()->hasPost(self::ENDM);
            //判断参数
            if(!is_numeric($week) ||!is_numeric($start_h) ||!is_numeric($start_m) ||!is_numeric($end_h) ||!is_numeric($end_m)){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"操作失败"]));
                q();
            }
            if($start_h>23 || $end_h>23 || $start_m>60 || $end_m>60){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"时间设置有误"]));
                q();
            }
            if($start_h>$end_h){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"时间设置有误"]));
            }else if($start_h==$end_h){
                if($start_m>=$end_m) {
                    e(json_encode([self::CODE => 1, self::MESSAGE => "时间设置有误"]));
                    q();
                }
            }

            $user = new UserModel(SESSION_DB);
            $res = $user->update($this->getAccount(), [
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING,Main_softUtil::SETTING_CLASS,'i-'.$index]) => [
                    Main_softUtil::SETTING_CLASS_STATUS => 1,
                    Main_softUtil::SETTING_CLASS_WEEK => $week,
                    Main_softUtil::SETTING_CLASS_STARTH => $start_h,
                    Main_softUtil::SETTING_CLASS_STARTM => $start_m,
                    Main_softUtil::SETTING_CLASS_ENDH => $end_h,
                    Main_softUtil::SETTING_CLASS_ENDM => $end_m
                ]
            ],'$set');
            if(is_array($res)){
                $set = json_encode([
                    Main_softUtil::SETTING_CLASS_STATUS => 1,
                    Main_softUtil::SETTING_CLASS_WEEK => $week,
                    Main_softUtil::SETTING_CLASS_STARTH => $start_h,
                    Main_softUtil::SETTING_CLASS_STARTM => $start_m,
                    Main_softUtil::SETTING_CLASS_ENDH => $end_h,
                    Main_softUtil::SETTING_CLASS_ENDM => $end_m
                ]);
                e(json_encode([self::CODE=>0,self::MESSAGE=>$set]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionInterval_shutdown_toggle(){
        if(Request::getInstance()->isPost()){
            $bool = Request::getInstance()->hasPost(self::TYPE);
            $bool = $bool? 1:0;
            $using = $this->getSessionUsing();
            $index = Request::getInstance()->hasPost(self::INDEX);
            if(!$index){
                $index = 0;
            }
            if($index!=0&&$index!=1){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
                q();
            }

            $user = new UserModel(SESSION_DB);
            $res = $user->update($this->getAccount(), [
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING,Main_softUtil::SETTING_INTERVALSHUTDOWN,'i-'.$index,Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS]) => $bool,
            ],'$set');
            if(is_array($res)){
                e(json_encode([self::CODE=>0]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionInterval_shutdown_update(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();
            $start_h = (int)Request::getInstance()->hasPost(self::STARTH);
            $start_m = (int)Request::getInstance()->hasPost(self::STARTM);
            $end_h = (int)Request::getInstance()->hasPost(self::ENDH);
            $end_m = (int)Request::getInstance()->hasPost(self::ENDM);
            //判断参数
            if(!is_numeric($start_h) ||!is_numeric($start_m) ||!is_numeric($end_h) ||!is_numeric($end_m)){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"操作失败"]));
                q();
            }
            if($start_h>23 || $end_h>23 || $start_m>60 || $end_m>60){
                e(json_encode([self::CODE=>1,self::MESSAGE=>"时间设置有误"]));
                q();
            }

            $user = new UserModel(SESSION_DB);
            $res = $user->update($this->getAccount(), [
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING,Main_softUtil::SETTING_INTERVALSHUTDOWN,"i-0"]) => [
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 1,
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => $start_h,
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => $start_m
                ],
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_SETTING,Main_softUtil::SETTING_INTERVALSHUTDOWN,"i-1"]) => [
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 1,
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => $end_h,
                    Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => $end_m
                ],
            ],'$set');
            if(is_array($res)){
                $message = json_encode([
                    'i-0'=> [
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 1,
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => $start_h,
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => $start_m
                    ],
                    'i-1'=>[
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_STATUS => 1,
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEH => $end_h,
                        Main_softUtil::SETTING_INTERVALSHUTDOWN_TIMEM => $end_m
                    ],
                ]);
                e(json_encode([self::CODE=>0,self::MESSAGE=>$message]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据出错"]));
            }
            q();
        }
    }

    public function actionSet_info(){
        try{
            if(Request::getInstance()->isPost()){
                $name = Request::getInstance()->hasPost(self::NAME);
                if(!$name || strlen($name)>12)
                    throw new Exception('姓名过长');

                $sex = (int)Request::getInstance()->hasPost(self::SEX);
                if($sex!==0 && $sex!==1)
                    throw new Exception('性别有误');

                $birth = Request::getInstance()->hasPost(self::BIRTH);
                $arr = explode('|',$birth);
                if(count($arr) != 3 || !is_numeric((int)$arr[0])|| !is_numeric((int)$arr[1])|| !is_numeric((int)$arr[2]))
                    throw new Exception('生日日期有误');

                $id = Request::getInstance()->hasPost(self::ID);
                if(!Util::getInstance()->validateIDCard($id))
                    throw new Exception('身份证号码错误');

                $hu = Request::getInstance()->hasPost(self::HU);
                $type = (int)Request::getInstance()->hasPost(self::TYPE);
                if(!$type)
                    $type = 0;

                if($type!==0 && $type!==1)
                    throw new Exception('请选择户口性质');

                $school = Request::getInstance()->hasPost(self::SCHOOL);
                if(!$school)
                    throw new Exception('学校不能为空');

                $class = Request::getInstance()->hasPost(self::CLAS);
                $face = Request::getInstance()->hasPost(self::FACE);
                $way = Request::getInstance()->hasPost(self::WAY);
                $live = Request::getInstance()->hasPost(self::LIVE);
                if(!$live)
                    throw new Exception('现住址不能为空');

                $using = $this->getSessionUsing();

                $res = Main_softUtil::getInstance()->getUserCollection()->update([
                    '_id'=>$this->getAccount()
                ],[
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_NAME]) => $name,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_SEX]) => $sex,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_BIRTH]) => $birth,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_ID]) => $id,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_HU]) => $hu,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_TYPE]) => $type,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_SCHOOL]) => $school,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_CLASS]) => $class,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_FACE]) => $face,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_SCHOOLWAY]) => $way,
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_INFO,Main_softUtil::DEVICE_LIVE]) => $live
                ],[false,false],'$set');
                if(is_array($res))
                    e(json_encode([self::CODE=>0]));
                else
                    throw new Exception('数据出错');
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_fence(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();

            $res = Main_softUtil::getInstance()->getUserCollection()->find([
                '_id'=>$this->getAccount()
            ],Main_softUtil::getInstance()->getUserCollection()->arr2need([
                join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FENCE])
            ]));
            $arr = @Util::getInstance()->object2array($res[0][0]);
            if(is_array($arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_FENCE])){
                e(json_encode([self::CODE=>0,self::MESSAGE=>json_encode($arr[Main_softUtil::USER_DEVICES][$using][Main_softUtil::DEVICE_FENCE])]));
            }else{
                e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误"]));
            }
            q();
        }
    }

    public function actionSave_fence(){
        try{
            if(Request::getInstance()->isPost()){
                $fenceKey = Request::getInstance()->hasPost(self::KEY);
                if(!in_array($fenceKey,['i-0','i-1','i-2','i-3','i-4']))
                    throw new Exception('数据有误');

                $name = Request::getInstance()->hasPost(self::NAME);
                if(strlen($name)>18)
                    throw new Exception('名称过长');

                $lon = Request::getInstance()->hasPost(self::LON);
                $lat = Request::getInstance()->hasPost(self::LAT);
                $isdanger = Request::getInstance()->hasPost(self::TYPE);
                if($isdanger!=1&&$isdanger!=0)
                    throw new Exception('数据有误');

                $status = Request::getInstance()->hasPost(self::STATUS);
                if($status!=1&&$status!=0)
                    throw new Exception('数据有误');

                $radius = Request::getInstance()->hasPost(self::RADIUS);
                if(!is_numeric($radius))
                    throw new Exception('半径错误');

                $using = $this->getSessionUsing();

                $res = Main_softUtil::getInstance()->getUserCollection()->update([
                    '_id'=>$this->getAccount()
                ],[
                    join('.',[Main_softUtil::USER_DEVICES,$using,Main_softUtil::DEVICE_FENCE,$fenceKey])=>[
                        Main_softUtil::FENCE_NAME => $name,
                        Main_softUtil::FENCE_LON => $lon,
                        Main_softUtil::FENCE_LAT => $lat,
                        Main_softUtil::FENCE_ISDANGER => $isdanger? 1:0,
                        Main_softUtil::FENCE_RADIUS => $radius,
                        Main_softUtil::FENCE_STATUS => $status? 1:0
                    ]
                ],[false,false],'$set');
                if(is_array($res)){
                    $message = json_encode([
                        Main_softUtil::FENCE_NAME => $name,
                        Main_softUtil::FENCE_LON => $lon,
                        Main_softUtil::FENCE_LAT => $lat,
                        Main_softUtil::FENCE_ISDANGER => $isdanger? 1:0,
                        Main_softUtil::FENCE_RADIUS => $radius,
                        Main_softUtil::FENCE_STATUS => $status? 1:0
                    ]);
                    e(json_encode([self::CODE=>0,self::MESSAGE=>$message]));
                }else{
                    throw new Exception('数据出错');
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_waypoint(){
        if(Request::getInstance()->isPost()){
            $using = $this->getSessionUsing();

            $dayago = Request::getInstance()->hasPost(self::STARTH);
            if(!$dayago) {
                $dayago = 10;
            }
            $timeFlag = time()-86400*$dayago;

            //using = using && shijian xiaodatui 3tianqiand
            $filter = [
                Main_softUtil::USER_USING=>$using,
                Main_softUtil::WAYPOINT_INTTIME=> ['$gt' => $timeFlag]
            ];
            $option = Main_softUtil::getInstance()->getWaypointCollection()->arr2need([
                Main_softUtil::WAYPOINT_INTTIME,
                Main_softUtil::WAYPOINT_POINTS
            ]);
            $res = Main_softUtil::getInstance()->getWaypointCollection()->find($filter,$option);
            $arr = $res[0];
            if(is_array($arr) && $arr){
                e(json_encode([self::CODE=>0,self::MESSAGE=>json_encode($arr)]));
            }else{
                e(json_encode([self::CODE=>1]));
            }
            q();
        }
    }

    /**
    app 通讯录设置协议-服务器端发起
    下行协议号：0x1007
    下行参数：编号/r/n操作/r/n姓名/r/n号码/r/n（编号为0-9，可设置10组号码；操作，0为删除，1为设置；操作为1时，带姓名和号码，姓名为UTF8编码，姓名和号码不可为空）
    参数举例：
    "1/r/n1/r/n小明/r/n15912345678/r/n"
    "1/r/n0/r/n"
    1
     */
    public function actionSet_family(){
        try{
            if(Request::getInstance()->isPost()){
                $msg = Request::getInstance()->hasPost(self::MESSAGE);
                if(strlen($msg) < 10)
                    throw new Exception('数据有误');
                //保存数据库
                $arr = [
                    Main_softUtil::DEVICE_PRE_FAMILY_LIST => $msg,
                    Main_softUtil::DEVICE_PRE_FAMILY_INTTIME => time()
                ];
                $res = Main_softUtil::getInstance()->getPrefamilyCollection()->update(['_id'=>$this->getSessionUsing()], $arr, [false, true]);

                if(is_array($res)){
                    //链接
                    $client = TcpClientFactory::getInstance()->getClient();
                    if (!$client->connect(TcpClientFactory::IP, TcpClientFactory::PORT, 0.5))
                        throw new Exception('连接异常');
                    //组装
                    $body = chr(0x10).chr(0x07).TcpClientFactory::getInstance()->packMobileSocketData([$this->getSessionUsing(),$msg]);
                    //发送
                    $client->send(Main_softUtil::getInstance()->addHeader($body));

                    //接收
                    $res = $client->recv();
                    //关闭
                    $client->close();
                    $resArr = json_decode($res, true);
                    if($resArr[self::CODE] != 0){
                        e(json_encode([self::CODE=>$resArr[self::CODE]]));//存在错误码
                    }else{
                        e(json_encode([self::CODE=>0]));//请等待 设备更新
                    }
                }else{
                    e(json_encode([self::CODE=>1,self::MESSAGE=>"数据有误h"]));
                }
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionGet_pre_family(){
        try{
            $res = Main_softUtil::getInstance()->getPrefamilyCollection()->find(['_id'=>$this->getSessionUsing()]);
            $arr = @Util::getInstance()->object2array($res[0][0]);
            if($arr){
                $msg = $arr[Main_softUtil::DEVICE_PRE_FAMILY_LIST];
                $insertTime = $arr[Main_softUtil::DEVICE_PRE_FAMILY_INTTIME];
                if(abs($insertTime-time()) < 10){
                    //保存
                    $familyList = [];
                    $listArr = explode('&',$msg);
                    foreach($listArr as $v){
                        $name_tel = explode(',',$v);
                        $familyList[] = [
                            Main_softUtil::FAMILY_NAME => $name_tel[0],
                            Main_softUtil::FAMILY_PHONE => $name_tel[1],
                        ];
                    }

                    $filter = [ join('.',[Main_softUtil::USER_DEVICES,$this->getSessionUsing(),Main_softUtil::DEVICE_INFO]) => ['$type'=>3] ];//该key是一个对象
                    $arr = [
                        join('.',[Main_softUtil::USER_DEVICES,$this->getSessionUsing(),Main_softUtil::DEVICE_FAMILY])=>$familyList
                    ];
                    $res = Main_softUtil::getInstance()->getUserCollection()->update($filter,$arr);
                    if(is_array($res)){
                        e(json_encode([self::CODE=>0]));
                    }else{
                        throw new Exception('mongo error');
                    }
                }else{
                    throw new Exception('save error');
                }
            }else{
                throw new Exception('no data');
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    /**
    实时定位协议 - app端发起
    App 上行协议号：0x1004
    1开启wifi+gps；2仅开启wifi；3仅开启gps
     */
    public function actionSet_location_type(){
        $type = 1;
        $device = Request::getInstance()->hasPost(self::ACCOUNT);

        $this->clientSendWithNoResult([$device,$type]);
    }

    /**
    关机协议 - app端发起
    App 上行协议号：0x1005
    1
     */
    public function actionSet_shut_down(){
        $device = Request::getInstance()->hasPost(self::ACCOUNT);

        $this->clientSendWithNoResult([$device,1]);
    }

    /**
    监听协议- app端发起
    下行协议号：0x1008
    下行参数：监听号码
    参数举例：“15912345678/r/n”
     */
    public function actionSet_monitor(){
        $type = Request::getInstance()->hasPost(self::TEL);
        $device = Request::getInstance()->hasPost(self::ACCOUNT);

        $this->clientSendWithNoResult([$device,$type]);
    }

    private function clientSendWithNoResult($arr){
        //链接
        $client = TcpClientFactory::getInstance()->getClient();
        if (!$client->connect(TcpClientFactory::IP, TcpClientFactory::PORT, 0.5)){
            e(json_encode([self::CODE=>1,self::MESSAGE=>"连接异常"]));
            q();
        }
        //组装
        $body = chr(0x10).chr(0x04).TcpClientFactory::getInstance()->packMobileSocketData($arr);
        //发送
        $client->send(Main_softUtil::getInstance()->addHeader($body));
        //接收
        e($client->recv());
        //关闭
        $client->close();
        q();
    }

    /**
     * @return mixed
     */
    public function getAccount()
    {
        return $this->account;
    }

    /**
     * @param mixed $account
     */
    public function setAccount($account)
    {
        $this->account = $account;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }
}