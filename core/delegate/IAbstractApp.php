<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/12/26 0026
 * Time: 11:37
 */

namespace core\delegate;


interface IAbstractApp {
    public function sessionStart();
    public function funcEcho($str);
    public function funcQuit();
}