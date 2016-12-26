<?php

function aaa(){
    throw new Exception('aaa');
}
try{
    aaa();
    echo 'adfad';
}catch (Exception $e)
{
    echo $e->getMessage();
}
exit;
function curlPost($url,$data)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data))
    );


    $output = curl_exec($ch);
    curl_close($ch);
    return ($output);
}
/*
$text = '{
  "considerIp": "false",
  "wifiAccessPoints": [
    {
        "macAddress": "00:25:9c:cf:1c:ac",
        "signalStrength": -43,
        "signalToNoiseRatio": 0
    },
    {
        "macAddress": "00:25:9c:cf:1c:ad",
        "signalStrength": -55,
        "signalToNoiseRatio": 0
    }
  ]
}';
*/
$arr = [];
$arr["considerIp"] = false;
$arr["wifiAccessPoints"] = [];
for($i=0;$i<2;$i++){
    if($i){
        $arr["wifiAccessPoints"][$i]["macAddress"] = '00:25:9c:cf:1c:ac';
        $arr["wifiAccessPoints"][$i]["signalStrength"] = '-43';
        $arr["wifiAccessPoints"][$i]["signalToNoiseRatio"] = 0;
    }else{
        $arr["wifiAccessPoints"][$i]["macAddress"] = '00:25:9c:cf:1c:ad';
        $arr["wifiAccessPoints"][$i]["signalStrength"] = '-55';
        $arr["wifiAccessPoints"][$i]["signalToNoiseRatio"] = 0;
    }
}
$url = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBMgp5iktpe84mmXUQzEzGzH1l-FR3PuvU";
$res = curlPost($url,json_encode($arr));
define("URL_ERROR",0);
define("API_ERROR",1);
if($res){
    $resArr = @json_decode($res,1);
    if(is_array($resArr) && count($resArr)){
        if(isset($resArr['error'])){
            throw new Exception($resArr['error']['message']);
        }else{
            if(isset($resArr['location'])){
                echo 'lon:'.$resArr['location']['lng'];
                echo "\n";
                echo 'lat:'.$resArr['location']['lat'];
                echo "\n";
            }
        }
    }else{
        throw new Exception(API_ERROR);
    }
}else{
    throw new Exception(URL_ERROR);
}
var_dump(json_decode($res,1));exit;

exit;
require_once 'Foo.php';

$foo = new Foo();
$foo->setBar(1);
$foo->setBaz('two12212');
$foo->appendSpam(3.5);
$foo->appendSpam(4.5);

$packed = $foo->serializeToString();

try {
    $foo->parseFromString($packed);
} catch (Exception $ex) {
    die('Oops.. there is a bug in this example, ' . $ex->getMessage());
}

ob_start();
$foo->dump();
echo $foo->getBaz();
e(ob_get_contents());
ob_clean();
q();



function self_concat($str, $n){
    $string = "";
    for($i=0; $i<$n; $i++){
        $string .= $string;
    }
    return $string;
}

$start = microtime();
self_concat("ljm",100);
$end = microtime();
echo $end-$start;

$start1 = microtime();
c_self_concat("ljm",100);
$end1 = microtime();
echo $end1-$start1;

