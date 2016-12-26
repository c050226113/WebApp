Editor = null;
Editor = {
    eq:0,
    arr:[0.5,1,3,5,10,15,30,60],
    index:null,
    page:$(".page"),
    obj:null,
    init:function(text,index){
        this.eq = index;
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").html("<b>"+Language.sound_setting+"</b>");

        var lis = Setting.setting_li;
        var arr = lis.find(".sound_setting").attr("title").split("|");

        switch (arr[0]){
            case "0":
                this.obj.find("input[name='ring']").eq(0).prop("checked",false);
                this.obj.find("input[name='ring']").eq(1).prop("checked",false);
                break;
            case "1":
                this.obj.find("input[name='ring']").eq(0).prop("checked",true);
                this.obj.find("input[name='ring']").eq(1).prop("checked",false);
                break;
            case "2":
                this.obj.find("input[name='ring']").eq(0).prop("checked",false);
                this.obj.find("input[name='ring']").eq(1).prop("checked",true);
                break;
            case "3":
                this.obj.find("input[name='ring']").eq(0).prop("checked",true);
                this.obj.find("input[name='ring']").eq(1).prop("checked",true);
                break;
        }

        switch (arr[1]){
            case "0":
                this.obj.find("input[name='notification']").eq(0).prop("checked",false);
                this.obj.find("input[name='notification']").eq(1).prop("checked",false);
                break;
            case "1":
                this.obj.find("input[name='notification']").eq(0).prop("checked",true);
                this.obj.find("input[name='notification']").eq(1).prop("checked",false);
                break;
            case "2":
                this.obj.find("input[name='notification']").eq(0).prop("checked",false);
                this.obj.find("input[name='notification']").eq(1).prop("checked",true);
                break;
            case "3":
                this.obj.find("input[name='notification']").eq(0).prop("checked",true);
                this.obj.find("input[name='notification']").eq(1).prop("checked",true);
                break;
        }

        $("#ring_value").val(arr[2]);
        $("#talk_value").val(arr[3]);

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified+"!");
            return false;
        }

        var mvol, svol, calter, malter;
        mvol = $("#ring_value").val();
        svol = $("#talk_value").val();

        if(this.obj.find("input[name='ring']").eq(0).prop("checked")){
            if(this.obj.find("input[name='ring']").eq(1).prop("checked")){
                calter = 3;
            }else{
                calter = 1;
            }
        }else{
            if(this.obj.find("input[name='ring']").eq(1).prop("checked")){
                calter = 2;
            }else{
                calter = 0;
            }
        }

        if(this.obj.find("input[name='notification']").eq(0).prop("checked")){
            if(this.obj.find("input[name='notification']").eq(1).prop("checked")){
                malter = 3;
            }else{
                malter = 1;
            }
        }else{
            if(this.obj.find("input[name='notification']").eq(1).prop("checked")){
                malter = 2;
            }else{
                malter = 0;
            }
        }

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/soundsetting',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                mvol: mvol,
                svol: svol,
                calter: calter,
                malter: malter
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    var lis = Setting.setting_li;
                    lis.find(".sound_setting").attr("title",calter+"|"+malter+"|"+mvol+"|"+svol);
                    Editor.obj.find(".kill").trigger("click");
                }else{
                  P_index.checkTokenError(data.msg);
                    //Message.toast(Language.data_error_modification_failed+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error);
            }
        });
    }

};