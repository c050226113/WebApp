Editor = null;
Editor = {
    avatar_obj: $("#right .baby .baby_info_head"),
    name_obj: $("#right .baby .s1"),
    sex_obj: $("#right .baby .s2"),
    height_obj: $("#right .baby .s3"),
    weight_obj: $("#right .baby .s4"),
    obj:null,
    init:function(text,index){
        this.obj = $("#"+text);
        this.obj.find("#myModalLabel").text(this.name_obj.text()+" "+Language.information_modification);
        this.obj.find("#uploadImg").attr("title","").attr("src",devicesData[BabyInfo.index]["IF"]["URL"]+devicesData[BabyInfo.index]["IF"]["AV"]);
        this.obj.find("#name").attr("value",this.name_obj.text());
        this.obj.find("#height").attr("value",this.height_obj.text());
        this.obj.find("#weight").attr("value",this.weight_obj.text());
        if(devicesData[BabyInfo.index]["IF"]["SS"] == 1){
            this.obj.find("#optionsRadios1").trigger("click");
        }else{
            this.obj.find("#optionsRadios2").trigger("click");
        }

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified+"!");
            return false;
        }

        var name,sex,height,weight;
        name = this.obj.find("#name").val();
        height = parseInt(this.obj.find("#height").val());
        weight = parseInt(this.obj.find("#weight").val());
        sex = this.obj.find('input:radio[name="sex"]:checked').val();

        var old_name,old_height,old_weight,old_sex;
        old_name = this.name_obj.text();
        old_height = parseInt(this.height_obj.text());
        old_weight = parseInt(this.weight_obj.text());
        old_sex = devicesData[BabyInfo.index]["IF"]["SS"];

        var avatar = $("#uploadImg").attr("title");

        if(old_name == name && old_height == height && old_weight == weight && old_sex == sex && !avatar){
            Message.toast(Language.no_modify,1);
            return false;
        }

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/editorbabyinfo',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                name: name,
                height: height,
                weight: weight,
                sex: sex,
                imgUpload:avatar
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 1){
                    P_index.checkTokenError(data.msg);
                }else if(data.code == 0){

                    if(avatar){
                        if(data.type-20>=0){
                            data.type = data.type-20;

                            Message.toast(Language.avatar_modify_fail);
                        }

                        if(data.type-10>=0){
                            data.type = data.type-10;
                            devicesData[BabyInfo.index]["IF"]["URL"] =  data.u+data.av;
                            Editor.refreshView();
                            Message.toast(Language.avatar_modify_success);
                        }
                    }

                    if(old_name == name && old_height == height && old_weight == weight && old_sex == sex){
                        Editor.obj.find(".kill").trigger("click");
                        return false;
                    }

                    if(data.type == 0){
                        if(old_height == height && old_weight == weight && old_sex == sex){
                            Message.toast(Language.modify_name_error);
                        }else if(old_name == name){
                            Message.toast(Language.height_weight_sex_modify_error);
                        }
                        Editor.obj.find(".kill").trigger("click");
                    }else if(data.type == 1){
                        if(old_height == height && old_weight == weight && old_sex == sex){
                            Message.toast(Language.modify_name_success);
                        }else{
                            Message.toast(Language.modify_name_success_modify_height_weight_sex_error);
                        }
                        Editor.obj.find(".kill").trigger("click");
                        devicesData[BabyInfo.index]["N"] = name;
                        Editor.refreshView();
                    }else if(data.type == 2){
                        if(old_name == name){
                            Message.toast(Language.height_weight_sex_modify_success);
                            devicesData[BabyInfo.index]["N"] = name;
                        }else{
                            Message.toast(Language.modify_name_error_modify_height_weight_sex_success);
                        }
                        Editor.obj.find(".kill").trigger("click");
                        devicesData[BabyInfo.index]["IF"]["SS"] = sex;
                        devicesData[BabyInfo.index]["IF"]["SH"] = height;
                        devicesData[BabyInfo.index]["IF"]["SW"] = weight;
                        Editor.refreshView();
                    }else if(data.type == 3){
                        Message.toast(Language.modify_success+"!");
                        Editor.obj.find(".kill").trigger("click");
                        devicesData[BabyInfo.index]["N"] = name;
                        devicesData[BabyInfo.index]["IF"]["SS"] = sex;
                        devicesData[BabyInfo.index]["IF"]["SH"] = height;
                        devicesData[BabyInfo.index]["IF"]["SW"] = weight;
                        Editor.refreshView();
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if(old_height == height && old_weight == weight && old_sex == sex){
                    Message.toast(Language.modify_name_error);
                }else if(old_name == name){
                    Message.toast(Language.height_weight_sex_modify_error);
                }
                Editor.obj.find(".kill").trigger("click");
            },
            complete:function(){
                $("#imgUpload").attr("title","");
            }
        });
    },
    alertTip:function(){

        var UA = navigator.userAgent.toLowerCase();
        var name = "unkonw";
        try {
            name=!-[1,]?'ie':
                (UA.indexOf("firefox")>0)?'firefox':
                    (UA.indexOf("chrome")>0)?'chrome':
                        window.opera?'opera':
                            window.openDatabase?'safari':
                                'unkonw';
        }catch(e){};

        if(name == 'unkonw'){
            Message.toast("该浏览器模式可能不支持图片压缩功能，请尝试切换浏览器模式！");
        }

        this.obj.find('#imgUpload').trigger('click');
    },
    refreshView:function(){
        this.avatar_obj.attr("src",devicesData[BabyInfo.index]["IF"]["URL"]);
        this.name_obj.text(devicesData[BabyInfo.index]["N"]);
        this.sex_obj.text(BabyInfo.sexArr[devicesData[BabyInfo.index]["IF"]["SS"]]);
        this.height_obj.text(devicesData[BabyInfo.index]["IF"]["SH"]);
        this.weight_obj.text(devicesData[BabyInfo.index]["IF"]["SW"]);
    }
};