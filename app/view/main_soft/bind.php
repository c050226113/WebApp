
<!DOCTYPE html>
<html>
<head>
    <title>绑定手表</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/common/css.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/nav.css">
    <style>
        #main{
            position: relative;
            height: 400px;
        }
        #box_border{
            position: relative;
            width: 88%;
            height: 50%;
            border: solid 1px #f1f1f1;
            border-radius: 9px;
            top: 8%;
            left: 6%;
        }
        #box_border i{
            position: absolute;
            left: 3%;
            width: 94%;
            height: 1px;
            display: inline-block;
            background-color: #ddd;
        }
        #box_border i:nth-of-type(1){top: 25%;}
        #box_border i:nth-of-type(2){top: 50%;}
        #box_border i:nth-of-type(3){top: 75%;}
        input{
            position: relative;
            outline:none;
        }
        #input_code{
            padding: 0;
            font-size: 90%;
            box-shadow:none;
            background-color: transparent;
            height: 25%;
            width: 88%;
            border: 0;
            margin: 0 0 0 6%;
        }
        #input_num{
            margin: 0 0 0 6%;
            padding: 0;
            font-size: 90%;
            box-shadow:none;
            background-color: transparent;
            height: 25%;
            width: 88%;
            border: 0;
        }
        #input_name{
            margin: 0 0 0 6%;
            padding: 0;
            font-size: 90%;
            box-shadow:none;
            background-color: transparent;
            height: 25%;
            width: 88%;
            border: 0;
        }
        #input_school{
            margin: 0 0 0 6%;
            padding: 0;
            font-size: 90%;
            box-shadow:none;
            background-color: transparent;
            height: 25%;
            width: 88%;
            border: 0;
        }
        #btn_success{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: 80% auto auto auto;
            width: 85%;
            height: 10%;
            background-color: #0098FB;
            border-radius: 10px;
        }
    </style>
</head>
<body id="bind">
<div class="nav">
    <div class="nav_back" v-on:click="back"><img class="h100" src="<?=ROOT_URL?>static/img/main_soft/common/back.svg" />返回</div>
    <h1>绑定手表</h1>
</div>
<div id="main" class="w100">
    <div id="box_border">
        <i></i>
        <i></i>
        <i></i>
        <input id="input_code" type="text" v-model="input.code.text" placeholder="{{input.code.hint}}">
        <input id="input_num" type="text" v-model="input.num.text" placeholder="{{input.num.hint}}">
        <input id="input_name" type="text" v-model="input.name.text" placeholder="{{input.name.hint}}">
        <input id="input_school" type="text" v-model="input.school.text" placeholder="{{input.school.hint}}">
    </div>
    <button id="btn_success" type="button" class="button tiny" v-on:click="success">完成</button>
</div>
<script>
    var WEB_URL = '<?=ROOT_URL?>';
</script>
<script>
    var bindVm;
    bindVm = new Vue({
        el: '#bind',
        created: function () {},
        compiled: function () {},
        data:
        {
            input: {
                code: {text:"",hint:"请输入15位手表序列号"},
                num: {text:"",hint:"请输入4位S/N号码"},
                name: {text:"",hint:"请输入孩子的姓名"},
                school: {text:"",hint:"请输入学校的名称"}
            },
            chooseUrl: WEB_URL+'index.php?r=main_soft/choose',
            bindUrl: WEB_URL+'index.php?r=main_soft/bind'
        },
        computed: {},
        methods: {
            back:function(){
                window.location.href = this.chooseUrl;
            },
            success:function(){

                $.ajax({
                    type: 'post',
                    url: this.bindUrl,
                    data: {
                        code: this.input.code.text.trim(),
                        num: this.input.num.text.trim(),
                        name: this.input.name.text.trim(),
                        school: this.input.school.text.trim()
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.code != 0) {
                            Message.toast(data.msg, 2);
                        } else {
                            Message.toast("绑定成功", 2);
                            setTimeout(function(){
                                window.location.href = bindVm.chooseUrl;
                            },1000);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {},
                    complete: function () {}
                });
            }
        }
    });
</script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/foundation.min.js"></script>
<script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
<script src="<?=ROOT_URL?>static/js/common/util.js"></script>
</body>
</html>

