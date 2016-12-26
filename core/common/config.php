<?php
use core\App;

define("ROOT_URL",substr(APP::$request->server["path_info"],0,1+strrpos (App::$request->server["path_info"],"/")));