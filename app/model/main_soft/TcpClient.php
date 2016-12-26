<?php

namespace app\model\main_soft;

use Exception;
use Swoole\Client;

class TcpClient extends SocketLink{
    const MOBILE_KEY = 'ljm';
    const MOBILE_RESPONSE_SUCCESS = 0;
    const MOBILE_RESPONSE_DEVICE_OFFLINE = 1;
    const MOBILE_RESPONSE_NO_PACK_DATA = 2;
    const MOBILE_RESPONSE_NO_UNPACK_DATA = 3;
    const MOBILE_RESPONSE_NO_ACCESS = 4;

    private $client;

    public function packMobileSocketData($arr=[]){
        if(!$arr){
            throw new Exception(self::MOBILE_RESPONSE_NO_PACK_DATA);
        }else{
            $res[] = time();
            $res[] = self::makeMobileCheckMd5Key($res[0]);
            return implode('|',array_merge($res,$arr));
        }
    }

    public function unPackMobileSocketData($data){
        if(!$data){
            throw new Exception(self::MOBILE_RESPONSE_NO_UNPACK_DATA);
        }else{
            $resArr = explode('|',$data);
            var_dump($resArr);
            if(count($resArr)>2 && $this->makeMobileCheckMd5Key($resArr[0]) == $resArr[1]){
                return array_slice($resArr,2);
            }else{
                throw new Exception(self::MOBILE_RESPONSE_NO_ACCESS);
            }
        }
    }

    private function makeMobileCheckMd5Key($time){
        return md5($time.self::MOBILE_KEY);
    }

    public function __construct($server,$fd,$data){
        parent::__construct($server,$fd ,$data);
        try {
            $this->setClient(new Client(SWOOLE_SOCK_TCP));
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function SendMessage($body){
       $this->getClient()->send($this->addHeader($body));
    }

    /**
     * @return Client
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @param Client $client
     */
    public function setClient($client)
    {
        $this->client = $client;
    }
}