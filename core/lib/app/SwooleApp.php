<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/26 0026
 * Time: 11:28
 */

namespace core\lib\app;


use app\model\main_soft\util\Main_softUtil;
use core\App;
use core\delegate\IAbstractApp;
use core\lib\Request;
use core\lib\Util;
use Exception;
use MongoDB\BSON\UTCDateTime;

class SwooleApp extends AbstractApp implements IAbstractApp{
    public function create($request = null, $response = null){
        $this->setRequest($request);
        $this->setResponse($response);
        $this->sessionStart();
    }

    public function sessionStart()
    {
        if(!Request::getInstance()->hasPost(COOKIE_SESSION_KEY)){//没有会员卡
            $this->insertNewSessionId();//办卡
        }else{//有卡
            $res = Main_softUtil::getInstance()->getSessionCollection()->find(["_id"=>Request::getInstance()->hasPost(COOKIE_SESSION_KEY)],[]);
            if(is_array($res)){
                if($res[0]){//卡正常
                    $this->setSESSION(Util::getInstance()->object2array($res[0][0]->data));//读卡的信息 进入app
                }else{//会员过期
                    $this->insertNewSessionId();//重新办卡
                }
            }else{
                throw new Exception($res);
            }
        }
        $this->setIsSessionListenChange(true);
    }

    private function insertNewSessionId(){
        $sessionId = $this->makeASessionId();
        $res = Main_softUtil::getInstance()->getSessionCollection()->insertById($sessionId,[
            "t" => (new UTCDateTime($this->getRequest()->server['request_time']*1000)),
            "data" => []
        ]);

        if(!is_array($res)){
            throw new Exception("db_error");
        }else{
            e($sessionId);
            q();
        }
    }

    private function makeASessionId(){
        return md5(microtime().rand(0,99999));
    }

    private function sessionSave(){
        if($this->isIsSessionChange()){
            $res = Main_softUtil::getInstance()->getSessionCollection()->update([
                "_id"=>Request::getInstance()->hasPost(COOKIE_SESSION_KEY)],
                ["data"=>$this->getSESSION()]
            );

            return is_array($res)? true:false;
        }else{
            return true;
        }
    }

    public function destroy(){
        $this->sessionSave();
        App::getInstance()->getResponse()->end();
    }

    public function funcEcho($str){
        App::getInstance()->getResponse()->write($str);
    }

    public function funcQuit()
    {
        throw new Exception('0');
    }
}