<?php
class PackageBase{
    private $crc_table = array(0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf, 0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7, 0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e, 0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876, 0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd, 0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5, 0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c, 0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974, 0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb, 0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3, 0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a, 0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72, 0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9, 0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1, 0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738, 0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70, 0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7, 0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff, 0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036, 0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e, 0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5, 0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd, 0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134, 0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c, 0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3, 0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb, 0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232, 0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a, 0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1, 0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9, 0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330, 0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78);
    public $pkt_tag = null;
    public $pkt_type = null;
    public $pkt_len = null;
    public $pkt_seq = null;
    public $pkt_crc = null;
    public $headerArr = array();
    public $headerLength = 6;
    public $crcLength = 2;
    public function ComposePackageHeader($type,$bodyLength,$seq){
        $this->pkt_tag = -89;
        $this->pkt_type = $type;
        $this->pkt_len = $this->headerLength+$this->crcLength+$bodyLength;//head 6 + crc 2 + body
        $this->pkt_seq = $seq;
        array_push($this->headerArr,$this->pkt_tag);
        array_push($this->headerArr,$this->pkt_type);
        array_push($this->headerArr,$this->pkt_len);
        array_push($this->headerArr,0);
        array_push($this->headerArr,$this->pkt_seq);
    }
    public function addCrc($pkgArr){
        $crc = 0xffff;
        $len = count($pkgArr);
        $header_len = 6;
        $body_len = $len - 8;
        $index = 0;

        do {
            $pos = (($crc & 0xff) ^ ($pkgArr[$index++]&0xff))&0xffff;
            $crc = (($crc>>8)&0xffff) ^ ($this->crc_table[$pos]&0xffff);
            $crc = $crc&0xffff;
        }while((--$header_len)>0);

        if($body_len<=0){

            $crcReverse = $this->crcReverse($crc);
            return array(
                getByte($crcReverse & 0xff),
                getByte(($crcReverse>>8) & 0xff)
            );
        }

        //crc pass
        $index = $index+2;
        do {
            $pos = (($crc & 0xff) ^ ($pkgArr[$index++]&0xff))&0xffff;
            $crc = (($crc>>8)&0xffff) ^ ($this->crc_table[$pos]&0xffff);
            $crc = $crc&0xffff;
        } while((--$body_len)>0);

        $crcReverse = $this->crcReverse($crc);
//        p('crc:'.getShort($crcReverse));
        return array(
            getByte($crcReverse & 0xff),
            getByte(($crcReverse>>8) & 0xff)
        );
    }
    private function crcReverse($crc){
        $crc = (($crc & 0x00ff) << 8) | ( $crc >> 8);
        $crc = (($crc & 0x0f0f) << 4) | (($crc & 0xf0f0) >> 4);
        $crc = (($crc & 0x3333) << 2) | (($crc & 0xcccc) >> 2);
        $crc = (($crc & 0x5555) << 1) | (($crc & 0xaaaa) >> 1);

        return ($crc&0xffff);
    }
    public function getHeaderArr(){
        $arr = array();
        $arrLength = 0;
        for($i=0;$i<$this->headerLength;$i++){
            if(isset($this->headerArr[$i])){
                $arr[$arrLength++] = $this->headerArr[$i];
            }else{
                $arr[$arrLength++] = 0;
            }
        }
        return $arr;
    }
    public function getMessage(){
        $headerArr = $this->getHeaderArr();
        $crcArr = array(0,0);
        $bodyArr = $this->getBodyArr();
        $pkgArr = array_merge($headerArr,$crcArr,$bodyArr);
        $crc = $this->addCrc($pkgArr);
        $pkgArr[6] = $crc[0];
        $pkgArr[7] = $crc[1];

        foreach($pkgArr as $k => $v){
            $pkgArr[$k] = chr($v);
        }

        return join('',$pkgArr);
    }
}
interface IPackageBase{
    public function getBodyArr();
}
class LoginPackage extends PackageBase implements IPackageBase{
    public $accountArr = array();
    public $tokenArr = array();
    public function setAccount($account){
        $this->accountArr = string_to_bcd($account); // 6
    }
    public function setToken($token){
        $this->tokenArr = string_to_bcd($token); // 20
    }
    public function getBodyArr(){
        $arr = array();
        $arrLength = 0;
        foreach($this->accountArr as $k => $v){
            $arr[$arrLength++] = $this->accountArr[$k];
        }
        foreach($this->tokenArr as $k => $v){
            $arr[$arrLength++] = $this->tokenArr[$k];
        }
        return $arr;
    }
}
class GetLocationPackage extends PackageBase implements IPackageBase{
    public $imeiArr = array();
    public $method;
    public function setImei($imei){
        $this->imeiArr = string_to_bcd($imei); // 6
    }
    public function setMethod($method){
        $this->method = $method; // 20
    }
    public function getBodyArr(){
        $arr = array();
        $arrLength = 0;
        foreach($this->imeiArr as $k => $v){
            $arr[$arrLength++] = $this->imeiArr[$k];
        }
        $arr[$arrLength++] = $this->method;
        return $arr;
    }
}
function string_to_bcd($str){
    $strLength = strlen($str);
    if(!($strLength&1)){
        $resArrLength = $strLength/2;
    }else{
        $resArrLength = ($strLength+1)/2;
    }

    $resArr = array();

    $b = str_split($str);
    $b[count($b)] = null;
    for($i = 0; $i < $resArrLength; $i++){
        $resArr[$i] = hexdec($b[2*$i]);//16->10
        if(isset($b[2*$i+1])){
            $resArr[$i] = $resArr[$i]<<4|hexdec($b[2*$i+1]);
        }else{
            $resArr[$i] = $resArr[$i]<<4|14;
        }

        $resArr[$i] = getByte($resArr[$i]);
    }
    return $resArr;
}
function getByte($num){
//    return $num;
    $max = (1<<7);
    return $num>($max - 1) ? -($max - ($num & ($max - 1))) : $num;
}

function getShort($num){
//    return $num;
    $max = (1<<15);
    return $num>($max - 1) ? -($max - ($num & ($max - 1))) : $num;
}

//客户端
set_time_limit(0);
$host = "112.74.210.190";
$host = "120.24.96.188";
$port = 22221;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP)or die("Could not create  socket\n"); // 创建一个Socket
$connection = socket_connect($socket, $host, $port) or die("Could not connet server\n");    //  连接

//send login package
define('LOGIN_TYPE',99);
$pkg = new LoginPackage();
$pkg->setAccount('18566650234');//6
$pkg->setToken('cccccccccccccccccccccccccccccccccccccccc');//20
//$pkg->setToken('6111a080feb350914a51a16bca56c0d714ec652c');//20
$bodyLength = 20+6;
$pkg->ComposePackageHeader(LOGIN_TYPE,$bodyLength,0);//type body seq
$message = $pkg->getMessage();

//p('WILL_SAY:'.$message);
socket_write($socket, $message) or die("Write failed\n"); // 数据传送 向服务器发送消息
usleep(10000);
$buff = socket_read($socket, 48, PHP_BINARY_READ);
//p("READ:" . $buff);
$status = substr($buff,strlen($buff)-1,1);
$status = ord($status);
if($status === 0){
    p('登陆成功');
}else{
    p('登陆失败');
}
p('send login package END');

//send location package
define('GET_LOCATION_TYPE',102);
$pkg = new GetLocationPackage();
$pkg->setImei('86742602000631');// 7
$pkg->setMethod(0);// 快速定位 1
$bodyLength = 7+1;
$pkg->ComposePackageHeader(GET_LOCATION_TYPE,$bodyLength,1);//type body seq
$message = $pkg->getMessage();
//p('WILL_SAY:'.$message);
socket_write($socket, $message) or die("Write failed\n"); // 数据传送 向服务器发送消息
usleep(10000);
$buff = socket_read($socket, 1000, PHP_BINARY_READ);
//p("READ:" . $buff);
foreach(str_split($buff) as $v){
    $data[] = getByte(ord($v));
}
p(json_encode($data));

//
//define('APP_FROM_DEV_OFFLINE_STATUS_PKT_TYPE',111);
//
//$type = $data[1];
//if($type == APP_FROM_DEV_OFFLINE_STATUS_PKT_TYPE){
//    p('设备不在线');
//}

p('send location package END');

socket_close($socket);