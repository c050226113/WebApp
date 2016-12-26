<!DOCTYPE html>
<html>
<head>
    <title>定位</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/foundation/5.5.3/css/foundation.min.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/common/css.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/nav.css">
    <link rel="stylesheet" href="<?=ROOT_URL?>static/css/main_soft/common/foundation.css">
    <style>
        .clblue{
            color: #0088e4;
        }
        #mapOpt{
            bottom: 0;
            position: absolute;
            height: 20%
        }
        #mapOpt li>div{
            width: 52px;height: 52px;border-radius: 50%; border:solid 1px deepskyblue;
        }
        #mapOpt li div.cover{
            border-radius: 50%;
            opacity: .8;
            background: #fff
        }
        #aMap{
            height: 93%;
        }
    </style>
</head>
<body id="location">
<!--    index nav    -->
<div class="nav">
    <div class="nav_back" onclick="window.location.href=locationVm.indexUrl"><img class="h100" src="<?=ROOT_URL?>static/img/main_soft/common/back.svg" />返回</div>
    <h1>定位</h1>
</div>
<div id="aMap" class="w100"></div>
<ul id="mapOpt" class="w100">
    <li v-for="item in footer" class="fl h100 w20 pos_r">
        <div class="c" onclick="locationVm.showExt={{ '\''+item.pageName+'\'' }}">
            <div class="cover w100 h100 pos_a"></div>
            <img class="c w50" src="<?=ROOT_URL?>static/img/main_soft/location/{{ item.img }}.svg" style="color:{{ '#'+item.textColor }}" />
        </div>
    </li>
</ul>
<!--    app extend    -->
<div id="expand">
    <section id="fence">
    </section>
</div>
<script src="http://webapi.amap.com/maps?v=1.3&key=e26b8cda40107bdb109530c28990582b&plugin=AMap.Geocoder,AMap.PolyEditor,AMap.CircleEditor"></script>
<script>
    var LON = <?=$info["lon"]?>;
    var LAT = <?=$info["lat"]?>;
    var WEB_URL = '<?=ROOT_URL?>';
</script>
<script>
    var locationVm;
    locationVm = new Vue({
        el: '#location',
        created: function () {
            this.showExt = false;
            this.initMap();
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
            footer:[
                {pageName:'fence',img:"fence",text:"电子围栏" ,textColor:"ea8010"},
                {pageName:'foot',img:"foot",text:"行动轨迹" ,textColor:"00bb9c"},
                {pageName:'alarm',img:"alarm",text:"安全警报",textColor:"eb4f38"},
                {pageName:'voice',img:"voice",text:"语音监护" ,textColor:"56abe4"},
                {pageName:'sports',img:"sports",text:"运动轨迹",textColor:"9d55b8"}
            ],
            ext:{

            },
            screenWidth : document.body.clientWidth,
            indexUrl: WEB_URL+'index.php?r=main_soft/index',
            extUrl: WEB_URL+'index.php?r=main_soft/load_ext'

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
                        var callBack = function(data){
                            $("#expand").show();
                            $("section#"+pageId).show().append(data);
                            eval(pageId+"Vm.init();");
                            setTimeout(function(){
                                $("#expand").css("transform","translateX(0px)");
                            },10);
                        };
                        if($("section#"+pageId).html().length > 10){
                            callBack("");
                        }else{
                            $.ajax({
                                type: 'post',
                                url: this.extUrl,
                                data: {
                                    name: pageId
                                },
                                dataType: 'text',
                                success: function (data) {
                                    if(data){
                                        callBack(data);
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
                        }
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
            back:function(){
                window.location.href = this.indexUrl;
            },
            initMap:function(){
                this.map.setCenter([LON,LAT]);
                this.map.setZoom(14);
//
                var marker = new AMap.Marker({
                    map: Map.map,
                    position: [LON, LAT],
                    icon: WEB_URL+"static/img/main_soft/location/location.png",
                    offset: new AMap.Pixel(-15, -25)
                });
                marker.setMap(this.map);

                var circle = new AMap.Circle({
                    center: [LON, LAT],
                    radius: 600,
                    strokeColor: '#0098FB',
                    strokeWeight: 1,
                    fillColor: '#fff',
                    fillOpacity: 0.6
                });
                circle.setMap(this.map);
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
