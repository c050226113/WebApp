Editor = null;
Editor = {
    eq:0,
    timeArr:[],
    index:null,
    page:$(".page"),
    obj:null,
    init:function(text,index){
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").html("<b>"+Language.clock_setting+"</b>&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-danger' onclick='Editor.disable()'>"+Language.stop_using+"</button>");

        var lis = Setting.setting_li;
        var title,timeArr;
        title = lis.find(".clock_setting").attr("title");
        if(title){
            timeArr = title.split(" ");
            if(timeArr.length){
                var dayStr = Setting.getSevenDayStr(parseInt(timeArr[0],16).toString(2));
                var dayArr = dayStr.split("");
                for(var i=0;i<dayArr.length;i++){
                    if(dayArr[i] == 1){
                        this.obj.find("input.clock_day").eq(i).prop("checked",true);
                    }else{
                        this.obj.find("input.clock_day").eq(i).prop("checked",false);
                    }
                }

                var morning = timeArr[1].split(":");

                this.obj.find("#time1_h").val(parseInt(morning[0]));
                this.obj.find("#time1_m").val(parseInt(morning[1]));
            }
        }else{
            this.obj.find("input.clock_day").prop("checked",false);
            this.obj.find("select").val(0);
        }

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var sct,content="",h1,m1;

        this.obj.find("input.clock_day").each(function(){
            if($(this).prop("checked")){
                content += "1";
            }else{
                content += "0";
            }
        });

        h1 = this.obj.find("#time1_h").val();
        m1 = this.obj.find("#time1_m").val();
        var arr=[h1,m1];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<10){
                arr[i] = "0"+arr[i];
            }
        }

        sct = Setting.getSctHead(parseInt(content,2).toString(16))+ " "+arr[0]+":"+arr[1];

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/clocksetting',
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
                    lis.eq(Editor.eq).find(".clock_setting").attr("title",sct).text(Language.already_open);
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
    },
    disable:function(){
        var  sct ="00 00:00";
        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/clocksetting',
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
                    lis.eq(Editor.eq).find(".clock_setting").attr("title",sct).text(Language.already_stop);
                    Editor.obj.find(".kill").trigger("click");
                }else{
                    P_index.checkTokenError(data.msg);
                    Message.toast(Language.data_error_modification_failed);
                    Editor.obj.find(".kill").trigger("click");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error_modification_failed);
                Editor.obj.find(".kill").trigger("click");
            }
        });
    }
};