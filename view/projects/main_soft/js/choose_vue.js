var choose_vue = new Vue({
    el: '#choose_vue',
    created: function () {
        this.launcher_vue = launcher_vue;
    },
    compiled: function () {},
    data:{
        DEVICE_INFO:DEVICE_INFO,
        DEVICE_NAME:DEVICE_NAME,
        DEVICE_IMEI:DEVICE_IMEI,
        DEVICE_SCHOOL:DEVICE_SCHOOL,
        DEVICE_AVT:DEVICE_AVT
    },
    computed: {},
    methods: {
        init:{},
        delDevice:function(){
            Message.dialog("提示","取消绑定会清除设备的所有信息，确定清楚该设备吗","确定","取消",function(){
                var dataStr = '{' +
                    '"'+CODE+'":"'+launcher_vue.using+'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/del_device', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false;
                        }else{
                            Message.toast("取消绑定成功", 2);
                            Vue.delete(launcher_vue.devices_, launcher_vue.using);
                            for(var using in launcher_vue.devices_){
                                launcher_vue.using = using;
                                break;
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {}
                });
                Message.removeDialog();
            },function(){
                Message.removeDialog();
            });
        }
    }
});