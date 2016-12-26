<!DOCTYPE html>
<html>
<head>
    <title>绑定手表</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/common/css.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/nav.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/foundation.css">
    <style>
        body,html{
            overflow: hidden;
        }
        section{
            position: relative;
            width: 100%;
            height: 84%;
        }
        #footer{
            position: relative;
            width: 100%;
            height: 9%;
            margin: 0;
        }
        #footer li{
            position: relative;
            list-style: none;
            float: left;
            width: 25%;
            height: 100%;
        }
        #footer div.txtc{
            font-size: 50%;
            line-height: 0;
        }
        #footer img{
            height: 60%;
        }
        .one-{
            position: relative;
            width: 100%;
        }
        #one-slide{
            height: 60%;
        }
        #one-slide img{
            width: 100%;
            height: 100%;
        }
        #one-info{
            height: 19%;
        }
        #one-info img.head{
            height: 70%;
            margin: auto auto auto 5%;
        }
        #one-info img.loc{
            height: 65%;
            margin: auto auto auto 9%;
        }
        #one-info strong{
            font-size: 13px;
            padding-right: 8px;
            text-align: right;
            height: 33px;
            line-height: 30px;
            width: 100px;
            display: block;
            border-radius: 15px;
            border: solid 1px #0098FB;
            margin: auto 5% auto auto;
        }
        #one-info span.s1{
            font-weight: 600;
            font-size: 18px;
            width: 45%;
            height: 18px;
            line-height: 1;
        }
        #one-info span.s2{
            font-size: 13px;
            width: 45%;
            height: 13px;
            line-height: 1;
        }
        #one-opt{
            background: #f5f5f5;
            height: 21%;
        }
        #one-opt li{
            position: relative;
            list-style: none;
            float: left;
            width: 25%;
            height: 100%;
        }
        #one-opt div.txtc{
            font-size: 50%;
        }
        #one-opt img{
            margin: auto auto 8% auto;
            height: 50%;
        }
        .clblue{
            color: #0088e4;
        }
        .clblack {
            color: #000;
        }

    </style>
</head>
<body id="index">
<div class="nav">
    <h1>关爱未来</h1>
    <div class="nav_add" onclick="window.location.href=indexVm.chooseUrl">切换宝宝</div>
</div>
<section v-show="pages[0].isShow">
    <ul id="one-slide" class="one-">
        <img src="<?=ROOT_URL?>static/img/main_soft/index/doctor.png">
    </ul>
    <div id="one-info" class="one-">
        <div class="c h60 w100">
            <div class="fl w100 h50 pos_r"><span class="c s1">{{ device.name }}</span></div>
            <div class="fl w100 h50 pos_r"><span class="c s2">此刻位置：fdjid</span></div>
        </div>
        <img class="head c" src="<?=ROOT_URL?>static/img/main_soft/common/nodata.svg">
        <strong class="location clblue c" onclick="window.location.href=indexVm.locationUrl">
            <img class="c loc" src="<?=ROOT_URL?>static/img/main_soft/index/location.svg">
            定位追踪
        </strong>
    </div>
    <ul id="one-opt" class="one-">
        <li v-for="item in pages[0].opt">
            <div class="h60 pos_r"><img class="c" src="{{ '<?=ROOT_URL?>static/img/main_soft/index/'+item.img  }}"></div>
            <div class="h40 txtc">{{ item.text }}</div>
        </li>
    </ul>
</section>
<section v-show="pages[1].isShow">
    222222222222222222222222222222222<br>
    222222222222222222222222222222222<br>
    222222222222222222222222222222222<br>

</section>
<section v-show="pages[2].isShow">
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
    333333333333333333333333333333333<br>
</section>
<section v-show="pages[3].isShow">
    444
</section>
<!--    index footer    -->
<ul id="footer">
    <li v-for="page in pages" v-on:click="footer_press(page.eq)">
        <div class="h80 pos_r"><img class="c" src="{{ '<?=ROOT_URL?>static/img/main_soft/index/'+((page.isShow)? page.footer_img_pressed : page.footer_img_normal) }}"></div>
        <div class="h20 txtc clblue {{ (page.isShow)? '' : 'clblack' }}">{{ page.footer_text }}</div>
    </li>
</ul>
    <!--    app extend    -->
    <div id="expand">
        <section class="w100 h100 pos_r">
        </section>
    </div>

    <script src="http://webapi.amap.com/maps?v=1.3&key=e26b8cda40107bdb109530c28990582b&plugin=AMap.Geocoder,AMap.PolyEditor,AMap.CircleEditor"></script>
    <script>
        var WEB_URL = '<?=ROOT_URL?>';
        var DEVICES = '<?=json_encode($userObj['devices'][$userObj["using"]])?>';
    </script>
    <script>
        var indexVm;
        indexVm = new Vue({
            el: '#index',
            created: function () {
                this.showExt = false;
                this.initBind();
            },
            compiled: function () {
                $("img").bind("error",function(){
                    $(this).attr("src",WEB_URL+"static/img/main_soft/common/nodata.svg");
                });
                setTimeout(function(){
                    $("#expand").css("transition","all 0.4s ease");
                },500);
            },
            data: {
                map:new AMap.Map('aMap'),
                unavailableImg:WEB_URL+"static/img/main_soft/common/nodata.svg",
                device:DEVICES,
                pages:[
                    {
                        eq:0,
                        isShow:true,
                        footer_img_pressed:'zhuye_pressed.svg',
                        footer_img_normal:'zhuye_normal.svg',
                        footer_text:'我的宝贝',
                        opt:[
                            {img:"nodata.svg",text:"课程表"},
                            {img:"nodata.svg",text:"作业"},
                            {img:"nodata.svg",text:"宝贝消息"},
                            {img:"nodata.svg",text:"联系老师"}
                        ]
                    },
                    {
                        eq:1,
                        isShow:false,
                        footer_img_pressed:'notice_pressed.svg',
                        footer_img_normal:'notice_normal.svg',
                        footer_text:'通知'
                    },
                    {
                        eq:2,
                        isShow:false,
                        footer_img_pressed:'discovery_pressed.svg',
                        footer_img_normal:'discovery_normal.svg',
                        footer_text:'发现'
                    },
                    {
                        eq:3,
                        isShow:false,
                        footer_img_pressed:'me_pressed.svg',
                        footer_img_normal:'me_normal.svg',
                        footer_text:'个人中心'
                    }
                ],
                ext:{
                    location:{
                        btnArr:[
                            {img:"fence",text:"电子围栏" ,textColor:"ea8010"},
                            {img:"foot",text:"行动轨迹" ,textColor:"00bb9c"},
                            {img:"alarm",text:"安全警报",textColor:"eb4f38"},
                            {img:"voice",text:"语音监护" ,textColor:"56abe4"},
                            {img:"sports",text:"运动轨迹",textColor:"9d55b8"}
                        ]
                    }
                },
                screenWidth : document.body.clientWidth,
                chooseUrl: WEB_URL+'index.php?r=main_soft/choose',
                locationUrl: WEB_URL+'index.php?r=main_soft/location'
            },
            computed: {
                extArr:{
                    get:function(){
                        var arr = ['fence','foot','alarm','voice','sports'];
                        return [arr,arr.length];
                    }
                },
                showExt:{
                    set:function(pageId){
                        if(pageId){
                            var canLoad = false;
                            var i;
                            for(i=0;i<this.extArr[1];i++){
                                if(this.extArr[0][i] == pageId){
                                    canLoad = true;
                                    break;
                                }
                            }
                            if(!canLoad){
                                return false;
                            }
                            $.ajax({
                                type: 'post',
                                url: this.extUrl,
                                data: {
                                    name: pageId
                                },
                                dataType: 'text',
                                success: function (data) {
                                    if(data){
                                        $("#expand").show();
                                        $("section#"+pageId).show().append(data);
                                        setTimeout(function(){
                                            $("#expand").css("transform","translateX(0px)");
                                        },10);
                                    }else{
                                        Message.toast("系统出错", 2);
                                        return false;
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    Message.toast(errorThrown, 2);
                                    return false;
                                },
                                complete: function () {}
                            });
                        }else{
                            $("#expand").css("transform","translateX("+this.screenWidth+"px)");
                            setTimeout(function(){
                                $("#expand").hide();
                            },400);
                        }
                    }
                }
            },
            methods: {
                footer_press:function(eq){
                    var i;
                    for(i=0;i<this.pages.length;i++){
                        if(eq == i){
                            this.pages[i].isShow = true;
                        }else{
                            this.pages[i].isShow = false;
                        }
                    }
                },
                initBind:function(){

                }
            }
        });
    </script>
    <script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/foundation.min.js"></script>
    <script src="http://cdn.static.runoob.com/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
    <script src="<?=ROOT_URL?>static/js/common/util.js"></script>
</body>
</html>

