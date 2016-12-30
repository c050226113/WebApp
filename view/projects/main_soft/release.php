<?php
function e($str){
    echo $str.PHP_EOL;
}
function q(){
    throw new Exception('0');
}
class HttpHelper{
    private function initCurl($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 3);
        return $ch;
    }
    private function setCurl($ch){
        curl_setopt($ch, CURLOPT_HEADER, 0); //不返回header部分

    }
    public function httpCurl($url, $data=[], $cookie='', $setArr = []){

        $ch = $this->initCurl($url);

        if($data){
            curl_setopt ( $ch, CURLOPT_POST, true);
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $data );
        }

        $this->setCurl($ch);

        $settingArr = [];
        if($cookie){
            $settingArr[] = "X-Requested-With: XMLHttpRequest";
            $settingArr[] = "Cookie:PHPSESSID={$cookie}";
        }
        if($setArr){
            array_merge($settingArr,$setArr);
        }

        if($settingArr){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $settingArr);
        }

        $o = curl_exec($ch);
        curl_close($ch);
        return $o;
    }
}
class Compiler{
    private $fileName = 'index.html';
    private $outPutFileName = 'release.html';
    private $output;
    public function __construct($in,$out){
        $this->setFileName($in);
        $this->setOutPutFileName($out);
    }

    private function outputAdd($str){
        $this->setOutput($this->getOutput().$str);
    }

    private function compilerOneLine($line){
        //条件 如果匹配到 ?__inline 则
        if(strpos($line, '?__inline')){
            $rn = PHP_EOL;
            if(strpos($line, '.js?')){
                preg_match('/src="(.*)\?__inline/',$line,$s);
                if($s[1]){
                    $js_script_content = file_get_contents(dirname(__FILE__).'/'.$s[1].'');
                    $line = <<<EOF
<script>{$js_script_content}</script>{$rn}
EOF;
                }
            }else if(strpos($line, '.css?')){
                preg_match('/href="(.*)\?__inline/',$line,$s);
                if($s[1]){
                    $css_script_content = file_get_contents(dirname(__FILE__).'/'.$s[1].'');
                    $line = <<<EOF
<style>{$css_script_content}</style>{$rn}
EOF;
                }
            }else if(strpos($line, '.html?')){
                preg_match('/src="(.*)\?__inline/',$line,$s);
                if($s[1]){
                    $line = file_get_contents(dirname(__FILE__).'/'.$s[1].'');
                }
            }
        }

        $this->outputAdd($line);
    }

    public function start(){
        $fp = fopen(dirname(__FILE__).'/'.$this->getFileName(),'r');
        if($fp){
            try{
                while(!feof($fp)){
                    $this->compilerOneLine(fgets($fp));
                }
                throw new Exception();
            }catch (Exception $e){
                fclose($fp);
            }
        }
        $this->output();
    }

    private function output(){
        //output release.html
        file_put_contents($this->getOutPutFileName(),$this->getOutput());
        //output phone.manifest
        $rand = mt_rand(100,1200210);
        $manifest = <<<EOF
CACHE MANIFEST
#change {$rand}
./index.html
NETWORK:
*
EOF;
        file_put_contents('phone.manifest',$manifest);
        //sftp upload
        $this->upload_file();
    }

    private function upload_file(){
        $releaseContent = file_get_contents('./'.$this->getOutPutFileName());
        $manifestContent = file_get_contents('./phone.manifest');
        $url = 'http://123.207.243.228/html/webapp/view/projects/main_soft/upload.php';
        $html = base64_encode($releaseContent);
        $num = 10;
        $count = ceil(strlen($html)/$num);
        $data[] = [
            'phone.manifest'=>base64_encode($manifestContent)
        ];
        for($i=0;$i<$count;$i++){
            $data[] = [
                'data'.$i=>substr($html,$i*$num,$num)
            ];
        }
//        $data = [
////             $this->getOutPutFileName()=>base64_encode($releaseContent),
//             'dafda'=>substr($html,0,100000),
//            'phone22.manifest'=>base64_encode($manifestContent)
//        ];

        var_dump($data);
//        $uploadRes = (new HttpHelper)->httpCurl($url, $data);
//        var_dump($uploadRes);
    }

    /**
     * @return mixed
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * @param mixed $fileName
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;
    }

    /**
     * @return mixed
     */
    public function getOutPutFileName()
    {
        return $this->outPutFileName;
    }

    /**
     * @param mixed $outPutFileName
     */
    public function setOutPutFileName($outPutFileName)
    {
        $this->outPutFileName = $outPutFileName;
    }

    /**
     * @return mixed
     */
    public function getOutput()
    {
        return $this->output;
    }

    /**
     * @param mixed $output
     */
    public function setOutput($output)
    {
        $this->output = $output;
    }
}

(new Compiler('index.html','release.html'))->start();





