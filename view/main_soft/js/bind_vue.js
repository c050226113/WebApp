var bind_vue = new Vue({
    el: '#bind_vue',
    created: function () {},
    compiled: function () {
        launcher_vue.makeSureHeight(this.$el);
    },
    data:
    {
        input: {
            code: {text:"",hint:"请输入15位手表序列号"},
            num: {text:"",hint:"请输入4位S/N号码"},
            name: {text:"",hint:"请输入孩子的姓名"},
            school: {text:"",hint:"请输入学校的名称"}
        }
    },
    computed: {},
    methods: {
        init:function(){},
        success:function(){
            var dataStr = '{' +
                '"'+CODE+'":"'+this.input.code.text.trim()+'",' +
                '"'+NUM+'":"'+this.input.num.text.trim()+'",' +
                '"'+NAME+'":"'+this.input.name.text.trim()+'",' +
                '"'+SCHOOL+'":"'+this.input.school.text.trim()+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/bind', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                    } else {
                        launcher_vue.using = data[USER_USING];

                        if(Helper.hasObjKey(launcher_vue.devices_)){
                            launcher_vue.devices_[launcher_vue.using] = {};
                        }else{
                            launcher_vue.devices_ = {};
                            launcher_vue.devices_[launcher_vue.using] = {};
                        }

                        console.log(data[DEVICE_INFO]);
                        launcher_vue.devices_[launcher_vue.using][DEVICE_INFO] = Helper.getJsonObj(data[DEVICE_INFO]);
                        launcher_vue.devices_ = JSON.parse(JSON.stringify(launcher_vue.devices_));

                        Message.toast("绑定成功", 2);
                        setTimeout(function(){
                            window.history.go(-1);
                        },2000);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {}
            });
        }
    }
});