<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>

    <style>
        .w100 {width: 100%;}
        .w60 {width: 60%;}
        body {width: 98%;text-align: center;}
        .fr {float: right;}
        .row {width: 100%;float: right;}
        .pos_a {position: absolute;}
        iframe {border: none;}
    </style>

    <script src="/html/test/highcharts/view/payqi/../js/vue.min.js"></script>
    <script src="/html/test/highcharts/view/payqi/./js/define.js"></script>
</head>
<body>
<style>
    .glyphicon-search {font-size: 222%;color: #000;float: right;}
    .glyphicon-cloud:hover {cursor: pointer;}
    .col-xs-4.a {margin: 0;padding: 0;border-bottom: 1px solid #000;border-right: 1px solid #000;}
    .col-xs-4 > .row {margin: 0;padding: 6px 0;}
    .col-xs-4 > .row.title {background-color: silver;font-weight: 900;font-size: 118%;height: 40px;}
</style>

<form id="index">
    <div class="row" style="padding: 7px;background-color: #f5f5f5;margin: 21px 0 21px 0;">
        <div class="col-xs-1">
            <span class="glyphicon glyphicon-search"></span>
        </div>
        <div class="col-xs-7">
            <input placeholder="设备号" v-model="imei" class="form-control">
        </div>
        <div class="col-xs-2" style="padding: 0%">
            <a class="btn btn-default w100" @click="getInfo()">搜索单个设备</a>
        </div>
        <div class="col-xs-2" style="padding: 0%">
            <a class="btn btn-success w60" @click="reset()">申请重置</a>
        </div>
    </div>
    </div>
</form>

<script>
    var index = new Vue({
        el: '#index',
        compiled:function () {},
        data:{
            imei:''
        },
        methods: {
            reset:function(){
                var dataStr = '{' +
                    '"'+CODE+'":"'+ this.imei +'"' +
                    '}';
                $.ajax({type: 'post', url: API_URL+'index.php?r=payqi_setting/reset', data: Helper.getJsonObj(dataStr), dataType: 'text',
                    success: function (data) {
                        console.log(data);
                        data = JSON.parse(data);
                        if(data[CODE] == 110){
                            Message.toast("请先登录",2);
                            setTimeout(function(){
                                location.href = "http://123.207.243.228/html/test/highcharts/view/payqi/login.html";
                            },2000);
                        }
                        if (data[CODE] == 0) {
                            //进行操作页面
                            var formObj = $('form');
                            while(formObj.next().attr('class')){
                                formObj.next().remove();
                            }
                            formObj.after(data[MESSAGE]);

                        } else {
                            Message.toast(data[MESSAGE],2);
                            return false;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            },
            getInfo:function(){
                var dataStr = '{' +
                    '"'+CODE+'":"'+ this.imei +'"' +
                    '}';
                $.ajax({type: 'post', url: API_URL+'index.php?r=payqi_setting/search', data: Helper.getJsonObj(dataStr), dataType: 'text',
                    success: function (data) {
                        console.log(data);
                        data = JSON.parse(data);
                        if(data[CODE] == 110){
                            Message.toast("请先登录",2);
                            setTimeout(function(){
                                location.href = "http://123.207.243.228/html/test/highcharts/view/payqi/login.html";
                            },2000);
                        }
                        if (data[CODE] == 0) {
                            //进行操作页面
                            var formObj = $('form');
                            while(formObj.next().attr('class')){
                                formObj.next().remove();
                            }
                            formObj.after(data[MESSAGE]);

                        } else {
                            Message.toast(data[MESSAGE],2);
                            return false;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            }
        }
    });
</script>

</body>
</html>
<script src="/html/test/highcharts/view/payqi/../js/util.js"></script>
<script src="http://libs.baidu.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>