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

        this.obj.find("#myModalLabel").html("<b>"+Language.device_info+"</b>");

        var lis = Setting.setting_li;
        this.obj.find("#watch_num").val(lis.find(".modify_watch_number").text());


        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var lis = Setting.setting_li;
        var old_num = lis.find(".modify_watch_number").text();

        var new_num = this.obj.find("#watch_num").val();

        if(old_num == new_num){
            return false;
        }

        if(!Helper.isMobileNumber(new_num)){
            Message.toast(Language.enter_the_phone_number_format_error);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/devicephonenumber',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                phone: new_num
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success);
                    var lis = Setting.setting_li;
                    lis.find(".modify_watch_number").text(new_num);
                    devicesData[BabyInfo.index]["P"] = new_num;
                    Editor.obj.find(".kill").trigger("click");
                }else{
                    P_index.checkTokenError(data.msg);
                    //Message.toast(Language.data_error_modification_failed);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error);
            }
        });
    }
};