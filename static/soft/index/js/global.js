var baseUrl = null;
var indexUrl = null;
var softUrl = null;
var getUrl = null;
var imgUrl = null;
var devicesData = null;
var today = null;
var account = null;
var Global = {
    imgUnreadUrl : imgUrl+"avatar_default.png",
    initImg:function(){
        $("body").on("error","img",function(){
            $(this).attr("src",Global.imgUnreadUrl);
        });
    },
    isLoaded:function(){
        return (Map.map)? true:false;
    },
    init_time_out:function(){
        setTimeout(function(){
            if(!Global.isLoaded()){location.reload();}
        },3000);
    },
    initViewObj:function(){
        $(".viewObj").each(function(){$(this).removeClass("viewObj");eval($(this).attr('id')+"=$(this)")});
    },
    init:function(json){
        baseUrl = json.baseUrl;
        indexUrl = baseUrl + '/index.php';
        softUrl = baseUrl + '/index.php?r=soft/index';
        getUrl = indexUrl + '?r=soft/gethtml';
        imgUrl = baseUrl + '/static/soft/index/img/';
        devicesData = json.devicesData;
        today =json.today;
        account = json.account;

        Global.initImg();
        Global.initViewObj();
        Global.init_time_out();
        head.js(JMString.init("chinese"),
            function(){
                JMString.foreach();
                Global.load_index();
            }
        );
    },
    load_index:function(){
        var indexJsDir = "/static/soft/index/js/";
        head.js(
            baseUrl+indexJsDir+"config.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"model.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"map.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"information.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"index.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"calendar.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"jmdatepicker.js?time="+(new Date).getTime(),
            baseUrl+indexJsDir+"jmslipper.js?time="+(new Date).getTime(),
            function(){
                Map.init();

                Information.init();

                P_index.init();

                JMDatePicker.init();

                JMSlider.init();
            }
        );
    }
};
//全局widget对象
var index_map;//map
var body;
var mid_cover;
var top_action;
var moreView;
var right;