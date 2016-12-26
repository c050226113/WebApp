<?php
namespace app\controller;
use core\lib\Controller;

class SysController extends Controller
{
    private $serverName = "server_first";

    public function actionCpu(){
        //获取时间range 默认是今天一天
        $startStr = Request::hasGet("s");
        if(!$startStr){
            $startTime = strtotime(date("Y-m-d 00:00:00"));
        }else{
            $startTime = strtotime($startStr);
        }
        $endStr = Request::hasGet("e");
        if(!$endStr){
            $endTime = strtotime(date("Y-m-d 23:59:59"));
        }else{
            $endTime = strtotime($endStr);
        }

        //获取系统cpu的数据
        $mongoManager = new MongoManager($this->serverName,"cpu");
        $res = $mongoManager->find([
            "_id" => ["\$lt"=>$endTime,"\$gt"=>$startTime],
        ],[
            'sort' => ['_id' => 1],
        ]);

        //得到系统时间信息
        if(is_array($res)){
            $computer = [];
            foreach($res[0] as $document){
                $dataArr = @Util::object2array($document->data);
                $computer[$document->_id] = $dataArr;
            }
        }else{
            throw new Exception(json_encode(["err"=>$res]));
        }

        Response::render("sys/cpu",[
            "serverName" => $this->serverName,
            "computer"=>$computer
        ]);
    }

    public function actionMem(){
        //获取时间range 默认是今天一天
        $startStr = Request::hasGet("s");
        if(!$startStr){
            $startTime = strtotime(date("Y-m-d 00:00:00"));
        }else{
            $startTime = strtotime($startStr);
        }
        $endStr = Request::hasGet("e");
        if(!$endStr){
            $endTime = strtotime(date("Y-m-d 23:59:59"));
        }else{
            $endTime = strtotime($endStr);
        }

        //获取系统cpu的数据
        $mongoManager = new MongoManager($this->serverName,"mem");
        $res = $mongoManager->find([
            "_id" => ["\$lt"=>$endTime,"\$gt"=>$startTime],
        ],[
            'sort' => ['_id' => 1],
        ]);

        //得到系统时间信息
        if(is_array($res)){
            $computer = [];
            foreach($res[0] as $document){
                $dataArr = @Util::object2array($document->data);
                $computer[$document->_id] = $dataArr;
            }
        }else{
            throw new Exception(json_encode(["err"=>$res]));
        }

        Response::render("sys/mem",[
            "serverName" => $this->serverName,
            "computer"=>$computer
        ]);
    }
}