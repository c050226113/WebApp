var register_vue = function(){
    register_vue =   new Vue({
        el: '#register_vue',
        created: function () {},
        compiled: function () {},
        data:
        {
            input: {
                account: {text:"",hint:"请输入您的账号"},
                password: {text:"",hint:"请输入您的密码"},
                password2: {text:"",hint:"请重复您的密码"}
            }
        },
        computed: {
        },
        methods: {
            init:function(){},
            register: function(){
                var account,password,password2;
                account = this.input.account.text.trim();
                password = this.input.password.text.trim();
                password2 = this.input.password2.text.trim();

                var res = Helper.checkTwoPassword(password,password2);
                if(res !== true){
                    Message.toast(res,2);
                    return false;
                }else{
                    var dataStr = '{' +
                        '"'+ACCOUNT+'":"'+account+'",' +
                        '"'+PASSWORD+'":"'+hex_md5(password)+'",' +
                        '"sessionId":"'+app.sessionId+'"' +
                        '}';
                    $.ajax({
                        type: 'post',
                        url: app.API_URL+'?r=main_soft/register',
                        data: Helper.getJsonObj(dataStr),
                        dataType: 'json',
                        success: function (data) {
                            if (data[CODE] != 0) {
                                Message.toast(data[MESSAGE], 2);
                                return false;
                            } else {
                                Message.toast("注册成功",2);
                                setTimeout(function(){
                                    history.go(-1);
                                },1000);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {},
                        complete: function () {}
                    });
                }
            }
        }
    });
};