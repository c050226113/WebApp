var BabyInfo = {
    index:1,
    sexArr:["",Language.boy,Language.girl],
    isAdmin:function(){
        try {
            if(!parseInt(devicesData[BabyInfo.index]["A"])){
                return false;
            }else{
                return true;
            }
        }catch (e) {
            return false;
        }
    },
    switchBuddy:function(baby_index){
        this.index = baby_index;
        //$.publish('publish_babyChange', "");
        $(".nav_icon").find("img").attr("src",devicesData[BabyInfo.index]["IF"]["URL"]);
        $(".nav .name").text(devicesData[BabyInfo.index]["N"]);
        var imgs = $(".babys_box").find("img");
        var length = BabyInfo.getBuddiesNumber();
        var index = 0;
        for(var i=1;i<=length;i++){
            if(i != BabyInfo.index){
                if(devicesData[i]){
                    imgs.eq(index).attr("src",devicesData[i]["IF"]["URL"]+devicesData[i]["IF"]["AV"])
                        .parents(".baby_box").attr("title",i);
                    var color = (parseInt(devicesData[i]["A"])==1)? "black":"#999";
                    imgs.eq(index).parents(".baby_box").find("span").text(devicesData[i]["N"]).css("color",color);
                    index++;
                }
            }
        }
        Information.init();
        JMDatePicker.initData();
    },
    getBuddiesNumber:function(){
        var length = 0;
        for(var i=1;i<=6;i++){
            if(devicesData[i]){
                length++;
            }
        }
        return length;
    }
};

var DangerArea={
    nameArr : [Language.unavailable,Language.home,Language.school,Language.park,Language.others],
    weekArr:[],
    markers:[],
    circles:[],
    init:function(){
        if(!this.weekArr.length){
            this.weekArr = [Language.sunday,Language.monday,Language.tuesday,Language.wednesday,Language.thursday,Language.friday,Language.saturday];
        }
    },
    toggleBorder:function(label,obj,input){
        this.removePosition();

        if(!label.hasClass("active")){
            //height
            this.dangerAreaContent.css({"border":"1px solid #fff", "height":"41px"});
            var slideBox = obj.parents(".slide_box");
            //input
            slideBox.find("input").prop("checked",false);
            $(input).prop("checked",true);
            //button
            slideBox.find("button").hide();
            label.next().show();
            //content
            slideBox.css("height","auto");
            obj.css("height","201px");
            var color= obj.hasClass("danger")? "red":"#96C2E9";
            obj.css("border","1px solid "+color);
            //label
            $(".dangerArea label").removeClass("active");
            label.addClass("active");

            if(label.find("span").text() == Language.none){
                return false;
            }

            this.addPosition(obj);
        }else{
            //button
            label.removeClass("active").next().hide();
            //content
            obj.css({"border":"1px solid #fff","height":"41px"});
            //input
            $(input).prop("checked",false);
        }
    },
    addPosition:function(obj){
        //this.clearNoticeMarker();
        var position,lon,lat,radius,color,marker,circle,img;
        position = this.getPosition(obj.data("index"));
        lon = position[0];
        lat = position[1];
        radius = this.getRadius(obj);
        color = (obj.hasClass("danger"))?"red":"black";
        img = (obj.hasClass("danger"))?"red":"blue";
        if(lon && lat){
            Map.removeMarker(Map.fenceMarker);
            marker = new AMap.Marker({
                map: Map.map,
                position: [lon, lat],
                icon: baseUrl+"/static/project/img/soft/index/map_fence_"+img+".png",
                offset: new AMap.Pixel(-15.5, -16)
            });
            Map.fenceMarker = marker;
            Map.setMarker(marker);

            Map.removeCircle(Map.fenceCircle);
            circle = Map.getCircle(lon, lat, radius,color,"white");
            Map.fenceCircle = circle;
            Map.setCircle(circle);

            Map.map.setCenter([lon,lat]);
            Map.map.setZoom(11.5);
        }
    },
    removePosition:function(){
        Map.removeMarker(Map.fenceMarker);
        Map.removeCircle(Map.fenceCircle);
    },
    getPosition:function(index){
        return [(devicesData[BabyInfo.index]["IF"]["FN"+index])/1000000,(devicesData[BabyInfo.index]["IF"]["FA"+index])/1000000];
    },
    clearNoticeMarker:function(){
        var marker,circle;
        if(this.markers.length>0){
            for(var i=0;i<this.markers.length;i++){
                marker = this.markers[i];
                Map.removeMarker(marker);
            }
        }
        if(this.circles.length>0){
            for(var i=0;i<this.circles.length;i++){
                circle = this.circles[i];
                Map.removeCircle(circle);
            }
        }
    }
};

var Phb = {
    lis:null,
    pba:[],
    pb:[],
    pbs:[],
    pbn:[],
    roleArr:[Language.dad,Language.mom,Language.daddad,Language.dadmom,Language.momdad,Language.mommom,Language.uncle,Language.aunt,Language.gege,Language.jiejie,Language.didi,Language.meimei,Language.friend1,Language.friend2,Language.friend3,Language.friend4],
    resArr:[],
    init:function(){
        if(this.resArr[BabyInfo.index]){
            Phb.initView(this.resArr[BabyInfo.index]);
        }else{
            $.ajax({
                type: 'post',
                url: indexUrl+'?r=soft/getphb',
                data: {
                    device:devicesData[BabyInfo.index]["D"],
                    role:devicesData[BabyInfo.index]["R"]
                },
                dataType: 'json',
                success: function (data) {
                    if(data.code == 0){
                        Phb.resArr[BabyInfo.index] = data.msg;
                        Phb.initView(Phb.resArr[BabyInfo.index]);
                    }else{
                        P_index.checkTokenError(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    P_index.checkTokenError(data.msg);
                }
            });
        }
    },
    initView:function(resStr){
        var lis = $("#right .members .item");
        this.lis = lis;

        if(!resStr){
            lis.find(".name").text(Phb.roleArr[i]);
            lis.attr("title","no").find(".phoneNumber").text(Language.data_error);
            return false;
        }

        var resArr = resStr.split("|");
        this.pba[BabyInfo.index] = resArr[0];
        this.pb[BabyInfo.index] = resArr[1];
        this.pbs[BabyInfo.index] = resArr[2];
        this.pbn[BabyInfo.index] = resArr[3];

        var pba = resArr[0].split(",");
        var pb = resArr[1].split(",");
        var pbs = resArr[2].split(",");
        var pbn = resArr[3].split(",");
        var ad = resArr[4];

        //add pbn
        for(var i=0;i<16;i++){
            if(pbn[i]){
                lis.eq(i).find(".col-xs-7").find(".name").text(pbn[i]);
            }else{
                lis.eq(i).find(".col-xs-7").find(".name").text(this.roleArr[i]);
            }
        }

        //add pb
        lis.attr("title","");
        for(var i=0;i<16;i++){
            if(pb[i]){
                lis.eq(i).find(".col-xs-7").attr("title","add").find(".phoneNumber").text(pb[i]);
            }else{
                lis.eq(i).find(".col-xs-7").find(".phoneNumber").text(Language.add_member);
            }
        }

        //add pbs
        for(var i=0;i<16;i++){
            if(pbs[i]){
                lis.eq(i).find(".col-xs-7").find(".phoneNumber").text(lis.eq(i).find(".phoneNumber").text()+"("+pbs[i]+")");
            }
        }

        //add pba
        for(var i=0;i<16;i++){
            if(pba[i]){
                lis.eq(i).find(".head_img").attr("src",imgUrl+"contact_avatar"+pba[i]+".png");
            }else{
                lis.eq(i).find(".head_img").attr("src", imgUrl+"contact_avatar"+(i+1)+".png");
            }
        }

        //add admin
        lis.eq(ad-1).find(".name").text(lis.eq(ad-1).find(".name").text()+"("+Language.admin+")");
    }
};

var Setting = {
    setting_li:null,
    resArr:[],
    init:function(){

        if(this.resArr[BabyInfo.index]){
            Setting.initView(this.resArr[BabyInfo.index]);
        }else{
            if(!$("#right .func").html()){
                return false;
            }
            $.ajax({
                type: 'post',
                url: indexUrl+'?r=soft/getsettingconfig',
                data: {
                    device:devicesData[BabyInfo.index]["D"],
                    role:devicesData[BabyInfo.index]["R"]
                },
                dataType: 'json',
                success: function (data) {

                    if(data.code == 0){

                        Setting.initView(data.msg);
                        Setting.resArr[BabyInfo.index] = data.msg
                    }else{

                        P_index.checkTokenError(data.msg);
                        Setting.initView("");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    P_index.checkTokenError(data.msg);
                    Setting.initView("");
                }
            });
        }
    },
    initView:function(resStr){
        var setting_li = $("#right .func");

        this.setting_li = setting_li;

        if(!resStr){
            setting_li.attr("title","no").find(".phoneNumber").text(Language.data_error);
            return false;
        }

        var data = JSON.parse(resStr);

        setting_li.attr("title","add");

        var interval_position = (parseInt(data.I)>50)? parseInt(data.I)/60+Language.minute:parseInt(data.I)+Language.second;
        setting_li.find(".interval_position").text(interval_position).attr("title",parseInt(data.I));

        setting_li.find(".sound_setting").text(Language.already_open).attr("title",data.calter+"|"+data.malter+"|"+data.mvol+"|"+data.svol);

        setting_li.find(".manual_shutdown").text(data.PK !=0 ?Language.already_open:Language.already_stop).attr("title",data.PK);

        setting_li.find(".class_disable").text(data.ST.substr(0,2) != "00"?Language.already_open:Language.already_stop).attr("title",data.ST);

        setting_li.find(".clock_setting").text(data.AT.substr(0,2) != "00"?Language.already_open:Language.already_stop).attr("title",data.AT);

        setting_li.find(".interval_shutdown").text(data.PT !== "ff:ff ff:ff"?Language.already_open:Language.already_stop).attr("title",data.PT);

        setting_li.find(".modify_watch_number").text(devicesData[BabyInfo.index]["P"]).attr("title","add");
    },
    //填充成7位的2进制数
    getSevenDayStr:function(dayStr) {
        if (dayStr.length < 7) {
            var zero = "";
            for (var i = 0; i < 7 - dayStr.length; i++) {
                zero += "0";
            }
            dayStr = zero + dayStr;
        }

        return dayStr;
    },
    //填充成 2为的16进制数
    getSctHead:function(sct_head){
        if(sct_head.length<2){
            sct_head = "0"+sct_head;
        }

        return sct_head;
    }
};