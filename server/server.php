<?php
use core\App;
use server\ServerFactory;

$http = new swoole_http_server("0.0.0.0", 9002);
$http->set([
        'worker_num' => 1,
        'daemonize' => false,
        'max_request' => 3000,
        'dispatch_mode' => 2,
        'open_cpu_affinity' => true,
        'open_tcp_nodelay' => true,
        'log_file' =>'/var/www/html/webapp/server/log/http.log'
]);
$http->on('Start',function(){
    swoole_set_process_name("sw_http_m");
});
$http->on('WorkerStart', function ($server, $worker_id) {
    define("ROOT_DIR",'/var/www/html/webapp/');
    define("CORE_DIR",ROOT_DIR."core/");
    require_once('/var/www/html/webapp/server/ServerFactory.php');
    spl_autoload_register('server\ServerFactory::autoLoad');
    ServerFactory::getInstance()->createServer();
});
$http->on('Request', function ($request, $response) {
    try {
        App::getInstance()->create($request,$response);
        if (is_file("/var/www" . App::getInstance()->getRequest()->server["path_info"]))
            include("/var/www" . App::getInstance()->getRequest()->server["path_info"].'');
        else
            throw new Exception("404");
    }catch(Exception $e){
        if($e->getMessage()!=='0')
            e('<!DOCTYPE html><html style="padding:20px;"><head><meta charset="utf-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1"><title>error</title><link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet"></head><body><div class="well" style="color:red">'.$e->getMessage().'</div></body></html>');
    }
    unset($request);
    unset($response);
    App::getInstance()->destroy();
//    var_dump('exit');
//    exit();
});
$http->start();

/**
object(swoole_http_request)#8 (5) {
["fd"]=>
int(1)
["header"]=>
array(7) {
["host"]=>
string(20) "123.207.243.228:9003"
["connection"]=>
string(10) "keep-alive"
["user-agent"]=>
string(110) "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
["accept"]=>
string(3) "
    ["referer"]=>
    string(28) "http://123.207.243.228:9003/"
    ["accept-encoding"]=>
    string(19) "gzip, deflate, sdch"
    ["accept-language"]=>
    string(23) "zh-CN,zh;q=0.8,en;q=0.6"
  }
  ["server"]=>
  array(10) {
    ["request_method"]=>
    string(3) "GET"
    ["request_uri"]=>
    string(12) "/favicon.ico"
    ["path_info"]=>
    string(12) "/favicon.ico"
    ["request_time"]=>
    int(1482550793)
    ["request_time_float"]=>
    float(1482550793.8892)
    ["server_port"]=>
    int(9003)
    ["remote_port"]=>
    int(50273)
    ["remote_addr"]=>
    string(14) "183.12.247.227"
    ["server_protocol"]=>
    string(8) "HTTP/1.1"
    ["server_software"]=>
    string(18) "swoole-http-server"
  }
  ["cookie"]=>
  array(1) {
    ["rock_format"]=>
    string(4) "json"
  }
  ["data"]=>
  string(363) "GET /favicon.ico HTTP/1.1
Host: 123.207.243.228:9003
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36
Accept:
Referer: http://123.207.243.228:9003/
Accept-Encoding: gzip, deflate, sdch
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6
Cookie: rock_format=json

"
}

 */