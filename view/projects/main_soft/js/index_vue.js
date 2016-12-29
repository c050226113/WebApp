Vue.component('child',{
    template:'#child-template',
    created: function () {
        this.launcher_vue = launcher_vue;
    },
    compiled: function () {
    },
    data:function(){
        return {
            mapType:'location',
            maker:null,
            circle:null,
            map:null,
            mapJq:null,
            fence:{},
            key0:'i-0',
            key1:'i-1',
            key2:'i-2',
            key3:'i-3',
            key4:'i-4',
            fk:'',
            fence_clickListener:null,
            locationP_fence_toolBar:[
                {eq:0,img:'fence_back.svg',text:'返回'},
                {eq:1,img:'fence_area.svg',text:'区域1'},
                {eq:2,img:'fence_area.svg',text:'区域2'},
                {eq:3,img:'fence_area.svg',text:'区域3'},
                {eq:4,img:'fence_area.svg',text:'区域4'},
                {eq:5,img:'fence_area.svg',text:'区域5'}
            ],
            waypoints:{},
            locationP_waypoint_toolBar:[
                {eq:0,img:'fence_back.svg',text:'返回'}
                //,
                //{eq:1,img:'fence.svg',text:'电子围栏'}
            ],
            isOptsShow:false
        };
    },
    computed: {
        fenceKey:{
            set:function(val){
                this.fk = val;
                //设置ui
                var lis = $('#locationP_fence_toolBar li');
                lis.find('img.cover').css('border','1px solid deepskyblue');
                lis.find('img.cover').eq(parseInt(Helper.getLastChar(val))+1).css('border','1px solid red');
                //设置地图
                var fenceObj = launcher_vue.devices[launcher_vue.using][DEVICE_FENCE];
                this.fence_position = [fenceObj[val][FENCE_LON],fenceObj[val][FENCE_LAT],fenceObj[val][FENCE_RADIUS]];
            },
            get:function(){
                return this.fk;
            }
        },
        position:{
            get:function(){
                return [launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LON],launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LAT]];
            },
            set:function(position){
                this.map.clearOverlays();//清除地图
                console.log(position);
                if(position[0] && position[1]){
                    launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LON] = position[0];
                    launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LAT] = position[1];
                    //设置中心
                    var point = new BMap.Point(position[0], position[1]);
                    this.map.centerAndZoom(point, 15);
                    //设置marker
                    var marker = new BMap.Marker(point);
                    this.map.addOverlay(marker);
                    //设置circle
                    var radius;
                    if(isNaN(parseInt(launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_RADIUS]))){
                        radius = 500;
                    }else{
                        radius = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_RADIUS];
                    }
                    var circle = new BMap.Circle(point,radius,{strokeColor:"blue", strokeWeight:1, strokeOpacity:0.5});
                    this.map.addOverlay(circle);

                    index_vue.initPlaceInfo();
                }
            }
        },
        fence_position:{
            set:function(arr){
                var position = [arr[0],arr[1]];
                var radius = arr[2];
                this.map.clearOverlays();//清除地图
                if(position[0] && position[1]){
                    //设置中心
                    var point = new BMap.Point(position[0], position[1]);
                    this.map.centerAndZoom(point, 15);
                    //设置marker
                    var marker = new BMap.Marker(point);
                    this.map.addOverlay(marker);
                    //设置circle
                    var circle = new BMap.Circle(point,radius,{strokeColor:"blue", strokeWeight:1, strokeOpacity:0.5});
                    this.map.addOverlay(circle);
                }
            }
        },
        locationShow:{
            set:function(val){
                if(this.isOptsShow){
                    this.showOpts();
                }
                var self = this;
                if(val){
                    this.mapType = 'location';
                    var $el = $(index_vue.$el);
                    $el.find('td:eq(1)').text('关爱未来');
                    $el.find('td:eq(2)').text('刷新');
                    this.right_btn = function(){
                        this.refresh();
                    };
                    $("#location_mapOpt").css('transform','translateY(0px)');
                    setTimeout(function(){
                        self.refresh();
                    },500);
                }else{
                    this.map.clearOverlays();//清除地图
                    $("#location_mapOpt").css('transform','translateY(100%)');
                }
            }
        },
        fenceShow:{
            set:function(val){
                if(this.isOptsShow){
                    this.showOpts();
                }
                var self = this;
                console.log(val);
                if(val){
                    this.mapType = 'fence';
                    var $el = $(index_vue.$el);
                    $el.find('td:eq(1)').text('围栏');
                    $el.find('td:eq(2)').text('设置');
                    this.right_btn = function(){
                        location.hash = 'fence';
                    };

                    $("#locationP_fence_toolBar").css('transform','translateY(0px)');
                    console.log('fence area one will be clicked');
                    setTimeout(function(){
                        console.log('fence area one will be clicking');
                        $("#locationP_fence_toolBar li").eq(1).trigger('click');
                    },500);
                    this.map.clearOverlays();//清除地图

                    this.fence_clickListener = function (e) {
                        var lon,lat;
                        lon = e.point.lng;
                        lat = e.point.lat;

                        var message = "你想要设置"+lon+','+lat+"为范围中心吗?";
                        Message.dialog('提示', message, '确定', '取消',function(){
                            Message.removeDialog();
                            var fenceObj = launcher_vue.devices[launcher_vue.using][DEVICE_FENCE];
                            fenceObj[self.fenceKey][FENCE_LON] = lon;
                            fenceObj[self.fenceKey][FENCE_LAT] = lat;
                            fenceObj[self.fenceKey][FENCE_RADIUS] = 300;

                            self.fence_save();
                        },function(){
                            Message.removeDialog();
                        });
                    };

                    this.map.addEventListener("click", this.fence_clickListener, false);
                }else{
                    this.map.clearOverlays();//清除地图
                    $("#locationP_fence_toolBar").css('transform','translateY(100%)');
                    this.map.removeEventListener("click", this.fence_clickListener, false);
                }
            }
        },
        wayPointShow:{
            set:function(val){
                var date_picker = $("#date_picker");
                if(val){
                    this.mapType = 'waypoint';
                    var $el = $(index_vue.$el);
                    $el.find('td:eq(1)').text('历史轨迹');
                    $el.find('td:eq(2)').text('日期选择');
                    this.right_btn = function(){
                        if(date_picker.css('display') == 'none'){
                            date_picker.css('display','block');
                            setTimeout(function(){
                                date_picker.css('opacity',1);
                            },22);
                        }else{
                            date_picker.css('opacity',0);
                            setTimeout(function(){
                                date_picker.css('display','none');
                            },300);
                        }
                    };
                    $("#locationP_waypoint_toolBar").css('transform','translateY(0px)');
                }else{
                    this.map.clearOverlays();//清除地图
                    date_picker.css('opacity',0);
                    setTimeout(function(){
                        date_picker.css('display','none');
                    },300);
                    $("#locationP_waypoint_toolBar").css('transform','translateY(100%)');
                }
            }
        }
    },
    methods: {
        init:function(){
            if(this.mapType == 'location'){
                this.refresh();
            }
        },
        initBind:function(){

        },
        initView:function(){
            var self = this;
            this.mapJq = $("#location_aMap");
            self.map = new BMap.Map("location_aMap");
            self.position = [
                launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LON],
                launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LAT]
            ];
            //self.mapJq.hide();
            pickmeup('.single', {flat : true});
            $("#date_picker").hide();
            //var timer = setInterval(function(){
            //    if(app.isDoingAnimation){
            //        clearInterval(timer);
            //        self.mapJq.show();
            //        self.map = new BMap.Map("location_aMap");
            //        self.position = [
            //            launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LON],
            //            launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LAT]
            //        ];
            //    }
            //},1000);
        },
        refresh:function(){
            var self = this;
            //get position data
            var dataStr = '{' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_last_position', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        this.map.clearOverlays();//清除地图
                        Message.toast('暂无最新数据', 2);
                        return false;
                    } else {
                        var res = data[MESSAGE];
                        var arr = res.split('|');
                        launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LON] = arr[0];
                        launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LAT] = arr[1];
                        launcher_vue.devices_ = JSON.parse(JSON.stringify(launcher_vue.devices_));

                        //update ui
                        self.position = [launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LON],launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LAT]];
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    index_vue.logout();
                }
            });
        },
        right_btn:function(){
            this.refresh();
        },
        fence_back:function(){
            var self = this;
            this.fenceShow = false;
            setTimeout(function(){
                self.locationShow = true;
            },300);
        },
        fence_initView:function(){
            var self = this;
            this.locationShow = false;
            setTimeout(function(){
                console.log('self.fenceShow = true');
                self.fenceShow = true;
            },300);
        },
        fence_init:function(){
            var self = this;
            try{
                if(Helper.hasObjKey(launcher_vue.devices_[launcher_vue.using][DEVICE_FENCE])){
                    self.fence_initView()
                }else{
                    throw new EventException()
                }
            }catch (err){
                var dataStr = '{' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_fence', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false
                        } else {
                            launcher_vue.devices_[launcher_vue.using][DEVICE_FENCE] =  Helper.getJsonObj(data[MESSAGE]);
                            launcher_vue.devices_ = JSON.parse(JSON.stringify(launcher_vue.devices_));
                            self.fence_initView()
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                        app.publish(APP_EVENT_LOGOUT);
                    }
                });
            }
        },
        fence_save:function(){
            var self = this;
            //保存 fenceKey
            var fenceObj = launcher_vue.devices[launcher_vue.using][DEVICE_FENCE];
            var dataStr = '{' +
                '"'+NAME+'":"'+fenceObj[self.fenceKey][FENCE_NAME]+'",' +
                '"'+LON+'":"'+fenceObj[self.fenceKey][FENCE_LON]+'",' +
                '"'+LAT+'":"'+fenceObj[self.fenceKey][FENCE_LAT]+'",' +
                '"'+RADIUS+'":"'+fenceObj[self.fenceKey][FENCE_RADIUS]+'",' +
                '"'+KEY+'":"'+self.fenceKey+'",' +
                '"'+TYPE+'":"'+fenceObj[self.fenceKey][FENCE_ISDANGER]+'",' +
                '"'+STATUS+'":"'+fenceObj[self.fenceKey][FENCE_STATUS]+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/save_fence', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] != 0) {
                        Message.toast(data[MESSAGE], 2);
                        return false
                    } else {
                        Message.toast('设置成功', 2);
                        launcher_vue.devices_[launcher_vue.using][DEVICE_FENCE][self.fenceKey] = Helper.getJsonObj(data[MESSAGE]);
                        launcher_vue.devices_ = JSON.parse(JSON.stringify(launcher_vue.devices_));
                        //ui
                        self.fenceKey = self.fenceKey;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        },
        waypoint_initView:function(){
            var self = this;
            this.locationShow = false;
            setTimeout(function(){
                self.wayPointShow = true;
            },300);
            this.waypoint_initData();
        },
        waypoint_initData:function(){
            this.waypoint = {
                markers:[],
                lineArr:[],
                currentMonth:null,
                thisYear:(new Date).getFullYear()+'',
                thisMonth:((new Date).getMonth()+1+'').length>=2? ((new Date).getMonth()+1)+'':'0'+((new Date).getMonth()+1),
                thisDate:((new Date).getDate()+'').length>=2? (new Date).getDate()+'':'0'+(new Date).getDate(),
                actNow:''
            };
            this.waypoint.actNow = this.waypoint.thisYear+this.waypoint.thisMonth+this.waypoint.thisDate;
        },
        waypoint_isCanClick:function(date){
            var day = (new Date(date)).getDate()+'';
            day = day.length>=2? day+'':'0'+day;
            var month = (new Date(date)).getMonth()+1+'';
            month = month.length>=2? month+'':'0'+month;
            var year = (new Date(date)).getFullYear()+'';
            var key = year+month+day;//20161010
            var earlestDay = '';
            for(var i in this.waypoints[launcher_vue.using]){
                earlestDay = i.substr(1,i.length-1);
                break;
            }
            if(parseInt(key)>parseInt(this.waypoint.actNow)){//日期过大
                return false;
            }
            if(parseInt(key) < parseInt(earlestDay)){ //日期过早
                Message.toast('日期选择过早',2);
                return false;
            }
            if(!Helper.hasObjKey(this.waypoints[launcher_vue.using]['i'+key])){  //没有轨迹
                Message.toast('改日期没有轨迹',2);
                return false;
            }
            this.waypoint_paint(this.waypoints[launcher_vue.using]['i'+key]);
        },
        waypoint_paint:function(arr){//[{time:,point[lon,lat]},{},{}]
            this.map.clearOverlays();//清除地图
            this.waypoint.markers = [];
            this.waypoint.lineArr = [];

            for(var i=0;i<arr.length;i++){
                var val = arr[i];
                var point = new BMap.Point(val['point'][0], val['point'][1]);
                var marker = new BMap.Marker(point);//设置marker
                this.map.addOverlay(marker);

                this.waypoint.markers.push(marker);
                this.waypoint.lineArr.push(point);
            }

            if(this.waypoint.lineArr.length > 1){
                var polyline = new BMap.Polyline(this.waypoint.lineArr
                    , {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});
                this.map.addOverlay(polyline);
            }

            this.map.centerAndZoom(point, 15);
        },
        waypoint_init:function(){
            var self = this;
            try{
                if(this.waypoints[launcher_vue.using]){
                    this.waypoint_initView();
                }else{
                    throw new SQLException;
                }
            }catch (err){
                var dataStr = '{' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_waypoint', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast('没有轨迹数据', 2);
                            return false;
                        } else {
                            var arr = Helper.getJsonObj(data[MESSAGE]);
                            self.waypoints[launcher_vue.using] = {};
                            for(var i=0;i<arr.length;i++){
                                var pointObj = arr[i];
                                var dateObj = new Date(pointObj[WAYPOINT_INTTIME]*1000);
                                if(!self.waypoints[launcher_vue.using]['i'+dateObj.getFullYear()+(dateObj.getMonth()+1)+dateObj.getDate()]){
                                    self.waypoints[launcher_vue.using]['i'+dateObj.getFullYear()+(dateObj.getMonth()+1)+dateObj.getDate()] = [];
                                }
                                self.waypoints[launcher_vue.using]['i'+dateObj.getFullYear()+(dateObj.getMonth()+1)+dateObj.getDate()].push({
                                    time:pointObj[WAYPOINT_INTTIME],
                                    point:pointObj[WAYPOINT_POINTS]
                                });
                            }

                            self.waypoint_initView();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                        index_vue.logout();
                    }
                });
            }
        },
        waypoint_prevMonth:function(){
            if(!this.waypoints[launcher_vue.using]){
                return false;
            }else{
                for(var i in this.waypoints[launcher_vue.using]){
                    var earlyTime = i.substr(0,i.length-1);
                }

                var earlyYear = earlyTime.substr(0,4);
                var earlyMonth = earlyTime.substr(4,2);

                if(this.waypoint.thisYear == earlyYear){
                    if(this.waypoint.thisMonth == earlyMonth){
                        return false;
                    }else{
                        $(".pmu-prev").trigger('click');
                        this.waypoint.currentMonth = true;
                        this.waypoint.thisMonth = earlyMonth;
                    }
                }else{
                    $(".pmu-prev").trigger('click');
                    this.waypoint.currentMonth = true;
                    this.waypoint.thisYear = earlyYear;
                    this.waypoint.thisMonth = earlyMonth;
                }
            }
        },
        waypoint_nextMonth:function(){
            if(this.waypoint.currentMonth){
                this.waypoint.currentMonth = null;
                $(".pmu-next").trigger('click');
                this.waypoint.thisYear=(new Date).getFullYear()+'';
                this.waypoint.thisMonth=((new Date).getMonth()+1+'').length>=2? ((new Date).getMonth()+1)+'':'0'+((new Date).getMonth()+1);
                this.waypoint.thisDate=((new Date).getDate()+'').length>=2? (new Date).getDate()+'':'0'+(new Date).getDate();
            }
        },
        waypoint_back:function(){
            var self = this;
            this.wayPointShow = false;
            setTimeout(function(){
                self.locationShow = true;
            },300);
        },
        waypoint_openFence:function(){
        },
        showOpts:function(){
            var $cArr = $('#index_vue_opts .opt');
            var x = 40;
            var y = 60;
            var scale = 0.8;
            if($cArr.eq(0).css('opacity') == 0){
                this.isOptsShow = true;
                $cArr.eq(0).css({
                    opacity:1,
                    'transform':'scale('+scale+') translate(-'+x+'px,-'+y+'px)',
                    '-webkit-transform':'scale('+scale+') translate(-'+x+'px,-'+y+'px)'
                });
                $cArr.eq(1).css({
                    opacity:1,
                    'transform':'scale('+scale+') translate('+x+'px,-'+y+'px)',
                    '-webkit-transform':'scale('+scale+') translate('+x+'px,-'+y+'px)'
                });
            }else{
                this.isOptsShow = false;
                $cArr.eq(0).css({
                    opacity:0,
                    'transform':'scale('+scale+') translate(0px,0px)',
                    '-webkit-transform':'scale('+scale+') translate(0px,0px)'
                });
                $cArr.eq(1).css({
                    opacity:0,
                    'transform':'scale('+scale+') translate(0px,0px)',
                    '-webkit-transform':'scale('+scale+') translate(0px,0px)'
                });
            }
        },
        shutdown:function(){
            Message.dialog('提示','确定要进行远程关机吗','确定','取消',function(){
               Message.removeDialog();
            },function(){
                Message.removeDialog();
            });
        },
        locating:function(){
            Message.showWait('定位中');
            setTimeout(function(){
                Message.removeWait();
            },1000);
        }
    }
});
var locationP_vue;
var index_vue = function(){
    index_vue = new Vue({
        el: '#index_vue',
        created:function () {
            this.launcher_vue = launcher_vue;
        },
        compiled:function () {
            setTimeout(function(){
                locationP_vue = index_vue.$children[0];
                locationP_vue.initView();
                locationP_vue.initBind();
            },100);

            launcher_vue.makeSureHeight(this.$el);
            this.initView();
            this.initBind();
        },

        data: {
            DEVICE_INFO:DEVICE_INFO,
            DEVICE_AVT:DEVICE_AVT,
            title_left:'',
            title_right:'切换宝宝',
            title:'关爱未来',
            nowFootIndex:0,
            pages:[
                {
                    footer_img_pressed:'zhuye_pressed',
                    footer_img_normal:'zhuye_normal',
                    footer_text:'我的宝贝',
                    opt:[
                        {img:'class_table',text:"课程表"},
                        {img:'home_work',text:"作业"},
                        {img:'baby_notice',text:"宝贝消息"},
                        {img:'tel_teacher',text:"联系老师"}
                    ],
                    place:'',
                    title:'关爱未来',
                    title_left:'',
                    title_right:'切换宝宝'
                },
                {
                    footer_img_pressed:'notice_pressed',
                    footer_img_normal:'notice_normal',
                    footer_text:'通知',
                    title:'通知',
                    title_left:'',
                    title_right:''
                },
                {
                    footer_img_pressed:'discovery_pressed',
                    footer_img_normal:'discovery_normal',
                    footer_text:'发现',
                    title:'发现',
                    title_left:'',
                    title_right:''
                },
                {
                    footer_img_pressed:'me_pressed',
                    footer_img_normal:'me_normal',
                    footer_text:'个人中心',
                    title:'个人中心',
                    title_left:'',
                    title_right:''
                }
            ],
            pagesObj:$("#index_vue .page"),
            DEVICE_NAME:DEVICE_NAME,
            userPlace:''
        },
        methods: {
            init:function(){
                if( app.isLogingout ){
                    app.isLogingout = false;
                    this.initView();
                }
            },
            initPlaceInfo:function(){
                var self = this;
                var babyLon,babyLat;
                babyLon = launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LON];
                babyLat = launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LAT];
                if(babyLon && babyLat){
                    console.log('get baby PlaceInfo');
                    console.log('babyLon:'+babyLon+' && babyLat:'+babyLat);
                    setTimeout(function(){
                        map.getPlaceByLatLon(babyLon, babyLat, self, 0);
                    },0);
                }else{
                    this.setPlaceInfo('');
                }
            },
            setPlaceInfo:function(str){
                console.log('set baby place info');
                var obj = $('#index_one-info');
                var oldText = obj.find('.s2').text();
                var newText = '此刻位置：'+str;
                if(oldText != newText){
                    obj.find('.s2').text(newText);
                }
            },
            getPlaceByLatLon_CallBack:function(addComp){
                if(addComp){
                    var placeInfo = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
                    this.setPlaceInfo(placeInfo)
                }else{
                    Message.toast('error', 2);
                }
            },
            footer_press:function(eq){
                var i;
                for(i=0;i<this.pages.length;i++){
                    var item = $(".footItem").eq(i);
                    var imgName;
                    var color;
                    if(eq == i){
                        imgName = this.pages[i].footer_img_pressed;
                        color = '#0098FB';
                        this.nowFootIndex = i;
                        this.pagesObj.eq(i).show();
                        this.pagesObj.eq(i).css('z-index','2');
                    }else{
                        imgName = this.pages[i].footer_img_normal;
                        color = '#000';
                        this.pagesObj.eq(i).css('z-index','1');
                    }
                    item.find('img').attr('src','./img/'+imgName+'.svg');
                    item.find('span').css('color',color);
                }
            },
            logout:function(){
                app.publish(APP_EVENT_LOGOUT);
            },
            initView:function(){
                this.pagesObj.eq(1).hide();
                this.pagesObj.eq(2).hide();
                this.pagesObj.eq(3).hide();
                this.footer_press(0);

                if(launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_AVT].length>100){
                    $("#deviceHead").attr("src",launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_AVT]);
                }

                this.initPlaceInfo();

                setTimeout(function(){
                    //定位
                    app.functionApi('getUserPosition','app.browser.setUserPosition');

                    //initView
                    $("#launcher").remove();
                },1000);
            },
            uploadImg:function(data1,input){
                var self = this;
                var method = input.attr('title');
                var dataStr = '{' +
                    '"'+IMG+'":"'+data1+'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/'+method, data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false
                        } else {
                            input.prev().attr('src',data1);
                            if(method == 'set_avt'){
                                launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_AVT] = data1;
                                var str = JSON.stringify(launcher_vue.devices_);
                                launcher_vue.devices_ = JSON.parse(str);
                                localStorage.setItem('devices',str);
                                localStorage.setItem('devices',data[USER_DEVICES]);
                            }else{
                                launcher_vue.useravt = data1;
                                localStorage.setItem('useravt',data1);
                            }

                            Message.toast('更新成功', 2);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                        self.logout();
                    }
                });
            },
            initBind:function(){
                var self = this;
                var $obj = $(this.$el);
                $obj.find(".imgUpload").change(function(e){
                    var f = e.target.files[0];//一次只上传1个文件，其实可以上传多个的
                    var FR = new FileReader();
                    var input = $(this);
                    FR.onload = function(f){
                        if(!this.result)return;
                        var canvas = document.createElement('canvas');
                        var img = new Image();
                        img.src = this.result;
                        var ctx = canvas.getContext("2d");
                        canvas.width = 120;
                        //canvas.height = img.height;
                        canvas.height = 120;
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                        ctx.fillRect(0,0,canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图像绘制到canvas上
                        var data1 = canvas.toDataURL("image/jpeg");
                        //alert(data1);
                        //alert(data1.length);
                        if(data1.length>1204){
                            setTimeout(function(){
                                self.uploadImg(data1,input);
                            },100);
                        }
                    };
                    setTimeout(function(){
                        FR.readAsDataURL(f);//先注册onload，再读取文件内容，否则读取内容是空的
                    },500);
                });

                $obj.find(".username").blur(function(){self.save_name($(this))});
            },
            save_name:function(obj){
                var self = this;
                launcher_vue.username = obj.text();
                if(launcher_vue.username){
                    if(launcher_vue.username.length > 12){
                        Message.toast("输入的名字过长",2);
                        launcher_vue.username = "";
                        return false;
                    }else{
                        var dataStr = '{' +
                            '"'+NAME+'":"'+launcher_vue.username+'",' +
                            '"sessionId":"'+app.sessionId+'"' +
                            '}';
                        $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/set_username', data: Helper.getJsonObj(dataStr), dataType: 'json',
                            success: function (data) {
                                if (data[CODE] != 0) {
                                    Message.toast(data[MESSAGE], 2);
                                    return false;
                                } else {
                                    Message.toast('更新成功', 2);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                                self.logout();
                            }
                        });
                    }
                }else{
                    $(this).text("请输入您的名字");
                }
            },
            test:function(){
                var dataStr = '{' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/test', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                    }
                });
            }
        }
    });
};