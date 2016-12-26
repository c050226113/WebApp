<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/4/22 0022
 * Time: 15:57
 */
class Db{
    const SPLIT = "{-}";
    const FLAG = "{--}";
    const TABLE_EXIST = 100;
    const MAKE_TABLE_ERROR = -100;
    const MAKE_TABLE_SUCCESS = 101;

    const SUCCESS = 0;
    const ERROR = -1;
    const PK_REPEAT = 1;
    const TABLE_ERROR = 3;
    const COLUMNS_ERROR = 4;
    const NO_RESULT = 5;

    private $columns;
    private $table;
    private $pk;
    private $content;
    private $lock;
    private $access;

    /**
     * 初始化并创建表内容
     * @param $tableName
     * @param $columns
     */
    public function __construct($tableName,$columns){

        $this->columns = $columns;

        //表内容路径
        $table = dirname(__FILE__)."/tables/{$tableName}";
        $this->table = $table;
        $this->pk = $table."/pk";
        $this->content = $table."/content";
    }

    /**
     * 创建表
     * @return int
     */
    public function createTable(){
        if(is_dir($this->table)){
            $this->access = true;
            return self::TABLE_EXIST;
        }else{
            if(mkdir($this->table, 0777, true)) {

                file_put_contents("{$this->table}/lock.db","");

                if(is_file("{$this->table}/lock.db")) {

                    if(mkdir($this->pk, 0777, true) && mkdir($this->content, 0777, true)) {
                        file_put_contents("{$this->pk}/flag","0");
                        file_put_contents("{$this->pk}/0","");
                        $this->access = true;
                        return self::TABLE_EXIST;
                    }
                }
            }
        }

        $this->deldir($this->table);
        $this->access = false;
        return self::MAKE_TABLE_ERROR;
    }

    /**
     * 插入一条数据
     * @param $columns
     * @return int
     */
    public function insertByPk($columns){
        if(!$this->getAccess()){
            return self::TABLE_ERROR;
        }

        //判断列个数
        if(!$this->checkColumns($columns)){
            return self::COLUMNS_ERROR;
        }

        $this->makeLock();

        $str = 'find '.$this->pk.'/ -type f -name "*" | xargs grep "'.trim($columns[0]).self::SPLIT.'"';
        $result = @exec($str);
        $res = @substr($result,strpos($result,":")+1,strlen($result));
        if($res){      //判断主键重复
            $this->unMakeLock();
            return self::PK_REPEAT;
        }

        //读flag文件查找pk的分区
        $freePk = (int)file_get_contents($this->pk."/flag");

        //得到pk所在的文件
        $file = $this->pk."/".$freePk;

        //插入pk
        $res = file_put_contents($file,$columns[0].self::SPLIT.$freePk."\n",FILE_APPEND);
        if($res){
            if(is_dir($this->content."/".$freePk)) {
                //插入数据
                insert:
                $res = file_put_contents($this->content."/".$freePk."/".$columns[0],self::FLAG.self::FLAG.implode(self::SPLIT,$columns).self::FLAG.self::FLAG);

                if($res){
                    //判断是否创建新的pk文件
                    if(filesize($file)>1024){
                        $freePk++;
                        file_put_contents($this->pk."/flag",$freePk);
                        file_put_contents($this->pk."/".$freePk,"");
                    }

                    $this->unMakeLock();
                    return self::SUCCESS;
                }else{
                    //删除之前插入的pk
                    exec("sed -i '/^".$columns[0].self::SPLIT."/d' ".$file."");
                }
            }else{
                if(mkdir($this->content."/".$freePk, 0777, true)){
                    goto insert;
                }
            }
        }else{
            $this->unMakeLock();
            return self::ERROR;
        }

        $this->unMakeLock();
        return self::ERROR;
    }

    /**
     * 删除一条数据
     * @param $pk
     * @return int
     */
    public function deleteByPk($pk){
        if(!$this->getAccess()){
            return self::TABLE_ERROR;
        }

        $this->makeLock();

        $str = 'find '.$this->pk.'/ -type f -name "*" | xargs grep "'.$pk.self::SPLIT.'"';

        $result = @exec($str);

        $pk_dir = @substr($result,0,strpos($result,":"));
        $pk_arr_str = @substr($result,strpos($result,":")+1,strlen($result));

        if($pk_dir && $pk_arr_str){
            //删除pk
            $str = 'sed -i "/^'.trim($pk).self::SPLIT.'/d" '.$pk_dir.'';
            $result = @exec($str);
            if(trim($result)){
                $this->unMakeLock();
                return self::ERROR;
            }

            //删除文件
            $pk_arr = explode(self::SPLIT,$pk_arr_str);
            unlink($this->content."/".$pk_arr[1]."/".$pk);
        }

        $this->unMakeLock();
        return self::SUCCESS;
    }

    /**
     * 修改一条数据
     * @param $columns
     * @return int
     */
    public function updateByPk($columns){
        if(!$this->getAccess()){
            return self::TABLE_ERROR;
        }

        if(!$this->checkColumns($columns)){
            return self::COLUMNS_ERROR;
        }

        $this->makeLock();

        $str = 'find '.$this->pk.'/ -type f -name "*" | xargs grep "'.$columns[0].self::SPLIT.'"';
        $result = @exec($str);
        $pk_arr_str = @substr($result,strpos($result,":")+1,strlen($result));

        if($pk_arr_str){
            $pk_arr = explode(self::SPLIT,$pk_arr_str);

            $res = file_put_contents($this->content."/".$pk_arr[1]."/".$columns[0],self::FLAG.self::FLAG.implode(self::SPLIT,$columns).self::FLAG.self::FLAG);
            if($res){
                $this->unMakeLock();
                return self::SUCCESS;
            }else{
                $this->unMakeLock();
                return self::ERROR;
            }
        }

        $this->unMakeLock();
        return self::SUCCESS;
    }

    /**
     * 查找一条数据byPK
     * @param $pk
     * @return array|bool
     */
    public function findOneByPk($pk){
        if(!$this->getAccess()){
            return self::TABLE_ERROR;
        }

        $str = 'find '.$this->pk.'/ -type f -name "*" | xargs grep "'.trim($pk).self::SPLIT.'"';

        $result = @exec($str);

        $res = @substr($result,strpos($result,":")+1,strlen($result));

        if($res){
            $fenglei = explode(self::SPLIT,$res);

            $res = file_get_contents($this->content."/".$fenglei[1]."/".$pk);

            if($res){
                $arr = explode(self::FLAG.self::FLAG,$res);
                return explode(self::SPLIT,$arr[1]);
            }
        }

        return self::NO_RESULT;
    }

    public function findAll(){
        $str = 'find '.$this->content.'/ -type f -name "*" | xargs grep '.DB::FLAG.DB::FLAG;

        exec($str,$aaa);
        return $aaa;
    }

    /**
     * 是否创建表成功
     * @return bool
     */
    private function getAccess(){
        if($this->access === true){
            return true;
        }

        return false;
    }

    /**
     * 检查插入的字段个数
     * @param $columns
     * @return bool
     */
    private function checkColumns($columns){
        if(is_array($columns)){
            if(count($columns) != count($this->columns)){
                return false;
            }
        }else{
            return false;
        }

        return true;
    }

    /**
     * 制作文件锁
     * @return bool
     */
    private function makeLock(){
        $this->lock = fopen("{$this->table}/lock.db","r");
        return flock($this->lock,LOCK_EX);
    }

    /**
     * 解除文件锁
     */
    private function unMakeLock(){
        flock($this->lock,LOCK_UN);
        fclose($this->lock);
    }

    /**
     * 清除整个目录
     * @param $dir
     * @return bool
     */
    private function deldir($dir) {
        //先删除目录下的文件：
        $dh=opendir($dir);
        while ($file=readdir($dh)) {
            if($file!="." && $file!="..") {
                $fullpath=$dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    deldir($fullpath);
                }
            }
        }

        closedir($dh);
        //删除当前文件夹：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }
}