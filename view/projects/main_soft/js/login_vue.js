var login_vue = new Vue({
    el: '#login_vue',
    created: function () {},
    compiled: function () {},
    data:
    {
        input: {
            account: {text:"",hint:"请输入您的账号"},
            password: {text:"",hint:"请输入您的密码"}
        }
    },
    computed: {},
    methods: {
        init:function(){},
        login: function(){
            var self = this;
            Message.showWait('登录中');
            setTimeout(function(){
                var dataStr = '{' +
                    '"'+ACCOUNT+'":"'+self.input.account.text.trim()+'",' +
                    '"'+PASSWORD+'":"'+hex_md5(self.input.password.text.trim())+'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/login', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.removeWait();
                            Message.toast(data[MESSAGE], 2);
                        } else {
                            if(data[USER_USING]){
                                launcher_vue.devices_ = JSON.parse(data[USER_DEVICES]);
                                launcher_vue.using = data[USER_USING];
                                launcher_vue.username = data[USER_NAME];
                                launcher_vue.useravt = data[USER_AVT];
                            }else{
                                launcher_vue.devices_ = {};
                                launcher_vue.using = '';
                                launcher_vue.username = '';
                                launcher_vue.useravt = '';
                            }

                            localStorage.setItem('using',data[USER_USING]);
                            localStorage.setItem('devices',data[USER_DEVICES]);
                            localStorage.setItem('username',data[USER_NAME]);
                            localStorage.setItem('useravt',data[USER_AVT]);

                            if(Helper.hasObjKey(launcher_vue.devices_)){
                                location.hash = 'index';
                            }else{
                                location.hash = 'choose';
                            }
                            setTimeout(function(){
                                Message.removeWait();
                            },200);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if(jqXHR.responseText.length == 32){
                            app.sessionId = jqXHR.responseText;
                            app.publish(APP_EVENT_CHANGE_SESSION);
                            self.login();
                        }
                        //if(data)
                        //Message.removeWait();
                        //app.publish(APP_EVENT_LOGOUT);
                        //window.location.reload();
                    }
                });
            },500);
        },
        forgetPassword:function(){
            console.log("forget");
        }
    }
});