var index_vue = new Vue({
    el: '#index_vue',
    compiled:function () {},
    data:{
        imei:''
    },
    methods: {
        reset:function(){
            var adminTel;
            try{
                var tdObj = $('td');
                var roleNum = parseInt(tdObj.eq(18).text().substr(3,1));
                adminTel = tdObj.eq(roleNum+7).text();
            }catch (e){
                adminTel = '';
            }
            if(!adminTel){
                return false;
            }

            var dataStr = '{' +
                '"'+ACCOUNT+'":"'+ adminTel.trim() +'",' +
                '"'+TYPE+'":"'+ roleNum +'",' +
                '"'+CODE+'":"'+ this.imei +'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=payqi_setting/reset', data: Helper.getJsonObj(dataStr), dataType: 'text',
                success: function (data) {
                    console.log(data);
                    data = JSON.parse(data);
                    if(data[CODE] == 110){
                        Message.toast("请先登录",2);
                        setTimeout(function(){
                            Cookie.removeCookie('hash');
                            location.hash = 'login';
                        },2000);
                    }
                    if (data[CODE] == 0) {
                        //进行操作页面
                        Message.toast('解除成功',2);
                        return false;
                    } else {
                        Message.toast(data[MESSAGE],2);
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    Cookie.removeCookie('hash');
                    location.hash = 'login';
                }
            });
        },
        getInfo:function(){
            var dataStr = '{' +
                '"'+CODE+'":"'+ this.imei +'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=payqi_setting/search', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if(data[CODE] == 110){
                        Message.toast("请先登录",2);
                        setTimeout(function(){
                            Cookie.removeCookie('hash');
                            location.hash = 'login';
                        },2000);
                    }
                    if (data[CODE] == 0) {
                        //进行操作页面
                        var formObj = $('form');
                        while(formObj.next().attr('class')){
                            formObj.next().remove();
                        }
                        formObj.after(data[MESSAGE]);
                    } else {
                        Message.toast(data[MESSAGE],2);
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    Cookie.removeCookie('hash');
                    location.hash = 'login';
                }
            });
        }
    }
});