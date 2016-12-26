<!DOCTYPE html>
<html>
<head>
    <title>登录</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/common/css.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/nav.css">
    <style>
        #main{
            position: relative;
            height: 92%;
            width: 100%;
            margin: 0;
            /*padding-top: 4%;*/
        }
        #main li{
            list-style: none;
            height: 10%;
            width: 90%;
            left: 5%;
            background: #f5f5f5;
            position: relative;
            margin-bottom: 4%;
            border-radius: 10px;
        }
        #main .head{
            margin: auto auto auto 4%;
            height: 90%;
        }
        #main .flag{
            margin: auto 5% auto auto;
            height: 40%;
        }
        #main div.font{
            position: relative;
        }
        #main span,strong{
            height: 13px;
            font-size: 13px;
            line-height:1;
            width: 50%;
        }
        #main div.img{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        #btn{
            display: none;
        }

        #myModal button{
            position: relative;
            width: 90%;
            left: 5%;
            border-radius: 6px;
            height: 40px;
        }
        .reveal-modal-bg{
            width: 120%;
            height: 120%;
        }
    </style>
</head>
<body id="choose">
    <div class="nav">
        <div class="nav_back" v-on:click="back"><img class="h100" src="<?=ROOT_URL?>static/img/main_soft/common/back.svg" />返回</div>
        <h1>选择宝贝</h1>
        <div class="nav_add" v-on:click="add">添加绑定</div>
    </div>
    <ul id="main">
        <div style="height: 4%"></div>
        <li v-for="device in devices" v-on:click="operation(device)">
            <div class="h50 w100 font"><strong class="name c">{{ device.name }}</strong></div>
            <div class="h50 w100 font"><span class="school c">{{ device.school }}</span></div>

            <div class="img" v-show=" device.img != 'a' ">
                <img class="c head" v-bind:src="device.img">
            </div>
            <div class="img" v-else>
                <img class="c head" src="<?=ROOT_URL?>static/img/main_soft/common/nodata.svg">
            </div>

            <div class="img" v-show="using == device.code">
                <img class="c flag" src="<?=ROOT_URL?>static/img/main_soft/choose/choosed.svg">
            </div>
            <div class="img" v-else>
                <img class="c flag" src="<?=ROOT_URL?>static/img/main_soft/choose/choose.svg">
            </div>
        </li>
    </ul>

    <button id="btn" type="button" class="button" data-reveal-id="myModal"></button>

    <div id="myModal" style="
    width: 70%;
    min-height: 200px;
    left: 15%;
    top: 110px;
    " class="reveal-modal" data-reveal>
        <h2 class="txtc">{{ modal.name }}</h2>
        <button style="margin-top: 20px" type="button" class="button tiny" v-on:click="choose">选择默认</button>
        <button type="button" class="button tiny alert" v-on:click="delDevice">取消绑定</button>
        <a class="close-reveal-modal">&times;</a>
    </div>
    <script>
        var WEB_URL = '<?=ROOT_URL?>';
        var USING = '<?=$using?>';
        var DEVICES = <?=json_encode($devices)?>;
    </script>
    <script>
    var chooseVm;
    chooseVm = new Vue({
        el: '#choose',
        created: function () {},
        compiled: function () {},
        data:
        {
            modal:{
                name:'',
                code:''
            },
            using:USING,
            devices: DEVICES,
            bindUrl: WEB_URL+'index.php?r=main_soft/bind',
            softIndexUrl: WEB_URL+'index.php?r=main_soft/index',
            changeUsing: WEB_URL+'index.php?r=main_soft/change_using',
            delDeviceUrl: WEB_URL+'index.php?r=main_soft/del_device'
        },
        computed: {
            modalClose:{
                set:function(flag){
                    if(flag){
                        $('.reveal-modal-bg').trigger("click");
                    }
                }
            }
        },
        methods: {
            add:function(){
                window.location.href = this.bindUrl;
            },
            back:function(){
                window.location.href = this.softIndexUrl;
            },
            operation:function(device){
                this.modal.name = device.name;
                this.modal.code = device.code;
                $("#btn").trigger("click");
            },
            choose:function(){
                this.modalClose = true;
                if(this.using != this.modal.code){
                    var oldUsing = this.using;
                    this.using = this.modal.code;
                    //send to server
                    $.ajax({
                        type: 'post',
                        url: this.changeUsing,
                        data: {
                            code: this.using
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.code != 0) {
                                Message.toast(data.msg, 2);
                                chooseVm.using = oldUsing;
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {},
                        complete: function () {}
                    });
                }
            },
            delDevice:function(){
                var bool = confirm("取消绑定会清除设备的所有信息，确定清楚该设备吗");
                if(!bool){
                    return false;
                }
                $.ajax({
                    type: 'post',
                    url: this.delDeviceUrl,
                    data: {
                        code: this.using
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.code != 0) {
                            Message.toast(data.msg, 2);
                        }else{
                            Message.toast("取消绑定成功", 2);
                            Vue.delete(chooseVm.devices, chooseVm.modal.code);
                            chooseVm.modalClose = true;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {},
                    complete: function () {}
                });
            }

        }
    });
</script>
<script src="<?=ROOT_URL?>static/js/common/util.js"></script>
</body>
</html>