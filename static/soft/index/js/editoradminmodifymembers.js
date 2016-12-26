Editor = null;
Editor = {
    role:0,
    initAvatar:0,
    eq:0,
    obj:null,
    init:function(text,index){
        this.eq = parseInt(index);
        this.obj = $("#"+text);
        this.role = this.eq+7;

        this.obj.find("#myModalLabel").html("<b>"+Language.edit+" "+Phb.roleArr[(Editor.eq+6)]+" "+Language.member+"</b>");

        var lis = $("#right .members .f_item");
        var name = lis.eq(this.eq).find(".name").text();
        if(name){
            this.obj.find("#name").val(name);
        }else{
            this.obj.find("#name").val(Phb.roleArr[(Editor.eq+6)]);
        }

        var phone = lis.eq(this.eq).find(".phoneNumber").text();
        if(Helper.isMobileNumber(phone)){
            this.obj.find("#phone").val(phone);
            this.obj.find(".delmembers").show();
        }else{
            this.obj.find("#phone").val(null);
            this.obj.find(".delmembers").hide();
        }

        this.initAvatar = Phb.pba[BabyInfo.index].split(",");
        this.initAvatar = (this.initAvatar[index + 6]);
        if(isNaN(this.initAvatar)){
            this.initAvatar = index + 7;
        }
        this.obj.find(".currentAvatar_box .currentAvatar").attr("src", imgUrl+"contact_avatar" + this.initAvatar + ".png").attr("title", this.initAvatar);
        this.obj.find(".avatar_box").each(function (index, obj) {
            if (index + 1 == Editor.initAvatar) {
                $(obj).css("border", "solid 2px red").addClass("active");
            } else {
                $(obj).css("border", "solid 2px white");
            }
            $(obj).find("img").attr("src", imgUrl+"contact_avatar" + (index + 1) + ".png")
        });

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }
        var lis = $("#right .members .f_item");
        var old_name,old_phone;
        var name,phone;

        old_name = lis.eq(this.eq).find(".name").text();
        var old_phone_temp = lis.eq(this.eq).find(".phoneNumber").text();
        if(Helper.isMobileNumber(old_phone_temp)){
            old_phone = old_phone_temp;
        }else{
            old_phone = "";
        }

        name =  this.obj.find("#name").val();
        phone =  this.obj.find("#phone").val();
        if(!Helper.isMobileNumber(phone)){
            Message.toast(Language.enter_the_phone_number_format_error);
            return false;
        }

        var avatarNum = this.obj.find(".currentAvatar").attr("title");
        var pba = "";
        if (avatarNum != this.initAvatar) {
            pba = avatarNum;
        }

        if((old_name == name && !pba) && old_phone == phone){
            return false;
        }else if((old_name != name||pba) && old_phone == phone){
            //改名字
            var pbn="";
            $(".members .item").each(function(index,obj){
                var name_temp = $(this).find(".name").text().replace("\("+Language.admin+"\)","");
                if(index == (Editor.eq+6)){
                    name_temp = name;
                }
                pbn += name_temp;
                pbn += ",";
            });
            pbn = pbn.substr(0,(pbn.length-1));
            var pbaStr = "";
            if (!pba) {
                pbaStr = Phb.pba[BabyInfo.index];
            } else {
                var arr = Phb.pba[BabyInfo.index].split(",");
                for (var i = 0; i < 20; i++) {
                    if ((i + 1) == Editor.role) {
                        pbaStr += pba + ",";
                    } else {
                        pbaStr += arr[i] + ",";
                    }
                }
            }

            $.ajax({
                type: 'post',
                url: indexUrl+'?r=setting/modifymembername',
                data: {
                    device:devicesData[BabyInfo.index]["D"],
                    role:devicesData[BabyInfo.index]["R"],
                    pba: pbaStr,
                    pbn: pbn
                },
                dataType: 'json',
                success: function (data) {
                    if(data.code == 0){
                        Message.toast(Language.modify_success+"!");
                        var lis = $("#right .members .f_item");
                        lis.eq(Editor.eq).find(".name").text(name);
                        if (pba) {
                            lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                            Phb.pba[BabyInfo.index] = pbaStr;
                        }
                        Editor.obj.find(".kill").trigger("click");
                    }else if(data.code == 1){
                      P_index.checkTokenError(data.msg);
                        //Message.toast(Language.modify_fail+"!");
                    }else{
                        Message.toast(data.msg+"!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error+"!");
                }
            });
        }else if(old_name == name && old_phone != phone){
            //改电话
            var pb="";
            $(".members .item").each(function(index,obj){
                var phoneArr_temp = $(this).find(".phoneNumber").text().split("(");
                var phone_temp = phoneArr_temp[0];
                if(!Helper.isMobileNumber(phone_temp)){
                    phone_temp = "";
                }
                if(index == (Editor.eq+6)){
                    phone_temp = phone;
                }
                if(index>5){
                    pb += phone_temp;
                    pb += ",";
                }
            });
            pb = pb.substr(0,(pb.length-1));

            $.ajax({
                type: 'post',
                url: indexUrl+'?r=setting/modifymemberphone',
                data: {
                    device:devicesData[BabyInfo.index]["D"],
                    role:devicesData[BabyInfo.index]["R"],
                    pb: pb
                },
                dataType: 'json',
                success: function (data) {
                    if(data.code == 0){
                        Message.toast(Language.modify_success+"!");
                        var lis = $("#right .members .f_item");
                        lis.eq(Editor.eq).find(".phoneNumber").text(phone);
                        Editor.obj.find(".kill").trigger("click");
                    }else if(data.code == 1){
                        P_index.checkTokenError(data.msg);
                        //Message.toast(Language.modify_fail+"!");
                    }else{
                        Message.toast(data.msg+"!");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(Language.data_error+"!");
                }
            });
        }else{
            //都改
            var pbn="";
            $(".members .item").each(function(index,obj){
                var name_temp = $(this).find(".name").text().replace("\("+Language.admin+"\)","");
                if(index == (Editor.eq+6)){
                    name_temp = name;
                }
                pbn += name_temp;
                pbn += ",";
            });
            pbn = pbn.substr(0,(pbn.length-1));
            var pb="";
            $(".members .item").each(function(index,obj){
                var phoneArr_temp = $(this).find(".phoneNumber").text().split("(");
                var phone_temp = phoneArr_temp[0];
                if(!Helper.isMobileNumber(phone_temp)){
                    phone_temp = "";
                }
                if(index == (Editor.eq+6)){
                    phone_temp = phone;
                }
                if(index>5){
                    pb += phone_temp;
                    pb += ",";
                }
            });
            pb = pb.substr(0,(pb.length-1));

            var type = 0;
            var pbaStr = "";
            if (!pba) {
                pbaStr = Phb.pba[BabyInfo.index];
            } else {
                var arr = Phb.pba[BabyInfo.index].split(",");
                for (var i = 0; i < 20; i++) {
                    if (i + 1 == Editor.role) {
                        pbaStr += pba + ",";
                    } else {
                        pbaStr += arr[i] + ",";
                    }
                }
            }

            $.ajax({
                type: 'post',
                url: indexUrl+'?r=setting/modifymembername',
                data: {
                    device:devicesData[BabyInfo.index]["D"],
                    role:devicesData[BabyInfo.index]["R"],
                    pba: pbaStr,
                    pbn: pbn
                },
                dataType: 'json',
                success: function (data) {
                    if(data.code == 0){
                        type = type+1;
                    }else{
                        P_index.checkTokenError(data.msg);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {},
                complete:function(){
                    $.ajax({
                        type: 'post',
                        url: indexUrl+'?r=setting/modifymemberphone',
                        data: {
                            device:devicesData[BabyInfo.index]["D"],
                            role:devicesData[BabyInfo.index]["R"],
                            pb: pb
                        },
                        dataType: 'json',
                        success: function (data) {
                            if(data.code == 0){
                                type = type+2;
                            }else{
                                P_index.checkTokenError(data.msg);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {},
                        complete: function(){
                            switch (type){
                                case 0:
                                    Message.toast(Language.modify_fail);
                                    break;
                                case 1:
                                    Message.toast(Language.name_modify_success_phone_modify_error);
                                    var lis = $("#right .members .f_item");
                                    lis.eq(Editor.eq).find(".name").text(name);
                                    if (pba) {
                                        lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                                        Phb.pba[BabyInfo.index] = pbaStr;
                                    }
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                                case 2:
                                    Message.toast(Language.phone_modify_success_name_modify_error);
                                    var lis = $("#right .members .f_item");
                                    lis.eq(Editor.eq).find(".phoneNumber").text(phone);
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                                case 3:
                                    Message.toast(Language.phone_modify_success_name_modify_success);
                                    var lis = $("#right .members .f_item");
                                    lis.eq(Editor.eq).find(".name").text(name);
                                    if (pba) {
                                        lis.eq(Editor.eq).find(".head_img").attr("src", imgUrl+"contact_avatar" + pba + ".png");
                                        Phb.pba[BabyInfo.index] = pbaStr;
                                    }
                                    lis.eq(Editor.eq).find(".phoneNumber").text(phone);
                                    Editor.obj.find(".kill").trigger("click");
                                    break;
                            }
                        }
                    });
                }
            });
        }
    },
    delMember:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        //都改
        var pbn="";
        $(".members .item").each(function(index,obj){
            var name_temp = $(this).find(".name").text().replace("\("+Language.admin+"\)","");
            if(index == (Editor.eq+6)){
                name_temp = "";
            }
            pbn += name_temp;
            pbn += ",";
        });
        pbn = pbn.substr(0,(pbn.length-1));
        var pb="";
        $(".members .item").each(function(index,obj){
            var phoneArr_temp = $(this).find(".phoneNumber").text().split("(");
            var phone_temp = phoneArr_temp[0];
            if(!Helper.isMobileNumber(phone_temp)){
                phone_temp = "";
            }
            if(index == (Editor.eq+6)){
                phone_temp = "";
            }
            if(index>5){
                pb += phone_temp;
                pb += ",";
            }
        });
        pb = pb.substr(0,(pb.length-1));

        var type = 0;

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/modifymembername',
            data: {
                device:devicesData[BabyInfo.index]["D"],
                role:devicesData[BabyInfo.index]["R"],
                pba: Phb.pba[BabyInfo.index],
                pbn: pbn
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    type = type+1;
                }else{
                     P_index.checkTokenError(data.msg);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {},
            complete:function(){
                $.ajax({
                    type: 'post',
                    url: indexUrl+'?r=setting/modifymemberphone',
                    data: {
                        device:devicesData[BabyInfo.index]["D"],
                        role:devicesData[BabyInfo.index]["R"],
                        pb: pb
                    },
                    dataType: 'json',
                    success: function (data) {
                        if(data.code == 0){
                            type = type+2;
                        }else{
                            P_index.checkTokenError(data.msg);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {},
                    complete: function(){
                        switch (type){
                            case 0:
                                Message.toast(Language.modify_fail);
                                break;
                            case 1:
                                Message.toast(Language.modify_fail);
                                break;
                            case 2:
                                Message.toast(Language.modify_fail);
                                break;
                            case 3:
                                Message.toast(Language.modify_success);
                                var lis = $("#right .members .f_item");
                                lis.eq(Editor.eq).find(".name").text(Phb.roleArr[(Editor.eq+6)]);
                                lis.eq(Editor.eq).find(".phoneNumber").text(Language.add_member);
                                Editor.obj.find(".kill").trigger("click");
                                break;
                        }
                    }
                });
            }
        });
    },
    choose_avatar: function (obj) {
        if (!obj.hasClass("active")) {
            obj.parent().children().css("border", "solid 2px white").removeClass("active");
            obj.addClass("active").css("border", "solid 2px red");

            this.obj.find(".currentAvatar").attr("src", imgUrl+"contact_avatar" + obj.attr("title") + ".png").attr("title", obj.attr("title"));
        }
    }
};
