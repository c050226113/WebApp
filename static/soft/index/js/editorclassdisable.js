Editor = null;
Editor = {
    timeArr:[],
    index:null,
    page:$(".page"),
    obj:null,
    init:function(text,index){
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").html("<b>"+Language.class_disable+"</b>&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-danger' onclick='Editor.disable()'>"+Language.stop_using+"</button>");

        var lis = Setting.setting_li;
        var title,timeArr;
        title = lis.find(".class_disable").attr("title");
        if(title){
            timeArr = title.split(" ");
            if(timeArr.length){
                var dayStr = Setting.getSevenDayStr(parseInt(timeArr[0],16).toString(2));
                var dayArr = dayStr.split("");
                for(var i=0;i<dayArr.length;i++){
                    if(dayArr[i] == 1){
                        this.obj.find("input[name='classdisable_day']").eq(i).prop("checked",true);
                    }else{
                        this.obj.find("input[name='classdisable_day']").eq(i).prop("checked",false);
                    }
                }

                var morning = timeArr[1].split("-");
                var morning1 = morning[0].split(":");
                var morning2 = morning[1].split(":");
                var afternoon = timeArr[2].split("-");
                var afternoon1 = afternoon[0].split(":");
                var afternoon2 = afternoon[1].split(":");

                this.obj.find("#time1_h").val(parseInt(morning1[0]));
                this.obj.find("#time1_m").val(parseInt(morning1[1]));
                this.obj.find("#time2_h").val(parseInt(morning2[0]));
                this.obj.find("#time2_m").val(parseInt(morning2[1]));
                this.obj.find("#time3_h").val(parseInt(afternoon1[0]));
                this.obj.find("#time3_m").val(parseInt(afternoon1[1]));
                this.obj.find("#time4_h").val(parseInt(afternoon2[0]));
                this.obj.find("#time4_m").val(parseInt(afternoon2[1]));
            }
        }else{
            this.obj.find("input[name='classdisable_day']").prop("checked",false);
            this.obj.find("select").val(0);
        }

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var sct,content="",h1,h2,h3,h4,m1,m2,m3,m4;

        this.obj.find("input[name='classdisable_day']").each(function(){
            if($(this).prop("checked")){
                content += "1";
            }else{
                content += "0";
            }
        });

        h1 = this.obj.find("#time1_h").val();
        h2 = this.obj.find("#time2_h").val();
        h3 = this.obj.find("#time3_h").val();
        h4 = this.obj.find("#time4_h").val();
        m1 = this.obj.find("#time1_m").val();
        m2 = this.obj.find("#time2_m").val();
        m3 = this.obj.find("#time3_m").val();
        m4 = this.obj.find("#time4_m").val();

        var arr=[h1,m1,h2,m2,h3,m3,h4,m4];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<10){
                arr[i] = "0"+arr[i];
            }
        }

        var timeStart = new Date("2016 "+arr[0]+":"+arr[1]+":00").getTime()/1000;
        var timeEnd = new Date("2016 "+arr[2]+":"+arr[3]+":00").getTime()/1000;
        if((timeStart-timeEnd) >= 0){
            Message.toast(Language.time_setting_error);
            return false;
        }
        var timeStart = new Date("2016 "+arr[4]+":"+arr[5]+":00").getTime()/1000;
        var timeEnd = new Date("2016 "+arr[6]+":"+arr[7]+":00").getTime()/1000;
        if((timeStart-timeEnd) >= 0){
            Message.toast(Language.time_setting_error);
            return false;
        }

        sct = Setting.getSctHead(parseInt(content,2).toString(16)) + " "+arr[0]+":"+arr[1]+"-"+arr[2]+":"+arr[3]+ " "+arr[4]+":"+arr[5]+"-"+arr[6]+":"+arr[7];

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/classdisable',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                sct: sct
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    var lis = Setting.setting_li;
                    lis.find(".class_disable").attr("title",sct).text(Language.already_open);
                    Editor.obj.find(".kill").trigger("click");
                }else{
                    Message.toast(Language.data_error_modification_failed+"!");
                    Editor.obj.find(".kill").trigger("click");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error_modification_failed+"!");
                Editor.obj.find(".kill").trigger("click");
            }
        });
    },
    disable:function(){
        var  sct ="00 00:00-00:00 00:00-00:00";
        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/classdisable',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                sct: sct
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.stop_using_success+"!");
                    var lis = Setting.setting_li;
                    lis.find(".class_disable").attr("title",sct).text(Language.already_stop);

                    Editor.obj.find(".kill").trigger("click");
                }else{
                    P_index.checkTokenError(data.msg);
                    Message.toast(Language.data_error_modification_failed+"!");
                    Editor.obj.find(".kill").trigger("click");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error_modification_failed+"!");
                Editor.obj.find(".kill").trigger("click");
            }
        });
    }

};