var login_vue = new Vue({
    el: '#login_vue',
    compiled:function () {},
    data:{
        username:'',
        password:'',
        oneCode:''
    },
    methods: {
        login:function(){
            if( Cookie.getCookie('hash') == 'index'){
                location.hash = 'index';
                return false;
            }
            var self = this;
            var dataStr = '{' +
                '"'+NAME+'":"'+ this.username +'",' +
                '"'+PASSWORD+'":"'+ this.password +'",' +
                '"'+CODE+'":"'+ this.oneCode +'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=payqi/login', data: Helper.getJsonObj(dataStr), dataType: 'text',
                success: function (data) {
                    data = JSON.parse(data);
                    if (data[CODE] == 0) {
                        //进行操作页面
                        Cookie.setCookie('hash','index',18000*1000);
                        location.hash = 'index';
                    } else {
                        if(!data[MESSAGE]){
                            Message.toast(data.msg,2);
                        }else{
                            Message.toast(data[MESSAGE],2);
                        }
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }
    }
});