<?php
namespace app\model\tengjia;

class LinkModel{

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
            ['chanpingzhongxin',
                ['dierdaizhinengshoubiao','watch2'],
                ['ertongpingpandiannao','tabletPc'],
                ['ertongqqjing','mirror'],
                ['ertongyanbaobiao','guard'],
            ],
//            ['xinwendongtai',
//                ['gongsixinwen',''],
//                ['hanyedongtai',''],
//                ['shipingzhongxin','']
//            ],
            ['guanyuwomen',
                ['guanyutengxuertongshoubiao','aboutUs'],
                ['lianxiwomen','contact']
            ],
            ['zaixianshanchen',
                ['zaixianshanchen','']
            ],
            ['xinwenzhongxin',
                ['xinwenzhongxin','news'],
//                ['shiyongshuoming',''],
//                ['shiyongshuoming','']
            ],
        ];

        return json_encode($arr);
    }
}