Editor = null;
Editor = {
    phoneNum:null,
    role:null,
    obj:null,
    init:function(text,index){
        this.obj = $("#"+text);
        this.obj.find("#myModalLabel").html(Language.add+Phb.roleArr[index-1]+Language.member);
        this.role = index;

        this.obj.find("#name").val(Phb.roleArr[index-1]);
        $("#mo").attr("data-target","#"+text).trigger("click");

    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var phone,password;

        password = this.obj.find("#password").val();
        phone = this.obj.find("#phone").val();

        if(!Helper.isMobileNumber(phone)){
            Message.toast(Language.enter_the_phone_number_format_error+"!");
            return false;
        }

        if(!password){
            Message.toast(Language.please_enter_admin_password+"!");
            return false;
        }

        $.ajax({type: 'post',dataType: 'json',
            url: indexUrl+'?r=setting/adminaddfamily',
            data: {
                device:devicesData[BabyInfo.index]["D"],
                role:devicesData[BabyInfo.index]["R"],
                password: password,
                opRole: Editor.role,
                phone: phone
            },
            success: function (data) {
                if(data.code == 0){
                    var lis = $("#right .members .z_item");
                    lis.eq(Editor.role-1).attr("title","add").find(".phoneNumber").text(phone);
                    Editor.obj.find(".kill").trigger("click");
                    Message.toast(Language.add_success+"!");
                }else{
                     P_index.checkTokenError(data.msg);
                    //Message.toast(Language.add_fail+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error+"!");
            }
        });
    }
};
