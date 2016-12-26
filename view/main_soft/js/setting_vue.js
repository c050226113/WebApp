var setting_vue = new Vue({
    el: '#setting_vue',
    created: function () {},
    compiled: function () {
        this.initView();
        this.initBind();
    },
    data: {
        lines:[
            {
                text:"上课隐身",
                pull:"class_hide",
                img:"class_hide.svg"
            },
            {
                text:"定时开关机",
                pull:"interval_shutdown",
                img:"interval_close.svg"
            },
            {
                text:"系统设置",
                pull:"sys_setting",
                img:"setting.svg"
            },
            {
                text:"远程遥控",
                pull:"far_control",
                img:"control.svg"
            },
            {
                text:"解除绑定",
                pull:"unbind_setting",
                img:"cut_bind.svg"
            },
            {
                text:"一键还原",
                pull:"back_up",
                img:"backup.svg"
            }
        ]
    },
    computed: {},
    methods: {
        init:function(){},
        initView:function(){
            var dataStr = '{' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_setting', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                        return false;
                    }else{
                        launcher_vue.devices_[launcher_vue.using][DEVICE_SETTING] = Helper.getJsonObj(data[DEVICE_SETTING]);
                        launcher_vue.devices_ = JSON.parse(JSON.stringify(launcher_vue.devices_));
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    index_vue.logout();
                }
            });
        },
        initBind:function(){
            //$("#setting h3").unbind().bind('touchstart',function(){
            //    $(this).css('background-color','#ddd');
            //}).bind('touchend',function(){
            //    $(this).css('background-color','#fff');
            //});
        }
    }
});