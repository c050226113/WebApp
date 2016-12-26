<?php
namespace app\model;
use core\lib\Config;
use core\lib\Util;
use Exception;
use MongoDB\Driver\Manager;
use MongoDB\Driver\WriteConcern;
use MongoDB\Driver\BulkWrite;
use MongoDB\Driver\Query;


class MongoManager{
    const ERR_ID = 1;
    const ERR_DATA = 2;
    const ERR_DB = 3;
    const HAS_ID = 4;
    const ERR_FILTER = 5;

    private $manager;
    private $connect;
    private $db;
    private $collection;

    public function __construct($db,$collection){
        $this->db = $db;
        $this->collection = $collection;

        $confArr = Config::getInstance()->getConfArr('mongodb');
        $this->preConnect($confArr["HOST"],$confArr["PORT"]);
    }

    private function preConnect($host,$port){
        $this->manager = new Manager("mongodb://{$host}:{$port}");
        $this->connect = new WriteConcern(WriteConcern::MAJORITY, 1000);
    }

    private function setConfFile(){
        $mongoServer = @$this->manager->getServers()[0];
        if($mongoServer){
            $info = $mongoServer->getInfo();
            $primary = explode(':',$info["primary"]);
            $str = '';
            foreach($info['hosts'] as $v){
                $str.="'".$v."',";
            }
            $configEOT=<<<EOT
<?php
return [
    "HOST"=>'{$primary[0]}',
    "PORT"=>'{$primary[1]}',
    "DIR"=>__FILE__,




    "RS"=>[{$str}]
];
EOT;
            $confArr = Config::getInstance()->getConfArr('mongodb');
            return file_put_contents($confArr["DIR"],$configEOT);
        }else{
            return false;
        }
    }

    public function __destruct(){
        $confArr = Config::getInstance()->getConfArr('mongodb');
        if(!Util::getInstance()->hasArr($confArr,'RS')){
            $this->setConfFile();
        }
    }

    private function solveDbErr(){
        $res = $this->setConfFile();

        if(!$res){
            $confArr = Config::getInstance()->getConfArr('mongodb');
            $uriArr = @$confArr['RS'];
            if($uriArr && is_array($uriArr)&&count($uriArr)){
                foreach($uriArr as $uri){
                    $uri = explode(':',$uri);
                    $this->preConnect($uri[0], $uri[1]);
                    try{
                        $query = new Query(['_id'=>'a']);
                        $this->manager->executeQuery($this->db.".".$this->collection, $query);
                    }catch (Exception $e){}
                    $res = $this->setConfFile();
                    if($res){
                        break;
                    }
                }
            }
        }

        return self::ERR_DB;
    }

    public function insertById($id,$arr){

        try{
            if(!$id){
                return self::ERR_ID;
            }
            $arr["_id"] = $id;

            if(!is_array($arr)){
                return self::ERR_DATA;
            }

            $bulk = new BulkWrite;
            $bulk->insert($arr);
            $res = $this->manager->executeBulkWrite($this->db.".".$this->collection, $bulk, $this->connect);
            if($res->getWriteErrors()){
                return $this->solveDbErr();
            }else{
                return [true];
            }
        }catch (Exception $e){

            $res = $this->find(["_id"=>$id]);
            if(is_array(@Util::getInstance()->object2array($res[0][0]))){
                return self::HAS_ID;
            }else{
                return $this->solveDbErr();
            }
        }
    }

    public function insert($arr){
        try{
            if(!is_array($arr)){
                return self::ERR_DATA;
            }

            $bulk = new BulkWrite;
            $bulk->insert($arr);
            $res = $this->manager->executeBulkWrite($this->db.".".$this->collection, $bulk, $this->connect);
            if($res->getWriteErrors()){
                return $this->solveDbErr();
            }else{
                return [true];
            }
        }catch (Exception $e){
            return $this->solveDbErr();
        }
    }

    public function arr2need($need){
        $option = [];
        foreach($need as $val){
            $option[$val]=1;
        }
        $option["_id"]=0;
        $options = [
            'projection' => $option
        ];
        return $options;
    }

    public function find($filter=[],$options=[]){
        try{
            $query = new Query($filter, $options);
            $cursor = $this->manager->executeQuery($this->db.".".$this->collection, $query);
            if($cursor){
                return [$cursor->toArray()];
            }
        }catch (Exception $e){
            return $this->solveDbErr();
        }

        return [true];
    }


    public function remove($filter,$limit = 1){
        try{
            $bulk = new BulkWrite;
            $bulk->delete($filter, ['limit' => $limit]);
            $res = $this->manager->executeBulkWrite($this->db.".".$this->collection, $bulk, $this->connect);
            if($res->getWriteErrors()){
                return $this->solveDbErr();
            }else{
                return [true];
            }
        }catch (Exception $e){
            return $this->solveDbErr();
        }
    }

    public function update($filter=[],$arr,$multi_upsert=[false,false],$opt='$set'){
        try{
            if(!is_array($filter) || !count($filter)){
                return self::ERR_FILTER;
            }
            $bulk = new BulkWrite;
            $bulk->update(
                $filter,
                [$opt => $arr],
                ['multi' => $multi_upsert[0], 'upsert' => $multi_upsert[1]]
            );

            $res = $this->manager->executeBulkWrite($this->db.".".$this->collection, $bulk, $this->connect);
            if($res->getWriteErrors()){
                return $this->solveDbErr();
            }else{
                return [true];
            }
        }catch (Exception $e){
            return $this->solveDbErr();
        }
    }

    public static function getStrWith($arr){
        $count = count($arr);
        $count_1 = $count-1;
        $str = '';
        for($i=0;$i<$count;$i++){
            if($i == $count_1){
                $str .= $arr[$i];
            }else{
                $str .=  $arr[$i].DOT;
            }
        }
        return $str;
    }
}