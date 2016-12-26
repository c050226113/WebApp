<?php
namespace app\model\tengjia;
use app\controller\Main_softController;
use app\model\MongoManager;
use core\lib\Util;
use Exception;

class UserModel{
    private $db = null;
    private $collection = "user";
    private $mongoManager = null;

    public function __construct($db){
        $this->db = $db;
        $this->mongoManager = new MongoManager($this->db,$this->collection);
    }

    public function getManager(){
        return $this->mongoManager;
    }

    public function getInfo($account, $arr){
        return $this->mongoManager->find(["_id"=>$account],$this->mongoManager->arr2need($arr));
    }

    public function getAllInfo($account){
        $res = $this->mongoManager->find(["_id"=>$account]);
        if(is_array($res)){
            return @Util::object2array($res[0][0]);
        }else{
            throw new Exception($res);
        }
    }

    public function register($account,$password){
        if(strlen($password) != 32){
            $password = md5($password);
        }
        $res = $this->mongoManager->insertById($account,[
            Main_softController::USER_PASSWORD => $password
        ]);
        if(is_array($res)){
            return [true];
        }else{
            switch($res){
                default:
                case MongoManager::ERR_DB:
                    return "系统错误";
                    break;
                case MongoManager::HAS_ID:
                    return "该账号已经被注册";
                    break;
            }
        }
    }

    public function update($account,$arr,$opt){
        return $this->mongoManager->update(["_id"=>$account],$arr,[false,false],$opt);
    }

    public function remove(){

    }
}