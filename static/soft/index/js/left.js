var PeiQiSoftLeft = {
    addBaby : $(".addBaby"),
    init : function(){
        PeiQiSoftLeft.addBaby.find("img").bind("click",function(){
            $(this).parents(".addBaby").find(".addBabyFont").trigger("click");
        });
    },
    changeDefaultImei : function(imei){
        $.ajax({
            type: 'post',
            url: $("#changeDefaultImei").text(),
            data : {
                imei : imei
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    var obj = $(".addBabyFont[title='"+imei+"']");

                    //更改名字
                    $("#deviceName").text(obj.text());
                    $("#left #baby").parents(".head").find("span").text(obj.text());
                    //todo 头像更换


                    //更改保存信息
                    P_index.ajaxGet = [];
                    P_index.ajaxGet["mid_avatar"] = true;
                    User.adminChange = true;
                    User.isAdmin = parseInt(data.a);

                    $("#left .addBaby").show();
                    obj.parents(".addBaby").hide();

                    P_index.right.html("");
                } else {
                    Message.toast("数据获取出错，切换宝贝失败！",1.5);
                    return false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {}
        });
    }
};
PeiQiSoftLeft.init();