Editor = null;
Editor = {
    fence_bool_flag:false,
    fenceIndex:0,
    area:null,
    lon:0,
    lat:0,
    radius:0,
    marker : null,
    circle : null,
    page:$(".page"),
    map  : new AMap.Map('fenceMap'),
    obj:null,
    init:function(text,index){
        this.fenceIndex = index+1;
        this.area = Right_danger.self.find(".area"+this.fenceIndex);
        this.obj = $("#"+text);
        this.obj.attr("title",this.fenceIndex);
        this.obj.find("#myModalLabel").html(Language.area+(index+1)+Language.information_modification+"&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-danger' onclick='Editor.delFence("+(index+1)+")'>"+Language.delete+"</button>");
        if(this.area.hasClass("danger")){
            this.obj.find("#danger").trigger("click");
        }else{
            this.obj.find("#safe").trigger("click");
        }

        var name = devicesData[BabyInfo.index]["IF"]["FNA"+(index+1)] || 0;

        app.task(function(){Editor.obj.find("#name").val(name);});

        var time = this.area.find(".s2").text();

        if(time != Language.unavailable) {
            this.initView();
            this.initMap();
        }else{
            var lon = Information.lon[BabyInfo.index];
            lon = parseInt(lon)? lon:116.39;
            var lat = Information.lat[BabyInfo.index];
            lat = parseInt(lat)? lat:39.9;

            this.map.setCenter([lon,lat]);
            this.map.setZoom(13);
        }

        this.initBind();

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    initView:function(){
        var name,time,radius;
        name = this.area.find(".s1").text();
        time = this.area.find(".s2").attr("title");
        this.radius = parseInt(this.area.find(".s4").text());

        this.obj.find("#name").val(name);

        //时间
        var arr = time.split(" ");
        var timeArr = arr[1].split("-");
        var time1 = timeArr[0].split(":");
        var time1_h = time1[0];
        var time1_m = time1[1];
        var time2 = timeArr[1].split(":");
        var time2_h = time2[0];
        var time2_m = time2[1];

        $("#time1_h").val(""+parseInt(time1_h));
        $("#time1_m").val(""+parseInt(time1_m));
        if(parseInt(time2_h)>=24){
            time2_h = 23;
            time2_m = 59;
        }
        $("#time2_h").val(""+parseInt(time2_h));
        $("#time2_m").val(""+parseInt(time2_m));

        var weekStr = Setting.getSevenDayStr(parseInt(arr[0],16).toString(2));
        var str;

        for(var i=0;i<7;i++){
            str = weekStr.substr(i,1);
            if(str >=1){
                $("#week input").eq(i).prop("checked",true);
            }else{
                $("#week input").eq(i).prop("checked",false);
            }
        }

        //半径
        this.obj.find("#radius").val(this.radius);

    },
    initMap:function(){
        this.removeAllMarker();
        this.removeAllCircle();

        var position;
        position = DangerArea.getPosition(this.fenceIndex);

        this.lon = position[0];
        this.lat = position[1];

        this.addMarker();
        this.addCircle();

        this.map.setCenter([this.lon,this.lat]);
        this.map.setZoom(15);

    },
    initBind:function(){
        this.obj.find("#radius").on("keyup",function(){
            var radius = parseInt($(this).val());
            if(!isNaN(radius)){
                Editor.radius = radius
            }
            Editor.removeAllCircle();
            Editor.addCircle();
        });
        this.map.on('click', function(e) {
            var lon,lat;
            lon = e.lnglat.getLng();
            lat = e.lnglat.getLat();

            var message = Language.do_you_want+lon+','+lat+Language.location_set_mark_point+"?";
            var dialogArr = Message.dialog('提示', message, '确定', '取消');
            dialogArr[0].find("#all_notice_button1").click(function () {
                Message.removeDialog();
                if(!Editor.fence_bool_flag){
                    Editor.fence_bool_flag = true;
                    setTimeout(function(){
                        Editor.fence_bool_flag = false;
                    },500);
                    Editor.lon = lon;
                    Editor.lat = lat;

                    Editor.removeAllMarker();
                    Editor.removeAllCircle();
                    Editor.addCircle();
                    Editor.addMarker();
                }
            });
            dialogArr[0].find("#all_notice_button2").click(function () {
                Message.removeDialog();
            });
        });
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var name,type,radius,lon,lat,sct,content="",h1,m1,h2,m2;
        name = this.obj.find("#name").val();
        if(name == 0){
            Message.toast(Language.please_choose_the_area_name);
            return false;
        }

        this.obj.find("input.check").each(function(){
            if($(this).prop("checked")){
                content += "1";
            }else{
                content += "0";
            }
        });
        h1=this.obj.find("#time1_h").val();
        m1=this.obj.find("#time1_m").val();
        h2=this.obj.find("#time2_h").val();
        m2=this.obj.find("#time2_m").val();
        var arr=[h1,m1,h2,m2];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<10){
                arr[i] = "0"+arr[i];
            }
        }

        sct = Setting.getSctHead(parseInt(content,2).toString(16))+ " "+arr[0]+":"+arr[1]+"-"+arr[2]+":"+arr[3];

        radius = parseInt(this.obj.find("#radius").val());
        type = this.obj.find('input:radio[name="type"]:checked').val();
        lon = this.lon;
        lat = this.lat;

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/editorfence',
            data: {
                lon:lon,
                lat:lat,
                name: name,
                time: sct,
                radius: radius,
                type: type,
                device: devicesData[BabyInfo.index]["D"],
                index: Editor.obj.attr("title"),
                role: devicesData[BabyInfo.index]["R"]
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    lon = parseInt(parseFloat(lon)*1000000);
                    lat = parseInt(parseFloat(lat)*1000000);
                    var index = Editor.obj.attr("title");
                    devicesData[BabyInfo.index]["IF"]["FA"+index] = lat;
                    devicesData[BabyInfo.index]["IF"]["FN"+index] = lon;
                    devicesData[BabyInfo.index]["IF"]["FIN"+index] = type;
                    devicesData[BabyInfo.index]["IF"]["FNA"+index]= name;
                    devicesData[BabyInfo.index]["IF"]["FR"+index]= radius;
                    devicesData[BabyInfo.index]["IF"]["FT"+index]= sct;
                    Right_danger.initView();
                    Message.toast(Language.modify_success);
                    Editor.obj.find(".kill").trigger("click");
                }else{
                  P_index.checkTokenError(data.msg);
                    //Message.toast(Language.modify_fail);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.modify_fail);
            }
        });
    },
    removeAllMarker:function(){
        if(this.marker != null){
            this.marker.setMap();
        }
    },
    removeAllCircle:function(){
        if(this.circle != null){
            this.circle.setMap();
        }
    },
    addMarker:function(){
        var marker;
        marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [this.lon, this.lat]
        });
        marker.setMap(this.map);
        this.marker = marker;
    },
    addCircle:function(){
        var circle;
        circle = Map.getCircle(this.lon,this.lat,this.radius,"red","white");
        circle.setMap(this.map);
        this.circle = circle;
    },
    delFence:function(fenceNum){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var dialogArr = Message.dialog('提示', Language.are_you_sure_you_want_to_delete_this_area+"?", '确定', '取消');
        dialogArr[0].find("#all_notice_button1").click(function () {
            Message.removeDialog();
            $.ajax({
                type: 'post',
                url: indexUrl+'?r=setting/delfence',
                data: {
                    index:fenceNum,
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"]
                },
                dataType: 'json',
                success: function (data) {
                    if(data.code == 0){
                        devicesData[BabyInfo.index]["IF"]["FA"+fenceNum] =
                            devicesData[BabyInfo.index]["IF"]["FN"+fenceNum] =
                                devicesData[BabyInfo.index]["IF"]["FIN"+fenceNum] =
                                    devicesData[BabyInfo.index]["IF"]["FNA"+fenceNum]=
                                        devicesData[BabyInfo.index]["IF"]["FR"+fenceNum]=
                                            devicesData[BabyInfo.index]["IF"]["FT"+fenceNum]= Language.none;

                        Message.toast(Language.modify_success+"!");
                    }else{
                        P_index.checkTokenError(data.msg);
                        //Message.toast(Config.self[parseInt(data.msg)],3);
                    }

                    Editor.obj.find(".kill").trigger("click");
                    Right_danger.initView();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.modify_fail+"!");
                    Editor.obj.find(".kill").trigger("click");
                }
            });
        });
        dialogArr[0].find("#all_notice_button2").click(function () {
            Message.removeDialog();
        });
    }
};
