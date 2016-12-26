var locationP_vue = new Vue({
    el: '#locationP_vue',
    created: function () {
        this.launcher_vue = launcher_vue;
    },
    compiled: function () {
        this.initView();
    },
    data: {
        mapType:'location',
        maker:null,
        circle:null,
        map:null,
        mapJq:null,
        //    ,textColor:"ea8010"},textColor:"00bb9c"},,textColor:"eb4f38"},,textColor:"56abe4"},迹",textColor:"9d55b8"}
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
        ]
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
                var self = this;
                if(val){
                    this.mapType = 'location';
                    var $el = $(index_vue.$el);
                    $el.find('td:eq(1)').text('定位');
                    $el.find('td:eq(2)').text('刷新');
                    index_vue.$children[0].right_btn = function(){
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
                var self = this;
                if(val){
                    console.log('fenceShow');
                    this.mapType = 'fence';
                    var $el = $(index_vue.$el);
                    $el.find('td:eq(1)').text('围栏');
                    $el.find('td:eq(2)').text('设置');
                    index_vue.$children[0].right_btn = function(){
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
                    index_vue.$children[0].right_btn = function(){
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
        initView:function(){
            var self = this;
            self.mapJq = $("#location_aMap");
            self.mapJq.hide();
            pickmeup('.single', {flat : true});
            $("#date_picker").hide();
            var timer = setInterval(function(){
                if(app.isDoingAnimation){
                    clearInterval(timer);
                    self.mapJq.show();
                    self.map = new BMap.Map("location_aMap");
                    self.position = [
                        launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LON],
                        launcher_vue.devices_[launcher_vue.using][DEVICE_INFO][DEVICE_LAT]
                    ];
                }
            },20);
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
        }
    }
});