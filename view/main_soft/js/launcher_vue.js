var launcher_vue = new Vue({
    el: '#launcher_vue',
    created: function () {},
    compiled: function () {
        this.init();
    },
    data:{
        devices_:{},
        using_:'',
        username:'',
        useravt:'',
        userPosition:[],
        positionSupport:true,
        browser:{}
    },
    computed: {
        devices:{
            get:function(){
                return this.devices_;
            },
            set:function(jsonObj){
                this.devices_ = JSON.parse(JSON.stringify(jsonObj));
            }
        },
        using:{
            get:function(){
                return this.using_;
            },
            set:function(val) {
                this.using_ = val;
                try {
                    alarm_vue.initView();
                } catch (e) {}
                try {
                    index.initPlaceInfo();
                } catch (e) {}
                try {
                    sports.refreshFlag = true;
                } catch (e) {}
            }
        }
    },
    methods: {
        makeSureHeight:function(el){
            var $obj = $(el);
            if($obj.hasClass('mh')){
                $obj.css('height',$obj.height()+"px");
            }
            $obj.find(".mh").each(function(){
                $(this).css('height',$(this).height()+"px");
            });
        },
        choose:function(key){
            var dataStr = '{' +
                '"'+CODE+'":"'+key+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/change_using', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                    }else{
                        launcher_vue.using = key;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);},
                complete: function () {}
            });
        },
        login:function(){
            var dataStr = '{' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_info', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] == 0) {
                        if(data[USER_USING]){
                            launcher_vue.devices_ = JSON.parse(data[USER_DEVICES]);
                            launcher_vue.using = data[USER_USING];
                            launcher_vue.username = data[USER_NAME];
                            launcher_vue.useravt = data[USER_AVT];
                        }else{
                            launcher_vue.devices_ = '';
                            launcher_vue.using = '';
                            launcher_vue.username = '';
                            launcher_vue.useravt = '';
                        }

                        localStorage.setItem('using',data[USER_USING]);
                        localStorage.setItem('devices',data[USER_DEVICES]);
                        localStorage.setItem('username',data[USER_NAME]);
                        localStorage.setItem('useravt',data[USER_AVT]);
                        //重制信息进行登陆
                        //launcher_vue.refreshDevice();
                        if(Helper.hasObjKey(launcher_vue.devices_)){
                            console.log('hash change index');
                            location.hash = 'index';
                        }else{
                            console.log('hash change choose');
                            location.hash = 'choose';
                        }
                    } else {
                        console.log('hash change login');
                        location.hash = 'login';
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    localStorage.setItem('using','');
                    console.log(errorThrown);
                    //location.reload();
                }
            });
        },
        init:function(){
            var using;
            try{
                using = localStorage.getItem('using')||'';
            }catch (err){
                using = '';
            }
            console.log('data using :' + using);
            app.isDoingAnimation = false;
            if(using && using.length > 2){
                console.log('login index');
                this.login();
            }else{
                console.log('login login');
                location.hash = 'login';
            }
        }
    }
});