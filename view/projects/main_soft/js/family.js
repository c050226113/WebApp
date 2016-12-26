var family = new Vue({
    el: '#family',
    created: function () {},
    compiled: function () {
        this.initView();
        launcher.makeSureHeight(this.$el);
    },
    data: {
        nameArr : [
            {name:'爸爸',tel:''},
            {name:'妈妈',tel:''},
            {name:'爷爷',tel:''},
            {name:'奶奶',tel:''},
            {name:'外公',tel:''},
            {name:'外婆',tel:''},
            {name:'叔叔',tel:''},
            {name:'阿姨',tel:''},
            {name:'哥哥',tel:''},
            {name:'姐姐',tel:''},
            {name:'弟弟',tel:''},
            {name:'妹妹',tel:''}
        ]
    },
    computed: {
        family:{
            get:function(){
                return launcher.devices[launcher.using][DEVICE_FAMILY];
            }
        }
    },
    methods: {
        init:function(){},
        initView:function(){
            var dataStr = '{' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: API_URL+'?r=main_soft/get_family', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                        return false;
                    }else{
                        launcher.devices_[launcher.using][DEVICE_FAMILY] = Helper.getJsonObj(data[MESSAGE]);
                        launcher.devices_ = JSON.parse(JSON.stringify(launcher.devices_));
                        family.initData();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                    index.logout();
                }
            });
        },
        initData:function(){
            for(var index in this.nameArr){
                if(this.family[index][FAMILY_NAME]){
                    this.nameArr[index]['name'] = this.family[index][FAMILY_NAME];
                }

                if(this.family[index][FAMILY_PHONE]){
                    this.nameArr[index]['tel'] = this.family[index][FAMILY_PHONE];
                }
            }
        },
        setFamily:function(){
            var msg = '';
            var hasError = false;
            $("#family_info p").each(function(index,obj){
                var spans = $(this).find("span");
                var name = spans.eq(0).text();
                var tel = spans.eq(1).text();
                if(!name){
                    Message.toast(family.nameArr[index]['name']+'的名字不能为空',2);
                    hasError = true;
                    return false;
                }
                if(tel){
                    if(!Helper.isMobileNumber(tel)){
                        Message.toast(family.nameArr[index]['name']+'的电话号码格式错误',2);
                        hasError = true;
                        return false;
                    }
                }

                msg += name+',';
                msg += tel+'|';
            });
            if(hasError){
                return false;
            }
            msg = msg.substr(0,msg.length-1);

            var dataStr = '{' +
                '"'+MESSAGE+'":"'+msg+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: API_URL+'?r=main_soft/set_family', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                        return false;
                    }else{
                        Message.toast("修改成功", 2);
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                    index.logout();
                }
            });
        }
    }
});