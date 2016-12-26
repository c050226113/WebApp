<!DOCTYPE html>
<html>
<head>
    <title>注册</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/common/css.css">
    <style>
        body{
            height: 400px;
        }
        input::-webkit-input-placeholder{
            color: #bbb;
        }
        #input_account{
            top: 0;
            width: 88%;
            position: absolute;
            left:6%;
            height: 32%;
            padding: 0;
            font-size: 90%;
            outline:none;
            border: 0;
            box-shadow:none;
            background-color: transparent;
        }
        #input_password{
            top: 34%;
            width: 88%;
            position: absolute;
            left:6%;
            height: 32%;
            padding: 0;
            font-size: 90%;
            outline:none;
            border: 0;
            box-shadow:none;
            background-color: transparent;
        }
        #input_password2{
            top: 68%;
            width: 88%;
            position: absolute;
            left:6%;
            height: 32%;
            padding: 0;
            font-size: 90%;
            outline:none;
            border: 0;
            box-shadow:none;
            background-color: transparent;
        }
        #btn_register{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 100% auto auto auto;
            width: 85%;
            height: 10%;
            background-color: #0098FB;
            border-radius: 10px;
        }
        #box_border{
            position: absolute;
            width: 88%;
            height: 35%;
            border: solid 1px #f1f1f1;
            border-radius: 9px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 42% auto auto auto;
        }
        #box_border i{
            position: absolute;
            width: 94%;
            left: 3%;
            height: 1px;
            display: inline-block;
            background-color: #ddd;
        }
        #box_border i:nth-of-type(1) {
            top: 33%;
        }
        #box_border i:nth-of-type(2) {
            top: 66%;
        }
        #phone{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 10% auto auto auto;
            width: 80%;
            height: 20%;
            background:url("/highcharts/static/img/main_soft/login/phone.svg") no-repeat;
            background-size: 100% 100%;
        }
        .tip_span{
            position: absolute;
            font-size: 90%;
            top: 110%;
            color:#0098FB
        }
        #span_forget{
            left: 0;
        }
    </style>
</head>
<body id="register">
<div id="phone"></div>
<div id="box_border">
    <input id="input_account" type="text" v-model="input.account.text" placeholder="{{input.account.hint}}">
    <i></i>
    <input id="input_password" type="password" v-model="input.password.text" placeholder="{{input.password.hint}}">
    <i></i>
    <input id="input_password2" type="password" v-model="input.password2.text" placeholder="{{input.password2.hint}}">
    <span id="span_forget" class="tip_span" v-on:click="login">返回登录</span>
</div>
<button id="btn_register" type="button" class="button tiny" v-on:click="register">注册</button>
<script>
    var WEB_URL = '<?=ROOT_URL?>';
</script>
<script>
    var register;
    register = new Vue({
        el: '#register',
        created: function () {},
        compiled: function () {},
        data:
        {
            input: {
                account: {text:"",hint:"请输入您的账号"},
                password: {text:"",hint:"请输入您的密码"},
                password2: {text:"",hint:"请重复您的密码"}
            },
            loginUrl: WEB_URL+'index.php?r=main_soft/login',
            registerUrl: WEB_URL+'index.php?r=main_soft/register'
        },
        computed: {
        },
        methods: {
            login: function(){
                window.location.href = this.loginUrl;
            },
            register: function(){
                var account,password,password2;
                account = this.input.account.text.trim();
                password = this.input.password.text.trim();
                password2 = this.input.password2.text.trim();

                var res = Helper.checkTwoPassword(password,password2);
                if(res !== true){
                    Message.toast(res,2);
                    return false;
                }else{
                    $.ajax({
                        type: 'post',
                        url: this.registerUrl,
                        data: {
                            account: account,
                            password: password
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.code != 0) {
                                Message.toast(data.msg, 2);
                                return false;
                            } else {
                                Message.toast("注册成功",2);
                                setTimeout(function(){
                                    window.location.href = registerVm.loginUrl;
                                },1000);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {},
                        complete: function () {}
                    });
                }
            }
        }
    });
</script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/foundation.min.js"></script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
<script src="<?=ROOT_URL?>static/js/common/util.js"></script>
</body>
</html>