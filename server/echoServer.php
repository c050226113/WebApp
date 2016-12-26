<?php
$http = new swoole_http_server("0.0.0.0", 9510);
$http->set([
    'worker_num' => 2,
    'daemonize' => false,
    'max_request' => 5120,
    'dispatch_mode' => 2,
    'open_cpu_affinity' => true,
    'open_tcp_nodelay' => true
]);
$http->on('Request', function ($request, $response) {
    $aaa=function($i){
        $a = $i + 1;
        $b = 2.3;
        $s = "abcdefkkbghisdfdfdsfds";

        if($a > $b){
            ++$a;
        }else{
            $b = $b + 1;
        }

        if($a == $b){
            $b = $b + 1;
        }

        $c = $a * $b + $a / $b - pow($a, 2);
        $d = substr($s, 0, strpos($s, 'kkb')) . strval($c);
    };

    $t1 = microtime(true);

    for($i=0; $i<10000000; $i++){
        $aaa($i);
    }

    $t2 = microtime(true);

    $response->write('a');
    $response->end();
});
$http->start();