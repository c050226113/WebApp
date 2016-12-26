Editor = null;
Editor = {
    eq:0,
    timeArr:[],
    index:null,
    page:$(".page"),
    obj:null,
    init:function(text,index){
        this.eq = index;
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").html("<b>"+Language.interval_shutdown+"</b>&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-danger' onclick='Editor.disable()'>"+Language.stop_using+"</button>");

        var lis = Setting.setting_li;

        var title,timeArr;
        title = lis.find(".interval_shutdown").attr("title");
        if(title){
            timeArr = title.split(" ");

            if(timeArr.length){
                var open = timeArr[0].split(":");
                var shutdown = timeArr[1].split(":");

                this.obj.find("#time1_h").val(parseInt(open[0]));
                this.obj.find("#time1_m").val(parseInt(open[1]));
                this.obj.find("#time2_h").val(parseInt(shutdown[0]));
                this.obj.find("#time2_m").val(parseInt(shutdown[1]));
            }
        }else{
            this.obj.find("#time1_h").val(0);
            this.obj.find("#time1_m").val(0);
            this.obj.find("#time2_h").val(0);
            this.obj.find("#time2_m").val(0);
        }

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var sct,h1,m1,h2,m2;

        h1 = this.obj.find("#time1_h").val();
        m1 = this.obj.find("#time1_m").val();
        h2 = this.obj.find("#time2_h").val();
        m2 = this.obj.find("#time2_m").val();


        var arr=[h1,m1,h2,m2];
        for(var i=0;i<arr.length;i++){
            if(arr[i]<10){
                arr[i] = "0"+arr[i];
            }
        }

        sct = arr[0]+":"+arr[1]+" "+arr[2]+":"+arr[3];

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/intervalshutdown',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                sct: sct
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    var lis =Setting.setting_li;
                    lis.find(".interval_shutdown").attr("title",sct).text(Language.already_open);
                    Editor.obj.find(".kill").trigger("click");
                }else{
                  P_index.checkTokenError(data.msg);
                    //Message.toast(Language.data_error_modification_failed+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error+"!");
            }
        });
    },
    disable:function(){
        var  sct ="ff:ff ff:ff";
        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/intervalshutdown',
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
                    lis.eq(Editor.eq).find(".interval_shutdown").attr("title",sct).text(Language.already_stop);

                    Editor.obj.find(".kill").trigger("click");
                }else{
                  P_index.checkTokenError(data.msg);
                    //Message.toast(Language.data_error_modification_failed+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error+"!");
            }
        });
    }

};