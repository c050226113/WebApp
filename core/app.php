<?php
namespace core;
use app\model\main_soft\util\Main_softUtil;
use core\lib\Request;
use core\lib\Route;
use core\lib\Util;
use Exception;
use ReflectionMethod;
use stdClass;
use MongoDB\BSON\UTCDateTime;

class App
{
    private $request;
    private $response;
    private $_SESSION= [];
    private $isSessionListenChange=false;
    private $isSessionChange=false;

    private static $self;
    private function __construct(){}

    /**
     * @param mixed $self
     */
    public static function setSelf($self)
    {
        self::$self = $self;
    }

    public static function getInstance(){
        if(!self::$self){
            self::$self = new App();
        }
        return self::$self;
    }

    //当一个请求过来的时候的 进行初始化 $request $response $_SESSION
    public function create($request = null, $response = null){
        if(IS_SWOOLE){
            $this->setRequest($request);
            $this->setResponse($response);
            $this->swooleSessionStart();
        }else{
            $this->response = $this->request = new stdClass();
            $this->request->get = &$_GET;
            $this->request->post = &$_POST;
            $this->request->cookie = &$_COOKIE;
            $this->fpmSessionStart();
        }
    }

    //初始化过后运行实例
    public function run(){
        $class_method = Route::getInstance()->getRoute();

        $class = 'app\\controller\\'.$class_method[0];

        try{
            $class = new $class();
        }catch (Exception $e){
            throw new Exception("404:1");
        }

        try{
            $method = new ReflectionMethod($class, $class_method[1]);
        }catch (Exception $e){
            throw new Exception("404:2");
        }

        if($method){
            $method->invoke($class);
        }else{
            throw new Exception("404:3");
        }
    }

    private function swooleSessionStart(){
        if(!Request::getInstance()->hasPost(COOKIE_SESSION_KEY)){//没有会员卡
            $this->insertNewSessionId();//办卡
        }else{//有卡
            $res = Main_softUtil::getInstance()->getSessionCollection()->find(["_id"=>Request::getInstance()->hasPost(COOKIE_SESSION_KEY)],[]);
            if(is_array($res)){
                if($res[0]){//卡正常
                    $this->setSESSION(Util::getInstance()->object2array($res[0][0]->data));//读卡的信息 进入app
                    $this->setIsSessionListenChange(true);
                }else{//会员过期
                    $this->insertNewSessionId();//重新办卡
                }
            }else{
                throw new Exception($res);
            }
        }
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

    private function fpmSessionStart(){
        session_start();
        $this->setSESSION($_SESSION);
        unset($_SESSION);
        $this->setIsSessionListenChange(true);
    }

    private function makeASessionId(){
        return md5(microtime().rand(0,99999));
    }

    public function destroy(){
        $this->sessionSave();
        App::getInstance()->getResponse()->end();
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

    /**
     * @return mixed
     */
    public function getRequest()
    {
        return $this->request;
    }

    /**
     * @param mixed $request
     */
    public function setRequest($request)
    {
        $this->request = $request;
    }

    /**
     * @return mixed
     */
    public function getResponse()
    {
        return $this->response;
    }

    /**
     * @param mixed $response
     */
    public function setResponse($response)
    {
        $this->response = $response;
    }

    /**
     * @return array
     */
    public function getSESSION()
    {
        return $this->_SESSION;
    }

    /**
     * @param array $SESSION
     */
    public function setSESSION($SESSION)
    {
        if($this->isIsSessionListenChange()){
            $this->setIsSessionChange(true);
        }
        $this->_SESSION = $SESSION;
    }

    /**
     * @return boolean
     */
    public function isIsSessionChange()
    {
        return $this->isSessionChange;
    }

    /**
     * @param boolean $isSessionChange
     */
    public function setIsSessionChange($isSessionChange)
    {
        $this->isSessionChange = $isSessionChange;
    }

    /**
     * @return boolean
     */
    public function isIsSessionListenChange()
    {
        return $this->isSessionListenChange;
    }

    /**
     * @param boolean $isSessionListenChange
     */
    public function setIsSessionListenChange($isSessionListenChange)
    {
        $this->isSessionListenChange = $isSessionListenChange;
    }

}