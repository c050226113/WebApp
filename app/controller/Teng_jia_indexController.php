<?php
namespace app\controller;
use app\model\tengjia\LinkModel;
use app\model\tengjia\NavModel;
use app\model\tengjia\ProductsModel;
use core\lib\Controller;
use core\lib\Request;
use core\lib\Response;
use core\lib\Session;

class Teng_jia_indexController extends Controller
{
    public function actionAdmin_login(){
        if(count($_POST)>0){
            $account = Request::hasPost('acc');
            $password =  Request::hasPost('pwd');
            if(!$account || !$password){
                e(json_encode(['code'=>1,'msg'=>'参数错误']));
                q();
            }

            if($account == 'tengjia' && $password == '1234567'){
                Session::$_SESSION['account'] = $account;
                Session::$_SESSION['password'] = $password;
                e(json_encode(['code'=>0]));
            }else{
                e(json_encode(['code'=>1,'msg'=>'用户名或密码错误']));
            }
            q();
        }else{
            if(Session::$_SESSION['account'] == 'tengjia' && Session::$_SESSION['password'] == '1234567'){
                Response::redirect('teng_jia_index/admin',[]);
            }else{
                $arr = explode("webapp",$_SERVER['REQUEST_URI']);
                Response::render('teng_jia_index/admin_login',[
                    'mainDir'=> $arr[0]."webapp/view/main/"
                ]);
            }
        }
    }

    public function actionAdmin(){
        if(Session::$_SESSION['account']){
            Response::render('teng_jia_index/admin',[
                'mainDir'=>'/webapp/view/main/'
            ]);
        }else{
            Response::redirect('teng_jia_index/admin_login',[]);
        }
    }

    public function actionGet_link_contents(){
        $linkModel = new LinkModel();
        $string = $linkModel->getJson();
        if($string){
            e(json_encode(['code'=>0,'msg'=>$string]));
        }
        q();
    }

    public function actionGet_nav_contents(){
        $navModel = new NavModel();
        $string = $navModel->getJson();
        if($string){
            e(json_encode(['code'=>0,'msg'=>$string]));
        }
        q();
    }

    public function actionGet_left_product(){
        $productsModel = new ProductsModel();
        $string = $productsModel->getJson();
        if($string){
            e(json_encode(['code'=>0,'msg'=>$string]));
        }
        q();
    }
}

