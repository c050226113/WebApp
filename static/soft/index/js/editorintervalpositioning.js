Editor = null;
Editor = {
    arr:[30,60,180,300,600,900,1800,3600],
    index:3,
    page:$(".page"),
    obj:null,
    init:function(text,index){
        this.obj = $("#"+text);

        this.obj.find("#myModalLabel").html("<b>"+Language.location_time_interval+"</b>");

        var lis = Setting.setting_li;
        var time = parseInt(lis.find(".interval_position").attr("title"));

        index = this.arr.indexOf(time);
        if(index>=0){
            this.index = index;
        }

        this.obj.find("input").eq(this.index).trigger("click");

        $("#mo").attr("data-target","#"+text).trigger("click");
    },
    editorSubmit:function(){
        if(!BabyInfo.isAdmin()){
            Message.toast(Language.you_are_not_an_admin_can_not_be_modified);
            return false;
        }

        var intervalposition;
        intervalposition = this.obj.find('input:radio[name="intervalposition"]:checked').val();

        if(this.index == intervalposition){
            return false;
        }

        var time = this.arr[intervalposition];

        $.ajax({
            type: 'post',
            url: indexUrl+'?r=setting/intervalposition',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"],
                time: time
            },
            dataType: 'json',
            success: function (data) {
                if(data.code == 0){
                    Message.toast(Language.modify_success+"!");
                    var lis = Setting.setting_li;
                    lis.find(".interval_position").attr("title",Editor.arr[intervalposition]);
                    if(Editor.arr[intervalposition]>50){
                        lis.find(".interval_position").text(Editor.arr[intervalposition]/60+Language.minute);
                    }else{
                        lis.find(".interval_position").text(Editor.arr[intervalposition]+Language.second);
                    }
                    Editor.obj.find(".kill").trigger("click");
                }else{
                  P_index.checkTokenError(data.msg);
                    //Message.toast(Language.data_error_modification_failed+"!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Message.toast(Language.data_error_modification_failed+"!");
            }
        });
    }

};