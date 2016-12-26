<?php

namespace app\controller;

use core\lib\Controller;
use core\lib\HttpHelper;
use core\lib\Request;
use core\lib\Response;
use core\lib\Session;
use Exception;


class PayqiController extends Controller{
    private $cookie;

    private $db = [
        'yx'=>'123456yyyxxx'
    ];
    private $username;
    private $password;

    public function __construct(){
        $this->setCookie($this->makeTheCookie());
    }

    public function setSessionUser(){
        Session::$_SESSION['PayqiController_user'] = $this->getUsername();
        Session::$_SESSION['PayqiController_password'] = $this->getPassword();
    }
    public function getSessionUser(){
        $this->setUsername(Request::hasSession('PayqiController_user'));
        $this->setPassword(Request::hasSession('PayqiController_password'));
    }
    private function event_loginSuccess(){
        $this->setSessionUser();
    }

    public function actionLogin(){
        try{
            if(Request::isPost()){
                $this->setUsername(Request::hasPost(self::NAME));
                $this->setPassword(Request::hasPost(self::PASSWORD));
                $checkCode = Request::hasPost(self::CODE);

                $pwd = @$this->getDb()[$this->getUsername()];
                if(!$pwd)
                    throw new Exception('没有该用户');

                if($this->getPassword() != $pwd)
                    throw new Exception('密码或账户有错误');

                $url = 'http://120.24.180.7:8088/peiqi/web/index.php?r=admin/login';
                $res = HttpHelper::httpCurl($url, [
                    'username'=>'caiwj',
                    'password'=>'caiwj143',
                    'checkCode'=> trim($checkCode)
                ], $this->getCookie());
                $arr = json_decode($res,true);
                if($arr['code'])
                    throw new Exception($arr['msg']);

                $this->event_loginSuccess();

                e(json_encode([self::CODE=>0,'html'=>$res]));
            }else{
                Response::render('payqi/login',[]);
            }
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));
        }
        q();
    }

    public function actionPre_login(){
        try{
            $url = 'http://120.24.180.7:8088/peiqi/web/index.php?r=admin/getcheckcodeimg';
            $imgContent = HttpHelper::httpCurl($url,[],$this->getCookie());
            $name = mt_rand(0,9999);
            file_put_contents("./view/payqi/img/aaa{$name}.png",$imgContent);
            e("aaa{$name}");
        }catch (Exception $e){
            e(json_encode([self::CODE=>1,self::MESSAGE=>$e->getMessage()]));

        }
        q();
    }

    public function makeTheCookie(){
        $arr = explode('-',date('Y-m-d'));
        $choose = [
            'a','q','w','e','r','t','y','u','i','o','p','l','k','j','h','g','f','d',
            's','a','z','c','v','b','n','m','1','2','3','4','5','6','7','8','9'
        ];
        return 'auh1sc4303q8vgrvmn1mtdvsu'.$choose[intval($arr[1])];
    }

    /**
     * @param string $cookie
     */
    public function setCookie($cookie)
    {
        $this->cookie = $cookie;
    }

    /**
     * @return mixed
     */
    public function getCookie()
    {
        return $this->cookie;
    }

    /**
     * @return array
     */
    public function getDb()
    {
        return $this->db;
    }

    /**
     * @param array $db
     */
    public function setDb($db)
    {
        $this->db = $db;
    }

    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username)
    {
        $this->username = $username;
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