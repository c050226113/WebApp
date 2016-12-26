<?php

function sendMsg($client,$msg_normal){
    $client->send(pack("N",strlen($msg_normal)+4).$msg_normal);
}
$client = new Swoole\Client(SWOOLE_SOCK_TCP);
//发起网络连接
$client->connect('127.0.0.1', 9501, 0.5);

//heartBeat
$msg_normal[] = chr(0x00).chr(0x01)."867567865767685\r\n100\r\n0\r\n0\r\n60\r\n1\r\n";

//SocketPositionUpload
$msg_normal[] = chr(0x00).chr(0x02)."460|01|3|16515,41143,52|16515,41143,52|16515,41143,52|\r\n2|c8:3a:35:15:71:38,-84,Tenda_157138|70:3a:d8:11:78:60,-86,WXlmjd|\r\n1469421531\r\n";

//S3、PS位置上传协议 - 设备端发起
$msg_normal[] = chr(0x00).chr(0x03)."113.123456\r\nS\r\n22.123456\r\nW\r\n1469421531\r\n";

//DEV sos
$msg_normal[] = chr(0x00).chr(0x06)."1\r\n";

//DEV heart rate
$msg_normal[] = chr(0x00).chr(0x13)."70\r\n1454123654\r\n";



foreach($msg_normal as $v){
    sendMsg($client,$v);
}
var_dump($client->recv());


//set locationType
//$now = time();
//$body = chr(0x10).chr(0x04).$now.'|'.md5($now.'ljm').'|'.'867567865767685'.'|'.'1';
//$client->send(pack("N",strlen($body)+4).$body);
//var_dump($client->recv());
//$client->close();

//shutdown
//$now = time();
//$body = chr(0x10).chr(0x05).$now.'|'.md5($now.'ljm').'|'.'867567865767685'.'|'.'1';
//$client->send(pack("N",strlen($body)+4).$body);
//var_dump($client->recv());
//$client->close();






