<?php
namespace app\controller;

use core\lib\Controller;
use core\lib\Request;

class Teng_jia_settingController extends Controller{
    public function __construct(){
        parent::__construct();
        if(!$_SESSION['account']){
            e('000');
            q();
        }
    }
    public function actionSet_translate(){
        $json = Request::hasPost('json');

        $content = 'var translate = {';
        foreach($json as $key => $val){
            $content .= $key.':["'.$val[0].'","'.$val[1].'"],';
        }
        $content .= 'apple1212:["苹果1212","apple"]};';

        $res = file_put_contents(ROOT_DIR.'view/main/js/translate.js', $content);

        e($res);
        q();
    }
}