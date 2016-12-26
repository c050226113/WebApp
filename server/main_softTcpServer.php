<?php
use app\model\main_soft\SocketGpsUpload;
use app\model\main_soft\SocketHeartBeat;
use app\model\main_soft\SocketHeartRate;
use app\model\main_soft\SocketPositionUpload;
use app\model\main_soft\SocketReadEvent;
use app\model\main_soft\SocketSetContacts;
use app\model\main_soft\SocketSetLocationType;
use app\model\main_soft\SocketSetMonitor;
use app\model\main_soft\SocketSetNotice;
use app\model\main_soft\SocketSetShutDown;
use app\model\main_soft\SocketShowEvent;
use app\model\main_soft\SocketSosReceive;
use app\model\main_soft\util\SocketServer;
use core\lib\Controller;
use server\ServerFactory;

$server = new swoole_server("0.0.0.0", 9501);
$server->set(array(
    'worker_num' => 1,
    'daemonize' => false,
    'max_request' => 300,
    'dispatch_mode' => 2,
    'package_max_length' => 4096,
    'open_length_check' => true,
    'package_length_offset' => 0,
    'package_body_offset' => 0,
    'package_length_type' => "N",//0 后 N(4位)是长度
    'open_cpu_affinity' => true,
    'log_file' =>'/var/www/html/webapp/server/log/socket.log'
));
$server->on('start',function(){
    swoole_set_process_name("sw_socket_m");
});
$server->on('connect', function ($serv, $fd){
    echo "Client{$fd}:Connect.\n";
});
$server->on('workerstart', function ($server, $worker_id) {
    define("ROOT_DIR",'/var/www/html/webapp/');
    define("CORE_DIR",ROOT_DIR."core/");
    require_once('/var/www/html/webapp/server/ServerFactory.php');
    spl_autoload_register('server\ServerFactory::autoLoad');
    ServerFactory::getInstance()->createServer();
});
$server->on('receive', function ($server, $fd, $from_id, $data) {
    try{
        switch($data[4].$data[5]){//匹配协议头
            case SocketServer::getInstance()->getProtoHead()["heart"]: //DEV 握手+心跳+状态上传协议
                $socketLink = new SocketHeartBeat($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketHeartBeat_mongo_error\r\n");
                else
                    $socketLink->response();
                break;
            case  SocketServer::getInstance()->getProtoHead()["wifi"]://DEV 基站 + wifi数据上传协议
                $socketLink = new SocketPositionUpload($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketPositionUpload_mongo_error\r\n");
                break;
            case  SocketServer::getInstance()->getProtoHead()["gps"]://DEV GPS位置上传协议
                $socketLink = new SocketGpsUpload($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketGpsUpload_mongo_error\r\n");
                break;
            case  SocketServer::getInstance()->getProtoHead()["sos"]://DEV sos
                $socketLink = new SocketSosReceive($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketSosReceive_mongo_error\r\n");
                break;
            case  SocketServer::getInstance()->getProtoHead()["showEvent"]://DEV showEvent
                $socketLink = new SocketShowEvent($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketShowEvent_mongo_error\r\n");
                break;
            case  SocketServer::getInstance()->getProtoHead()["readEvent"]://DEV readEvent
                $socketLink = new SocketReadEvent($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketReadEvent_mongo_error\r\n");
                break;
            case  SocketServer::getInstance()->getProtoHead()["heartRate"]://DEV heartRate
                $socketLink = new SocketHeartRate($server,$fd,$data);
                $socketLink->analysisData();
                $res = $socketLink->saveData();
                if(!is_array($res))
                    throw new Exception("SocketHeartRate_mongo_error\r\n");
                else
                    $socketLink->response();
                break;


            case  SocketServer::getInstance()->getProtoHead()["locationType"]://App set location type
                try{
                    $socketLink = new SocketSetLocationType($server,$fd,$data);
                    $socketLink->analysisData();
                }catch (Exception $e){
                    $server->send($fd, json_encode([
                        Controller::CODE => $e->getMessage(),
                    ]));
                }
                break;
            case  SocketServer::getInstance()->getProtoHead()["shutDown"]://App set shut down
                try{
                    $socketLink = new SocketSetShutDown($server,$fd,$data);
                    $socketLink->analysisData();
                }catch (Exception $e){
                    $server->send($fd, json_encode([
                        Controller::CODE => $e->getMessage(),
                    ]));
                }
                break;
            case  SocketServer::getInstance()->getProtoHead()["setContacts"]://App set setContacts
                try{
                    $socketLink = new SocketSetContacts($server,$fd,$data);
                    $socketLink->analysisData();
                }catch (Exception $e){
                    $server->send($fd, json_encode([
                        Controller::CODE => $e->getMessage(),
                    ]));
                }
                break;
            case  SocketServer::getInstance()->getProtoHead()["setMonitor"]://App set setMonitor
                try{
                    $socketLink = new SocketSetMonitor($server,$fd,$data);
                    $socketLink->analysisData();
                }catch (Exception $e){
                    $server->send($fd, json_encode([
                        Controller::CODE => $e->getMessage(),
                    ]));
                }
                break;
            case  SocketServer::getInstance()->getProtoHead()["setNotice"]://App set setNotice
                try{
                    $socketLink = new SocketSetNotice($server,$fd,$data);
                    $socketLink->analysisData();
                }catch (Exception $e){
                    $server->send($fd, json_encode([
                        Controller::CODE => $e->getMessage(),
                    ]));
                }
                break;

            default:
                throw new Exception("no_this_protol_head\r\n");
                break;
        }
    }catch (Exception $e){
        echo $e->getMessage()."\n";
        $server->close($fd);
    }
});
$server->on('close', function ($serv, $fd) {
    SocketServer::getInstance()->getConnector()[$fd] = null;
    unset(SocketServer::getInstance()->getConnector()[$fd]);
    echo "Client{$fd}: Close.\n";
});
$server->start();