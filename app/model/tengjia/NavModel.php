<?php
namespace app\model\tengjia;
//首页-关于我们-新闻中心-产品中心-在线商城-APP下载-固件升级
class NavModel{
    public function __construct(){
        $arr = explode("webapp",$_SERVER["REQUEST_URI"]);
        if($arr[0]){
            $this->host = $_SERVER["HTTP_ORIGIN"].$arr[0]."webapp/view/main";
        }else{
            $this->host = $_SERVER["HTTP_ORIGIN"];
        }
    }

    public function getJson(){
        $arr = [
            [
                ['shouye','home']
            ],

            [
                ['guanyuwomen',''],
                ['gongsijianjie','aboutUs'],
                ['lianxiwomen','contact']
            ],

            [
                ['xinwenzhongxin','news']
            ],

            [
                ['chanpingzhongxin',''],
                ['tengxunertongshoubiaoxilie','watch2'],
                ['ertongpingpandiannao','tabletPc'],
                ['ertongqqjing','mirror'],
                ['ertongyanbaobiao','guard']
            ],

            [
                ['zaixianshanchen','home']
            ],

            [
                ['appxiazai','appdownload']
            ],

            [
                ['gujianshengji','update'],
            ],

        ];

        return json_encode($arr);
    }
}