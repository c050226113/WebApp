<?php


class LanguageChina{
    private $words = array(
        "hello"=>"你好",
        "checkCode_error"=>"验证码错误",
        "please_enter_the_username"=>"请填写用户名",
        "please_enter_the_password"=>"请填密码",
        "the_account_is_not_register"=>"该账号还未注册",
        "data_error"=>"数据传输出错",
        "password_or_account_is_error"=>"密码或账号输入有误",
        "account_has_exist"=>"用户已存在",
        "no_location_information"=>"暂无定位信息",
        "old_password_error"=>"原密码有误，修改失败",
        "missing_name"=>"缺少姓名参数",
        "nickname_is_too_long"=>"昵称过长",
        "missing_height"=>"缺少身高参数",
        "height_is_error"=>"身高参数异常",
        "missing_weight"=>"缺少体重参数",
        "weight_is_error"=>"体重参数异常",
        "missing_sex"=>"缺少性别参数",
        "sex_is_error"=>"性别参数异常",
    );

    public function getStringByIndex($index){
        return $this->words[$index];
    }
}