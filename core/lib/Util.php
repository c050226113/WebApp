<?php
namespace core\lib;

class Util{
    private static $self;
    private function __construct(){}
    public static function getInstance(){
        if(!self::$self){
            self::$self = new Util();
        }
        return self::$self;
    }

    public function hasArr($arr,$key){
        return (is_array($arr) && isset($arr[$key]))? ($arr[$key]):"";
    }

    public static function isMobileNumber($tel)
    {
        if (preg_match("/^1[34578]\d{9}$/", $tel)) {
            //验证通过
            return true;
        } else {
            //手机号码格式不对
            return false;
        }
    }

    public function checkPassword($string)
    {
        $allIsNumber = "/^[0-9]{1,20}$/";//纯数字
        $allIsEn = "/^[a-zA-Z]{1,20}$/";//纯数字
        $hasSpecial = "/[^0-9a-zA-Z]/";//除英文和数字

        $length = strlen($string);

        preg_match($allIsNumber, $string, $matches1);
        preg_match($allIsEn, $string, $matches2);
        preg_match($hasSpecial, $string, $matches3);

        if ($matches1 || $matches2 || $matches3 || $length < 6) {
            return false;
        }

        return true;
    }


    /**
     * 删除目录下的所有文件
     * @param $dir
     */
    public function delDir($dir){
        $dh=opendir($dir);
        while ($file=readdir($dh)){
            if($file!="." && $file!=".."){
                $fullPath=$dir."/".$file;

                if(!is_dir($fullPath)){
                    unlink($fullPath);
                }else{
                    self::delDir($fullPath);
                }
            }
        }
        closedir($dh);
    }

    public function object2array($object) {
        $object =  json_decode(json_encode($object),true);

        return  $object;
    }

    public function removeAllSpace($str){
        return preg_replace('/[\s]+/','',$str);
    }

    //验证身份证是否有效
    public function validateIDCard($IDCard) {
//计算身份证的最后一位验证码,根据国家标准GB 11643-1999
        function calcIDCardCode($IDCardBody) {
            if (strlen($IDCardBody) != 17) {
                return false;
            }

            //加权因子
            $factor = array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            //校验码对应值
            $code = array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            $checksum = 0;

            for ($i = 0; $i < strlen($IDCardBody); $i++) {
                $checksum += substr($IDCardBody, $i, 1) * $factor[$i];
            }

            return $code[$checksum % 11];
        }
// 将15位身份证升级到18位
        function convertIDCard15to18($IDCard) {
            if (strlen($IDCard) != 15) {
                return false;
            } else {
                // 如果身份证顺序码是996 997 998 999，这些是为百岁以上老人的特殊编码
                if (array_search(substr($IDCard, 12, 3), array('996', '997', '998', '999')) !== false) {
                    $IDCard = substr($IDCard, 0, 6) . '18' . substr($IDCard, 6, 9);
                } else {
                    $IDCard = substr($IDCard, 0, 6) . '19' . substr($IDCard, 6, 9);
                }
            }
            $IDCard = $IDCard . calcIDCardCode($IDCard);
            return $IDCard;
        }
// 18位身份证校验码有效性检查
        function check18IDCard($IDCard) {
            if (strlen($IDCard) != 18) {
                return false;
            }

            $IDCardBody = substr($IDCard, 0, 17); //身份证主体
            $IDCardCode = strtoupper(substr($IDCard, 17, 1)); //身份证最后一位的验证码

            if (calcIDCardCode($IDCardBody) != $IDCardCode) {
                return false;
            } else {
                return true;
            }
        }

        if (strlen($IDCard) == 18) {
            return check18IDCard($IDCard);
        } elseif ((strlen($IDCard) == 15)) {
            $IDCard = convertIDCard15to18($IDCard);
            return check18IDCard($IDCard);
        } else {
            return false;
        }
    }

    public function b64dec($b64) { //64进制转换成10进制
        $map = array(
            '0'=>0,'1'=>1,'2'=>2,'3'=>3,'4'=>4,'5'=>5,'6'=>6,'7'=>7,'8'=>8,'9'=>9,
            'A'=>10,'B'=>11,'C'=>12,'D'=>13,'E'=>14,'F'=>15,'G'=>16,'H'=>17,'I'=>18,'J'=>19,
            'K'=>20,'L'=>21,'M'=>22,'N'=>23,'O'=>24,'P'=>25,'Q'=>26,'R'=>27,'S'=>28,'T'=>29,
            'U'=>30,'V'=>31,'W'=>32,'X'=>33,'Y'=>34,'Z'=>35,'a'=>36,'b'=>37,'c'=>38,'d'=>39,
            'e'=>40,'f'=>41,'g'=>42,'h'=>43,'i'=>44,'j'=>45,'k'=>46,'l'=>47,'m'=>48,'n'=>49,
            'o'=>50,'p'=>51,'q'=>52,'r'=>53,'s'=>54,'t'=>55,'u'=>56,'v'=>57,'w'=>58,'x'=>59,
            'y'=>60,'z'=>61,'_'=>62,'='=>63
        );
        $dec = 0;
        $len = strlen($b64);
        for ($i = 0; $i < $len; $i++) {
            $b = $map[$b64{$i}];
            if ($b === NULL) {
                return FALSE;
            }
            $j = $len - $i - 1;
            $dec += ($j == 0 ? $b : (2 << (6 * $j - 1)) * $b);
        }
        return $dec;
    }

    public function decb64($dec) { //10进制转换成64进制
        if ($dec < 0) {
            return FALSE;
        }
        $map = array(
            0=>'0',1=>'1',2=>'2',3=>'3',4=>'4',5=>'5',6=>'6',7=>'7',8=>'8',9=>'9',
            10=>'A',11=>'B',12=>'C',13=>'D',14=>'E',15=>'F',16=>'G',17=>'H',18=>'I',19=>'J',
            20=>'K',21=>'L',22=>'M',23=>'N',24=>'O',25=>'P',26=>'Q',27=>'R',28=>'S',29=>'T',
            30=>'U',31=>'V',32=>'W',33=>'X',34=>'Y',35=>'Z',36=>'a',37=>'b',38=>'c',39=>'d',
            40=>'e',41=>'f',42=>'g',43=>'h',44=>'i',45=>'j',46=>'k',47=>'l',48=>'m',49=>'n',
            50=>'o',51=>'p',52=>'q',53=>'r',54=>'s',55=>'t',56=>'u',57=>'v',58=>'w',59=>'x',
            60=>'y',61=>'z',62=>'_',63=>'=',
        );
        $b64 = '';
        do {
            $b64 = $map[($dec % 64)] . $b64;
            $dec /= 64;
        } while ($dec >= 1);
        return $b64;
    }


    /**
     * 计算两组经纬度坐标 之间的距离
     * params ：lat1 纬度1； lng1 经度1； lat2 纬度2； lng2 经度2； len_type （1:m or 2:km);
     * return m or km
     */
    public function GetDistance($lat1, $lng1, $lat2, $lng2, $len_type = 1, $decimal = 2)
    {
        $EARTH_RADIUS = 6378.137;
        $PI = 3.1415926;
        $radLat1 = $lat1 * $PI / 180.0;
        $radLat2 = $lat2 * $PI / 180.0;
        $a = $radLat1 - $radLat2;
        $b = ($lng1 * $PI / 180.0) - ($lng2 * $PI / 180.0);
        $s = 2 * asin(sqrt(pow(sin($a/2),2) + cos($radLat1) * cos($radLat2) * pow(sin($b/2),2)));
        $s = $s * $EARTH_RADIUS;
        $s = round($s * 1000);
        return (int)$s;
        if ($len_type > 1)
        {
            $s /= 1000;
        }
        return (int)$s;
        return round($s, $decimal);
    }
}