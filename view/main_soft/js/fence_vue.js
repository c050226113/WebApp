var fence_vue = new Vue({
    el: '#fence_vue',
    created: function () {
    },
    compiled: function () {
        this.initView();
        launcher_vue.makeSureHeight(this.$el);
    },
    data: {
        name:FENCE_NAME,
        radius:FENCE_RADIUS,
        isdanger:FENCE_ISDANGER,
        status:FENCE_STATUS
    },
    computed: {
        info:{
            get:function(){
                return launcher_vue.devices[launcher_vue.using][DEVICE_FENCE][locationP_vue.fenceKey];
            }
        }
    },
    methods: {
        init:function(){
            this.initView();
        },
        initView:function(){
            var $el = $(this.$el);
            $el.find('td:eq(1)').text('区域'+(parseInt(locationP_vue.fenceKey.substr(locationP_vue.fenceKey.length-1,locationP_vue.fenceKey.length))+1));
        },
        fence_toggel:function(){
            var input = $("#fence_switch");
            var bool = input.prop("checked");
            bool = bool? 0:1;

            var index = parseInt(locationP_vue.fenceKey.substr(locationP_vue.fenceKey.length-1,locationP_vue.fenceKey.length));

            var dataStr = '{' +
                '"'+INDEX+'":"'+ index +'",' +
                '"'+TYPE+'":"'+ bool +'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/fence_toggle', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                        return false;
                    }else{
                        launcher_vue.devices[launcher_vue.using][DEVICE_FENCE]['i-'+index][FENCE_STATUS] = bool;
                        Message.toast('修改成功', 1);
                        if(bool){
                            input.parent().addClass('open');
                        }else{
                            input.parent().removeClass('open');
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                    index_vue.logout();
                },
                complete: function () {}
            });

            this.info[FENCE_STATUS] = bool;
        },
        save:function(){
            locationP_vue.fence_save();
        }
    }
});