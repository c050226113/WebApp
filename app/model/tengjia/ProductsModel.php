<?php

namespace app\model\tengjia;


class ProductsModel {
    public function getJson(){
        $arr = [
            ['dierdaizhinengshoubiao'],
            ['ertongpingpandiannao'],
            ['ertongqqjing'],
            ['ertongyanbaobiao']
        ];

        return json_encode($arr);
    }
}