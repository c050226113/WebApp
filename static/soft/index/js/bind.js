var Bind = {
    view: {},
    init: function () {
        this.initData();
        this.initView();
        this.initBind();
    },
    initData:function(){},
    initView:function(){
        this.view.btn = $("#bindBtn");
    },
    initBind: function () {
        this.view.btn.on("click", function () {
            Bind.doAction();
        });
    },
    doAction: function () {
        if (action == "register") {
            //get
            var phone = $("#phone").val();
                if (!phone) {
                Message.toast("手机号不能为空", 1.5);
                return false;
            }

            var password = $("#password").val();
            if (!password) {
                Message.toast("管理员密码不能为空", 1.5);
                return false;
            }

            var password2 = $("#password2").val();
            var res = Helper.checkTwoPassword(password, password2);
            if (res !== true) {
                Message.toast(res, 2);
                return false;
            }

            //post
            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/Doregister',
                data: {
                    phone: phone,
                    password: password
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code != 0) {
                        Message.toast(data.msg, 2);
                    } else {
                        window.location.href = baseUrl + '/index.php?r=index/bind';
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {},
                complete: function () {}
            });

        } else if (action == "bind") {
            var bindCode = $("#bindCode").val();
            if (!bindCode) {
                Message.toast("绑定码不能为空", 1.5);
                return false;
            }

            var nickname = $("#nickname").val();
            if (!nickname) {
                nickname = $("option").eq(role - 1).text();
            }

            var role = $("#role").val();

            var watchPhone = $("#watchphone").val();
            if (!watchPhone) {
                Message.toast("手表号码不能为空", 1.5);
                return false;
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/Getbindcode',
                data: {
                    bindCode: bindCode,
                    watchPhone: watchPhone,
                    nickname: nickname,
                    role: role
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code != 0) {
                        Message.toast(data.msg, 2);
                    } else {
                        window.location.href = baseUrl + '/index.php?r=soft/index';
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {},
                complete: function () {}
            });
        } else if (action == "login") {
            var phone = $("#phone").val();
            if (!phone) {
                Message.toast("手机号不能为空", 1.5);
                return false;
            }

            var password = $("#password").val();
            if (!password) {
                Message.toast("管理员密码不能为空", 1.5);
                return false;
            }

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=setting/Dologin',
                data: {
                    phone: phone,
                    password: password
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code != 0) {
                        Message.toast(data.msg, 2);
                    } else {
                        window.location.href = baseUrl + '/index.php?r=soft/index';
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {},
                complete: function () {}
            });
        }
    }
};