<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/26 0026
 * Time: 11:30
 */

namespace core\lib\app;


use core\lib\Route;
use Exception;
use ReflectionMethod;

class AbstractApp {
    protected $request;
    protected $response;
    protected $_SESSION= [];
    protected $isSessionListenChange=false;
    protected $isSessionChange=false;

    private function initSetting(){
        DEBUG?error_reporting(1):error_reporting(0);
    }

    //初始化过后运行实例
    public function run(){
        $this->initSetting();

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
}
