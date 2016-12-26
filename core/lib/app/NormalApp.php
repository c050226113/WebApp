<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/26 0026
 * Time: 11:28
 */

namespace core\lib\app;


use core\delegate\IAbstractApp;
use stdClass;

class NormalApp extends AbstractApp implements IAbstractApp{
    public function create(){
        $this->response = $this->request = new stdClass();
        $this->request->get = &$_GET;
        $this->request->post = &$_POST;
        $this->request->cookie = &$_COOKIE;
        $this->sessionStart();
    }

    public function sessionStart(){
        session_start();
        $this->setSESSION($_SESSION);
        unset($_SESSION);
        $this->setIsSessionListenChange(true);
    }

    public function funcEcho($str)
    {
        echo $str;
    }

    public function funcQuit()
    {
        exit;
    }
}