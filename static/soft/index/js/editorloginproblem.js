Editor = null;
Editor = {
    phone:"",
    obj:null,
    init:function(text){
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").text(Language.reset_password);

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        var checkCode = this.obj.find("#checkCode").val();
        var newPassword = this.obj.find("#newPassword").val();
        var confirmPassword = this.obj.find("#confirmPassword").val();
        if(!checkCode){
            Message.toast(Language.check_code_cannot_be_empty,2);
            return false;
        }

        var res = Helper.checkTwoPassword(newPassword,confirmPassword);
        if( res !== true){
            Message.toast(res,2);
            return false;
        }

        var phone = this.obj.find("#phone").val();
        if(!Helper.isMobileNumber(phone)){
            Message.toast(Language.enter_the_phone_number_format_error);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/smssetpassword',
            data: {
                checkCode: checkCode,
                phone: phone,
                newPassword: newPassword
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    Editor.obj.find(".kill").trigger("click");
                }else{
                    Message.toast(Language.check_code_error+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error);
            }
        });
    },
    sendSms:function(){
        var phone = this.obj.find("#phone").val();

        if(!phone){
            return false;
        }
        if(!Helper.isMobileNumber(phone)){
            Message.toast(Language.enter_the_phone_number_format_error);
            return false;
        }

        var dialogArr = Message.dialog('提示', "我们将会通过短信发送验证码到"+phone+"该号码上(10分钟有效)，确定要发送验证码吗？", '确定', '取消');
        dialogArr[0].find("#all_notice_button1").click(function () {
            Message.removeDialog();
            $.ajax({
                type: 'post',
                url: indexUrl+'?r=setting/getsms',
                data: {
                    phone: phone
                },
                dataType: 'json',
                success: function (data) {

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error);
                },
                complete:function(){

                }
            });
        });
        dialogArr[0].find("#all_notice_button2").click(function () {
            Message.removeDialog();
        });
    }
};