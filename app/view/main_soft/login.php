<!DOCTYPE html>
<html>
<head>
    <title>登录</title>
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
            top: 5%;
            width: 88%;
            position: absolute;
            left: 6%;
            height: 42%;
            padding: 0;
            font-size: 90%;
            outline: none;
            border: 0;
            box-shadow: none;
            background-color: transparent;
        }
        #input_password{
            top: 52%;
            width: 88%;
            position: absolute;
            left: 6%;
            height: 45%;
            padding: 0;
            font-size: 90%;
            outline: none;
            border: 0;
            box-shadow: none;
            background-color: transparent;
        }
        #btn_login{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 95% auto auto auto;
            width: 85%;
            height: 10%;
            background-color: #0098FB;
            border-radius: 10px;
        }
        #box_border{
            position: absolute;
            width: 88%;
            height: 25%;
            border: solid 1px #f1f1f1;
            border-radius: 9px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 45% auto auto auto;
        }
        #box_border i{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 94%;
            height: 1px;
            display: inline-block;
            background-color: #ddd;
        }
        #phone{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 10% auto auto auto;
            width: 80%;
            height: 23%;
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
        #span_register{
            right: 0;
        }
    </style>
</head>
<body id="login">
<div id="phone"></div>
<div id="box_border">
    <input id="input_account" type="text" v-model="input.account.text" placeholder="{{input.account.hint}}">
    <i></i>
    <input id="input_password" type="password" v-model="input.password.text" placeholder="{{input.password.hint}}">
    <span id="span_forget" class="tip_span" v-on:click="forgetPassword">忘记密码？</span>
    <span id="span_register" class="tip_span" v-on:click="register">注册</span>
</div>
<button id="btn_login" type="button" class="button tiny" v-on:click="login">登录</button>
<script>
    var WEB_URL = '<?=ROOT_URL?>';
</script>
<script>
    var loginVm;
    loginVm = new Vue({
        el: '#login',
        created: function () {},
        compiled: function () {},
        data:
        {
            input: {
                account: {text:"",hint:"请输入您的账号"},
                password: {text:"",hint:"请输入您的密码"}
            },
            softIndexUrl: WEB_URL+'index.php?r=main_soft/index',
            registerUrl: WEB_URL+'index.php?r=main_soft/register',
            loginAjaxUrl: WEB_URL+'index.php?r=main_soft/login'
        },
        computed: {
        },
        methods: {
            login: function(){
                $.ajax({
                    type: 'post',
                    url: this.loginAjaxUrl,
                    data: {
                        account: this.input.account.text.trim(),
                        password: this.input.password.text.trim()
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.code != 0) {
                            Message.toast(data.msg, 2);
                        } else {
                            window.location.href = loginVm.softIndexUrl;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {},
                    complete: function () {}
                });
            },
            forgetPassword:function(){
                console.log("forget");
            },
            register:function(){
                window.location.href = this.registerUrl;
            }
        }
    });
</script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/foundation.min.js"></script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
<script src="<?=ROOT_URL?>static/js/common/util.js"></script>
</body>
</html>