<?php

class App{
    private $arr = ['a','b','c'];
    private static $self;
    private function __construct(){}
    public static function getInstance()
    {
        if (!self::$self) {
            self::$self = new App();
        }
        return self::$self;
    }

    /**
     * @param array $arr
     */
    public function setArr($arr)
    {
        var_dump('set');
        $this->arr = $arr;
    }

    /**
     * @return array
     */
    public function getArr()
    {
        return $this->arr;
    }
}

function setArr(){
    $arr = App::getInstance()->getArr();
    $arr['d'] = 'd';
    App::getInstance()->setArr($arr);
    var_dump(App::getInstance()->getArr());
}
setArr();