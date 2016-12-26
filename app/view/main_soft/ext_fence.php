<style>
    #bMap{
        height: 93%;
    }
</style>
<!--    index nav    -->
<div class="nav">
    <div class="nav_back" onclick="$('#aMap').show();locationVm.showExt = false;setTimeout(function(){$('#bMap').hide();},400);"><img class="h100" src="<?=ROOT_URL?>static/img/main_soft/common/back.svg" />返回</div>
    <h1>电子围栏</h1>
    <div class="nav_add">保存</div>
</div>

<div id="bMap" class="w100"></div>
<script>
    var WEB_URL = '<?=ROOT_URL?>';
</script>
<script>
    var fenceVm;
    fenceVm = new Vue({
        el: '#fence',
        created: function () {
            setTimeout(function(){
                $("#aMap").hide();
            },400);
            this.initMap();
        },
        compiled: function () {
        },
        data: {
            map:new AMap.Map('bMap'),
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
        },
        methods: {
            initMap:function(){
                this.map.setCenter([LON,LAT]);
                this.map.setZoom(16);
            },
            init:function(){
                $('#bMap').show();
            }
        }
    });
</script>
