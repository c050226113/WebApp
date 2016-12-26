Editor = null;
Editor = {
    init:function(text,index){
        if(!BabyInfo.isAdmin())
        {
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var lis = Setting.setting_li;
        if(lis.find(".manual_shutdown").attr("title") != 0){
            var dialogArr = Message.dialog('提示', Language.are_you_sure_you_want_to_allow_manual_shutdown+"?", '确定', '取消');
            dialogArr[0].find("#all_notice_button1").click(function () {
                Message.removeDialog();
                Editor.canShutdown(0);
            });
            dialogArr[0].find("#all_notice_button2").click(function () {
                Message.removeDialog();
            });
        }else{
            var dialogArr = Message.dialog('提示', Language.are_you_sure_you_want_to_ban_manual_shutdown+"?", '确定', '取消');
            dialogArr[0].find("#all_notice_button1").click(function () {
                Message.removeDialog();
                Editor.canShutdown(1);
            });
            dialogArr[0].find("#all_notice_button2").click(function () {
                Message.removeDialog();
            });
        }
    },
    canShutdown:function(flag){
        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/shutdownsetting',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                on: flag
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    var lis = Setting.setting_li;
                    if(flag){
                        lis.find(".manual_shutdown").attr("title","1").text(Language.already_open);
                    }else{
                        lis.find(".manual_shutdown").attr("title","0").text(Language.already_stop);
                    }
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