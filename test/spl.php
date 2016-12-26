<?php
//function getMicTime(){
//    return (int)substr(microtime(),2,8);
//}
//$startTime = getMicTime();
//$array = [];
//for($i=0;$i<10000;$i++){
//    $array[$i] = $i;
//}
////$myLinkedList = new SplDoublyLinkedList();
////for($i=0;$i<10000;$i++){
////    $myLinkedList->push($i);
////}
//$endTime = getMicTime();
//var_dump($endTime-$startTime);
//exit;


$myLinkedList = new SplDoublyLinkedList();

$myLinkedList->push(1);
$myLinkedList->push(2);
$myLinkedList->push(4);
$myLinkedList->push(5);
$myLinkedList->unshift(10);
$myLinkedList->rewind();//把指针指向bottom
var_dump($myLinkedList->current());
$myLinkedList->next();
var_dump($myLinkedList->current());
//删除节点操作
//定位操作
//特定节点操作

print_r($myLinkedList);
foreach($myLinkedList as $v){
    var_dump($v);
}

$stack = new SplStack();
$stack->push(2);
$stack->push(4);
$stack->push(5);
$stack->offsetSet(0,'C');
$stack->rewind();
while($stack->valid()){
    var_dump($stack->current());
    $stack->next();
}

$queue = new SplQueue();
$queue->enqueue(1);
$queue->enqueue(2);
$queue->enqueue(3);
$queue->enqueue(6);
$queue->enqueue(17);

$arr = [
    'ads'=>'1',
    'adsf'=>'2',
    'adsfew'=>'3',
    'ddd'=>'4',
    'daaa'=>'5',
];
$arrObj = new ArrayObject($arr);
$it = $arrObj->getIterator();
$it = new ArrayIterator($arr);
$it->ksort();
$it->asort();

$it->rewind();
if($it->valid()){
    $it->seek(3);
    while($it->valid()){
        var_dump($it->current());
        $it->next();
    }
}


$it1 = new ArrayIterator([123,1212,3123,12,312,31]);
$it2 = new ArrayIterator([21,3,123,123,12,312,312,3]);
$iit = new AppendIterator();
$iit->append($it1);
$iit->append($it2);
foreach($iit as $v){
    var_dump($v);
}

$idIter = new ArrayIterator([1,2,3]);
$nameIter = new ArrayIterator(['a','b','c']);
$ageIter = new ArrayIterator([11,21,31]);
$muiltyIter = new MultipleIterator(MultipleIterator::MIT_KEYS_ASSOC);
$muiltyIter->attachIterator($idIter,'id');
$muiltyIter->attachIterator($nameIter,'name');
$muiltyIter->attachIterator($ageIter,'age');
foreach($muiltyIter as $v){
    var_dump($v);
}



$fileIter = new FilesystemIterator('.');
//$fileIter->g
foreach($fileIter as $fileInfo){
    printf("%s\t%s\t%8s\t%s\n",
        date('Y-m-d H:i:s',$fileInfo->getMTime()),
        $fileInfo->isDir()? 'dir':'file',
        number_format($fileInfo->getSize()),
        $fileInfo->getFileName()
        );
}


//spl 基础接口
class dd extends IteratorIterator implements  Countable{

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Count elements of an object
     * @link http://php.net/manual/en/countable.count.php
     * @return int The custom count as an integer.
     * </p>
     * <p>
     * The return value is cast to an integer.
     */
    public function count()
    {
        // TODO: Implement count() method.
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Return the current element
     * @link http://php.net/manual/en/iterator.current.php
     * @return mixed Can return any type.
     */
    public function current()
    {
        // TODO: Implement current() method.
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Move forward to next element
     * @link http://php.net/manual/en/iterator.next.php
     * @return void Any returned value is ignored.
     */
    public function next()
    {
        // TODO: Implement next() method.
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Return the key of the current element
     * @link http://php.net/manual/en/iterator.key.php
     * @return mixed scalar on success, or null on failure.
     */
    public function key()
    {
        // TODO: Implement key() method.
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Checks if current position is valid
     * @link http://php.net/manual/en/iterator.valid.php
     * @return boolean The return value will be casted to boolean and then evaluated.
     * Returns true on success or false on failure.
     */
    public function valid()
    {
        // TODO: Implement valid() method.
    }

    /**
     * (PHP 5 &gt;= 5.0.0)<br/>
     * Rewind the Iterator to the first element
     * @link http://php.net/manual/en/iterator.rewind.php
     * @return void Any returned value is ignored.
     */
    public function rewind()
    {
        // TODO: Implement rewind() method.
    }

    /**
     * (PHP 5 &gt;= 5.1.0)<br/>
     * Returns the inner iterator for the current entry.
     * @link http://php.net/manual/en/outeriterator.getinneriterator.php
     * @return Iterator The inner iterator for the current entry.
     */
    public function getInnerIterator()
    {
        // TODO: Implement getInnerIterator() method.
    }
}

class test_thread_run extends Thread
{
    public $url;
    public $data;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function run()
    {
        if(($url = $this->url))
        {
            $this->data = model_http_curl_get($url);
        }
    }
}
//
//function model_thread_result_get($urls_array)
//{
//    foreach ($urls_array as $key => $value)
//    {
//        $thread_array[$key] = new test_thread_run($value["url"]);
//        $thread_array[$key]->start();
//    }
//
//    foreach ($thread_array as $thread_array_key => $thread_array_value)
//    {
//        while($thread_array[$thread_array_key]->isRunning())
//        {
//            usleep(10);
//        }
//        if($thread_array[$thread_array_key]->join())
//        {
//            $variable_data[$thread_array_key] = $thread_array[$thread_array_key]->data;
//        }
//    }
//    return $variable_data;
//}
//
//function model_http_curl_get($url,$userAgent="")
//{
//    $userAgent = $userAgent ? $userAgent : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2)';
//    $curl = curl_init();
//    curl_setopt($curl, CURLOPT_URL, $url);
//    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//    curl_setopt($curl, CURLOPT_TIMEOUT, 5);
//    curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
//    $result = curl_exec($curl);
//    curl_close($curl);
//    return $result;
//}

//for ($i=0; $i < 100; $i++)
//{
//    $urls_array[] = array("name" => "baidu", "url" => "http://www.baidu.com/s?wd=".mt_rand(10000,20000));
//}
//
//$t = microtime(true);
//$result = model_thread_result_get($urls_array);
//$e = microtime(true);
//echo "多线程：".($e-$t)."\n";
//
//$t = microtime(true);
//foreach ($urls_array as $key => $value)
//{
//    $result_new[$key] = model_http_curl_get($value["url"]);
//}
//$e = microtime(true);
//echo "For循环：".($e-$t)."\n";
