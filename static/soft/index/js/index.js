var Location = {
    locationCount:1,
    setUrl:function(url){
        window.location.href=url;
        this.locationCount++;
    },
    //getUrlLast2:function(){
    //    return window.location.href.substr(window.location.href.length-2,2);
    //},
    removeCount:function(){
        this.locationCount--;
    },
    setUrlWithAccess:function(arr){
        P_index.modifyLocation = true;
        for(var i=0;i<arr.length;i++){
            Location.setUrl(arr[i]);
        }
        P_index.modifyLocation = false;
    }
};

var P_index = {
    moreViewTime    : 0.2,
    load            : false,
    infoSet         : false,
    top_actionSet   : false,
    moreViewSet     : false,
    rightSet        : false,
    getting         : false,
    ajaxGet         : [],
    modifyLocation:false,
    inRight:false,
    setUrlFirst:true,
    setUrlSecond:true,
    setUrlThird:true,
    id              :0,
    isLogout        :false,
    init:function(){

        this.initView();

        this.initBind();
    },
    initView:function(){

        app.init();

        //显示主内容隐藏封面图
        if(!this.load){
            this.load = true;
            //定时刷新时间间隔
            setInterval(function(){$("#mid .info .middel p").eq(0).text(Time.change(Time.getStramp() - Information.time[BabyInfo.index])+"前"+$("#deviceName").text()+"在");},1111000);
            //监听回退
            this.indexListen();
            //移除launcher

            setTimeout(function(){
                body.children(".first_step").css("opacity", 0);
                setTimeout(function(){
                    body.children("img").remove();
                    body.children(".first_step").remove();
                    $("#slider").hide();
                },800);
                Location.setUrl(softUrl + "#i");
                Location.setUrl(softUrl + "#ii");
                Location.setUrl(softUrl + "#iii");
            },500);
        }

        //info 位置调整
        if (!this.infoSet) {
            this.infoSet = true;
            var info_mid_row = $(".info .middel .row");
            info_mid_row.css("margin-top", ($(".info").outerHeight() - info_mid_row.outerHeight() + 10) / 2 + "px");
            var info_right_row = $(".info .right .row");
            $(".info .right .icon").css("top", info_right_row.height() * 0.6);
        }

        //隐藏top_action
        if (!this.top_actionSet) {
            this.top_actionSet = true;
            top_action.css({
                "transition": "all "+this.moreViewTime+"s ease",
                "transform":"translateY(-" + top_action.outerHeight() + "px)",
                "display":"none"
            });
        }

        //隐藏moreView
        if (!this.moreViewSet) {
            this.moreViewSet = true;
            moreView.css({
                "transition": "all "+this.moreViewTime+"s ease",
                "transform":"scale(.95)",
                "display":"none"
            });
        }

        //right 动画
        if (right && !this.rightSet) {
            this.rightSet = true;
            right.css({"transform": "translateX(" + BasicTool.screenWidth + "px)", width: BasicTool.screenWidth + "px"});
            setTimeout(function(){
                right.css({
                    "transition": "all .4s ease"
                });
            },500);
        }

        mid_cover.css("opacity",0.6);
    },
    initBind:function(){
        //map type switch
        index_map.on("click","img", function () {
            if ($(this).hasClass("img1")) {
                $(this).attr("src", imgUrl+"standard_map_pressed.png").next().attr("src", imgUrl+"satellite_map.png");
                Map.toggleSatellite(0);
            } else {
                $(this).attr("src", imgUrl+"satellite_map_pressed.png").prev().attr("src", imgUrl+"standard_map.png");
                Map.toggleSatellite(1);
            }
        });

        //get html
        body.on("click",".ajaxGetHtml",function(){
            var id = $(this).attr("id");
            if(id){
                P_index.getHtml(id); 
            }
        });

        //打开关闭拓展视图
        mid_cover.on("click", function () {
            var topTitle = top_action.attr("title");
            var moreViewTitle = moreView.attr("title");

            if (topTitle && moreViewTitle) {
                moreView.css({"opacity": "0", "transform": "scale(.95)"});
                $(".baby_arrow").css("transform", "rotate(0deg)");
                top_action.css("transform", "translateY(-" + top_action.outerHeight() + "px)");
                setTimeout(function () {
                    mid_cover.hide();
                    moreView.hide().attr("title", "");
                    top_action.hide().attr("title", "");
                }, P_index.moreViewTime * 800);
            } else if (topTitle && !moreViewTitle) {
                P_index.showTopAction();
            } else if (!topTitle && moreViewTitle) {
                P_index.showMoreView();
            }
        });

        //切换宝贝时
        //$.subscribe('publish_babyChange', function(e, results) {
        //    $(".nav_icon").find("img").attr("src",devicesData[BabyInfo.index]["IF"]["URL"]);
        //    $(".nav .name").text(devicesData[BabyInfo.index]["N"]);
        //    var imgs = $(".babys_box").find("img");
        //    var length = BabyInfo.getBuddiesNumber();
        //    var index = 0;
        //    for(var i=1;i<=length;i++){
        //        if(i != BabyInfo.index){
        //            if(devicesData[i]){
        //                imgs.eq(index).attr("src",devicesData[i]["IF"]["URL"]+devicesData[i]["IF"]["AV"])
        //                    .parents(".baby_box").attr("title",i);
        //                var color = (parseInt(devicesData[i]["A"])==1)? "black":"#999";
        //                imgs.eq(index).parents(".baby_box").find("span").text(devicesData[i]["N"]).css("color",color);
        //                index++;
        //            }
        //        }
        //    }
        //    Information.init();
        //    JMDatePicker.initData();
        //});
    },
    showTopAction:function(){
        if(top_action.attr("title") == "show"){
            top_action.css("transform", "translateY(-" + top_action.outerHeight() + "px)");
            $(".baby_arrow").css("transform", "rotate(0deg)");
            setTimeout(function(){
                mid_cover.hide();
                top_action.hide().attr("title","");
            },this.moreViewTime*800);
        }else{
            mid_cover.show();
            top_action.show();
            app.task(function(){
                $(".baby_arrow").css("transform", "rotate(180deg)");
                top_action.css("transform", "translateY(0px)").attr("title","show");
            });
        }
    },
    showMoreView:function(){
        if(moreView.attr("title") == "show"){
            moreView.css({"opacity":"0", "transform":"scale(.95)"});
            setTimeout(function(){
                mid_cover.hide();
                moreView.hide().attr("title","");
            },this.moreViewTime*800);
        }else{
            mid_cover.show();
            moreView.show();
            app.task(function(){
                moreView.css({"opacity":"1", "transform":"scale(1)"}).attr("title","show");
            });
        }
    },
    showDialog:function(func1,func2){
        var message = '请确认手机中的号码是否是'+devicesData[BabyInfo.index]["N"]+'的成员，如果不是，电话将无法拨通！';
        var dialogArr = Message.dialog('提醒',message,'确定','取消');
        dialogArr[0].find("#all_notice_button1 a").attr("href","tel:"+devicesData[BabyInfo.index]["P"]).on("click",func1);
        dialogArr[0].find("#all_notice_button2").on("click",func2);
        dialogArr[1].on("click",function(){Message.removeDialog()});
    },
    getHtml : function (name){
        if(right.css("display") != "none"){
            return;
        }

        if(this.ajaxGet[name] == true){
            P_index.rightToggle($("#"+name));
        }else {
            //get css
            var link = '<link href="' + baseUrl + '/static/soft/index/css/right_' + name + '.css" rel="stylesheet">';
            body.append(link);
            //get html
            $.ajax({
                type: 'post',
                url: getUrl,
                data:{name:name},
                dataType: 'text',
                success: function (data) {
                    if(data == 0){
                        Message.toast("数据出错",2);
                        return false;
                    }else{
                        console.log(data);
                        right.append(data);
                        P_index.rightToggle($("#"+name));
                        P_index.ajaxGet[name] = true;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {}
            });
        }
    },
    rightToggle : function (obj){
        if (right.attr("title") != "move") {
            P_index.inRight = true;
            P_index.id = obj.attr("id");
            right.show();
            right.children().hide();
            right.children("."+P_index.id).show();
            P_index.initView();
            setTimeout(function(){$(".left_side").hide();},600);
            eval('Right_'+P_index.id+'.init()');
            app.task(function(){right.attr("title", "move").css("transform", "translateX(0px)");});
            mid_cover.trigger("click");
        } else {
            P_index.inRight = false;
            this.refreshMapView();
            $(".left_side").show();
            right.css("transform", "translateX(" + BasicTool.screenWidth + "px)");
            right.attr("title", "");
            setTimeout(function(){
                right.hide();
            },400);
        }
    },
    refreshMapView:function(){
        index_map.css("z-index",999);
        index_map.css("height","63%");
        $(".picker").hide();
        $("#slider").hide();
        JMSlider.cannotSlide();
        setTimeout(function(){
            $("#location").trigger("click");
        },500);
    },
    indexListen: function () {
        window.onpopstate = function (event) {
            if (P_index.modifyLocation) {
                return;
            }

            if(P_index.setUrlFirst){
                P_index.setUrlFirst = false;
                return;
            }
            if(P_index.setUrlSecond){
                P_index.setUrlSecond = false;
                return;
            }
            if(P_index.setUrlThird){
                P_index.setUrlThird = false;
                return;
            }

            Location.removeCount();

            //var bool = navigator.userAgent.indexOf("MQQBrowser");
            //if(bool>0){
            //    alert("bbbbb");
            //    var message = '确定要退出吗？';
            //    var dialogArr = Message.dialog('提示', message, '确定', '取消');
            //    dialogArr[0].find("#all_notice_button1").click(function () {
            //        Message.removeDialog();
            //        window.history.go(-Location.locationCount);
            //    });
            //    dialogArr[0].find("#all_notice_button2").click(function () {
            //        Message.removeDialog();
            //        Location.setUrlWithAccess([softUrl + "#aaa",softUrl + "#bbb"]);
            //    });
            //}else{
            if (Message.hasDialog) {
                Message.removeDialog();
                Location.setUrlWithAccess([softUrl + "#aaa",softUrl + "#bbb"]);
            }else{
                if(P_index.inRight){
                    if ($(".modal").hasClass("in")) {
                        Editor.obj.find(".kill").trigger("click");
                        Location.setUrlWithAccess([softUrl + "#bbb"]);
                    } else {
                        right.find("."+P_index.id+" .backToIndex").trigger("click");
                        Location.setUrlWithAccess([softUrl + "#bbb"]);
                    }
                }else{
                    var message = '确定要退出吗？';
                    var dialogArr = Message.dialog('提示', message, '确定', '取消');
                    dialogArr[0].find("#all_notice_button1").click(function () {
                        Message.removeDialog();
                        window.history.go(-Location.locationCount);
                        window.history.go(-1);
                        window.history.go(-1);
                        window.history.go(-1);
                        window.history.go(-1);
                    });
                    dialogArr[0].find("#all_notice_button2").click(function () {
                        Message.removeDialog();
                        Location.setUrlWithAccess([softUrl + "#aaa",softUrl + "#bbb"]);
                    });
                }
            }
            //}
        };
    },
    checkTokenError:function(msg){
        var index = parseInt(msg);
        Message.toast(index);
        var str = Config.self[index];
        if(str == "ERROR_TOKEN"){
            Message.toast(Language.token_error,5);
            //window.location.href = indexUrl+"?r=index/logout";
        }else{
            if(!str){
                str = msg;
            }
            Message.toast(str,2);
        }
    },
    showEditBox:function(text,index){
        $.ajax({
            type: 'post',
            url: indexUrl+'?r=soft/geteditor',
            data: {
                name: text
            },
            dataType: 'text',
            success: function (data) {
                $("#right").append(data);
                JMString.foreach();
                head.js(baseUrl+'/static/soft/index/js/editor'+text+'.js?time='+(new Date).getTime(),function(){
                    $(".modal").hide();
                    $("#"+text).show();
                    if(index !=0 && index!="0" && !index){
                        index = 1;
                    }
                    Editor.init(text,index);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    }
};