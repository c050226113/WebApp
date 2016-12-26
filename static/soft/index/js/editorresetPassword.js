Editor = null;
Editor = {
    page:$(".page"),
    obj:null,
    init:function(text){
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").text(Language.reset_password);

        this.obj.find(".checkbox").on("click",function(){Editor.showPassword()});

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    showPassword:function(){
        if(($('.checkbox input').is(':checked'))){
            this.obj.find(".form-group input").attr("type","text");
        }else{
            this.obj.find(".form-group input").attr("type","password");
        }
    },
    editorSubmit:function(){
        var password,newpassord,confirmPassword;
        password = this.obj.find("#password").val();
        newpassord = this.obj.find("#newPassword").val();
        confirmPassword = this.obj.find("#confirmPassword").val();

        var res = Helper.checkTwoPassword(newpassord,confirmPassword);
        if(res !== true){
            Message.toast(res,2);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/editorresetpassword',
            data: {
                password: password,
                newpassord: newpassord
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
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