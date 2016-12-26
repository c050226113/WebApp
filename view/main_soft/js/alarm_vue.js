var alarm_vue = new Vue({
    el: '#alarm_vue',
    created: function () {
        this.launcher_vue = launcher_vue;
    },
    compiled: function () {
        this.initData();
        launcher_vue.makeSureHeight(this.$el);
    },
    data: {
        dayago:3,
        lastTime:'',
        events_:{},
        sendValue:'',
        roleArr:[
            {name:'爸爸'},
            {name:'妈妈'},
            {name:'爷爷'},
            {name:'奶奶'},
            {name:'外公'},
            {name:'外婆'},
            {name:'叔叔'},
            {name:'阿姨'},
            {name:'哥哥'},
            {name:'姐姐'}
        ]
    },
    computed: {
        events:{
            get:function(){
                return this.events_[launcher_vue.using];
            },
            set:function(val){
                this.events_[launcher_vue.using] = val;
                this.events_ = JSON.parse(JSON.stringify(this.events_));
                var dayGroup = {};
                for(var i=0;i<this.events_[launcher_vue.using].length;i++){
                    var item = this.events_[launcher_vue.using][i];
                    var date = item.date;
                    if(!dayGroup[date]){
                        dayGroup[date] = date;
                    }
                }
                this.addDate(dayGroup);
            }
        },
        name:{
            get:function(){
                return launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_NAME];
            }
        },
        babyHeadImg:{
            get:function(){
                if(launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_AVT].length>11){
                    return launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_AVT];
                }else{
                    return '';
                }
            }
        },
        userHeadImg:{
            get:function(){
                if(launcher_vue.useravt.length>11){
                    return launcher_vue.useravt;
                }else{
                    return '';
                }
            }
        }
    },
    methods: {
        init:function(){
            this.initData();
        },
        initView:function(){
            $(this.$el).find(".span_time").remove();
        },
        initData:function(){
            var self = this;
            try{
                if(this.events_[launcher_vue.using]){
                    if(!$(this.$el).find(".span_time").length){
                        self.events = self.events;
                    }
                }else{
                    throw new SQLException;
                }
            }catch (err){
                var lastDay = 3;
                var dataStr = '{' +
                    '"'+KEY+'":"'+ lastDay +'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_events', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        self.events_[launcher_vue.using] = [];
                        if (data[CODE] != 0) {
                            return false;
                        } else {
                            self.events_[launcher_vue.using] = Helper.getJsonObj(data[MESSAGE]);
                            self.drawEvents(self.events_[launcher_vue.using]);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                        index_vue.logout();
                    }
                });
            }
        },
        drawEvents:function(arr){
            var events = [];
            for(var i=0;i<arr.length;i++){
                var eventObj = arr[i];
                var time = eventObj[DEVICE_EVENT_INTTIME]*1000;
                var dateObj = new Date(time);
                var content = '';
                switch (eventObj[DEVICE_EVENT_TYPE]){
                    case DEVICE_EVENT_TYPE_SOS:
                        switch(eventObj[DEVICE_EVENT_MESSAGE]){
                            case DEVICE_EVENT_TYPE_SOS_BTN:
                                content = '按键报警';
                                break;
                            case DEVICE_EVENT_TYPE_SOS_FALL:
                                content = '跌落报警';
                                break;
                            case DEVICE_EVENT_TYPE_SOS_HEART_RATE:
                                content = '心率报警';
                                break;
                            case DEVICE_EVENT_TYPE_SOS_SIGN:
                                content = '签到';
                                break;
                        }
                        break;
                    case DEVICE_EVENT_TYPE_MESSAGE:
                        content = eventObj[DEVICE_EVENT_MESSAGE];
                        break;
                }
                var event = {
                    date:'i'+dateObj.getFullYear()+(dateObj.getMonth()+1)+dateObj.getDate(),
                    time:dateObj.getHours().addZ() + ':' + dateObj.getMinutes().addZ(),
                    isrecieve:eventObj[DEVICE_EVENT_ISRECIEVE],
                    message:content,
                    type:eventObj[DEVICE_EVENT_TYPE]
                };
                events.push(event);
            }
            this.events = events;
        },
        scrollToBottom:function(){
            var $obj = $(this.$el);
            setTimeout(function(){
                $obj.find('.main').scrollTop(10000);//滚动到底部
            },50);
        },
        addDate:function(dayGroup){
            var $obj = $(this.$el);
            var self = this;
            setTimeout(function(){
                var dateObj = new Date();
                var today = dateObj.getFullYear()+''+(dateObj.getMonth()+1)+''+dateObj.getDate()+'';
                $obj.find('.main .head').each(function(index,obj){
                    var key = $(this).attr('title');
                    if(dayGroup[key]){
                        var content;
                        if(key == 'i'+today){
                            content = '今天';
                        }else{
                            content = key.substr(5,2)+'月'+key.substr(7,2)+'日';
                        }

                        $('.date'+key).remove();
                        $(obj).parent().before('<div class="txtc"><span class="span_time date'+key+'">'+content+'</span></div>');
                        dayGroup[key] = '';
                    }
                });
                self.scrollToBottom();
            },1);
        },
        send:function(){
            var self = this;
            if(!this.sendValue){
                Message.toast('发送内容不能为空!',2);
                return false;
            }

            var isrecieve = 0;//发送
            var dataStr = '{' +
                '"'+MESSAGE+'":"'+ this.sendValue +'",' +
                '"'+TYPE+'":"'+ DEVICE_EVENT_TYPE_MESSAGE +'",' +
                '"'+FACE+'":"'+ isrecieve +'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/add_event', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] == 1) {

                        Message.toast(data[MESSAGE], 2);
                        return false;

                    } else {
                        var status = 0;
                        if(data[CODE] == 101){
                            Message.toast('设备不在线', 2);
                        }else{
                            status = 1;
                        }

                        //更新ui
                        if(data[MESSAGE]){
                            var time = parseInt(data[MESSAGE])*1000;
                            var dateObj = new Date(time);
                            var event = {
                                status:status,
                                date:'i'+dateObj.getFullYear()+(dateObj.getMonth()+1)+dateObj.getDate(),
                                time:dateObj.getHours() + ':' + dateObj.getMinutes(),
                                        //+ ":" + dateObj.getSeconds(),
                                isrecieve:isrecieve, type:DEVICE_EVENT_TYPE_MESSAGE, message:self.sendValue
                            };
                            var eventArr = self.events;
                            eventArr.push(event);
                            self.events = eventArr;
                            self.sendValue = '';
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    index_vue.logout();
                }
            });
        },
        notice:function(){
            Message.toast('当前设备不在线，当设备上线时会自动推送至设备上',3);
        }
    }
});