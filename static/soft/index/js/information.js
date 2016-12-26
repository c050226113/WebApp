var Information = {
    supportPosErr : "",
    yourLon:null,
    yourLat:null,
    lat: [],
    lon: [],
    accuracy: [],
    type: [],
    signal: [],
    time: [],
    power: [],
    place:[],
    addBabyPositionWithoutAnimation:false,
    infoDingweiBar:$(".info .dingwei"),
    init: function () {
        this.initData();
        this.initView();
    },
    initView:function(){
        $(".no_data").hide();
    },
    showNoData:function(){
        Information.lat[BabyInfo.index] = true;
        Information.lon[BabyInfo.index] = true;
        Information.accuracy[BabyInfo.index] = true;
        Information.type[BabyInfo.index] = true;
        Information.signal[BabyInfo.index] = true;
        Information.time[BabyInfo.index] = true;
        Information.power[BabyInfo.index] = true;
        $(".no_data").show();
    },
    initData:function(){
        if(!this.lat[BabyInfo.index] || !this.lon[BabyInfo.index]){
            //没有获取过
            this.getBabyPosition();
        }else{
            if(this.lat[BabyInfo.index] === true && this.lon[BabyInfo.index] === true){
                Information.showNoData();
                Message.toast(Language.unavailable_info,3);
            }else{
                this.setInfo();
                this.addBabyPosition();
            }
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(Information.locationSuccess, Information.locationError,{
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAccuracy: true,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: 5000,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: 3000
            });
        }else{
            Message.toast("Your browser does not support Geolocation!");
        }
    },
    locationSuccess:function(position){
        var coords = position.coords;
        Information.yourLon = coords.longitude+"";
        Information.yourLat = coords.latitude+"";
    },
    locationError:function(error){
        Information.supportPosErr = "定位功能被禁用，或该浏览器不支持定位";
    },
    addBabyPosition:function(){
        if(Information.lon[BabyInfo.index]&&Information.lat[BabyInfo.index]){
            Information.barAnimate(true);
            var marker,circle;
            Map.map.clearMap();
            Map.map.setCenter([Information.lon[BabyInfo.index],Information.lat[BabyInfo.index]]);
            Map.map.setZoom(15.5);
            marker = new AMap.Marker({
                map: Map.map,
                position: [Information.lon[BabyInfo.index], Information.lat[BabyInfo.index]],
                icon: imgUrl+"map_information.png",
                offset: new AMap.Pixel(-14, -30)
            });
            Map.setMarker(marker);
            setTimeout(function(){
                circle = Map.getCircle(Information.lon[BabyInfo.index], Information.lat[BabyInfo.index],Information.accuracy[BabyInfo.index],"#29A8FD",'rgba(41,168,253,1)');
                Map.setCircle(circle);
                Information.barAnimate(false);
            },500);
        }
    },
    getBabyPosition: function () {
        $.ajax({
            type: 'post',
            url: indexUrl + '?r=soft/getbabyposition',
            data: {
                device: devicesData[BabyInfo.index]["D"],
                role: devicesData[BabyInfo.index]["R"]
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 0) {
                    Information.lat[BabyInfo.index] = data.A;
                    Information.lon[BabyInfo.index] = data.N;
                    Information.accuracy[BabyInfo.index] = data.D;
                    var s;
                    if(((1<<0)&data.G)==(1<<0)){
                        s = Language.gps;
                    }else if((((1<<1)&data.G)==(1<<1)) && (data.D<=150)){
                        s = Language.wifi;
                    }else{
                        s = Language.base_station;
                    }
                    Information.type[BabyInfo.index] = s;
                    Information.signal[BabyInfo.index] = data.S;
                    Information.time[BabyInfo.index] = data.T;
                    Information.power[BabyInfo.index] = data.V;
                    Map.getPlaceByLatLon(Information.lon[BabyInfo.index],Information.lat[BabyInfo.index],Information);
                } else {
                    P_index.checkTokenError(data.msg);
                    Information.showNoData();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Information.showNoData();
            }
        });
    },
    getPlaceByLatLon_CallBack:function(place){
        if(place==false){
            this.place[BabyInfo.index] = Language.unavailable;
        }else{
            this.place[BabyInfo.index] = place;
        }
        this.setInfo();
        this.addBabyPosition();
    },
    setInfo:function(){
        $(".no_data").hide();
        var informationObj = $(".info");
        informationObj.find(".middel p").eq(1).text(this.place[BabyInfo.index]?this.place[BabyInfo.index]:"");
        informationObj.find(".middel p").eq(2).text(this.accuracy[BabyInfo.index]?this.accuracy[BabyInfo.index]+"m":"");
        if(Time.change(Time.getStramp()-this.time[BabyInfo.index])+Language.before){
            informationObj.find(".middel p").eq(0).text(Time.change(Time.getStramp()-this.time[BabyInfo.index])+Language.before);
        }else{
            informationObj.find(".middel p").eq(0).text("");
        }
        informationObj.find(".left span").eq(0).text(this.type[BabyInfo.index]?"定位方式："+this.type[BabyInfo.index]:"");
        informationObj.find(".left span").eq(1).text(this.signal[BabyInfo.index]?"信号强度："+this.signal[BabyInfo.index]+"%":"");
        informationObj.find(".left span").eq(2).text(this.get_power_percent(this.power[BabyInfo.index])?"剩余电量："+this.get_power_percent(this.power[BabyInfo.index])+"%":"");
        informationObj.find(".middel .row").css("margin-top",  informationObj.find(".middel").height()*0.5 - informationObj.find(".middel .row").height()*0.5);
    },
    get_power_percent:function(v){
        var v_arr = [4100,4050,4000,3950,3900,3850,3800,3750,3700,3650,3600,3550,3500,3450,3400,3350,3250,3200];
        var p_arr = [100, 99, 96, 91, 87, 82, 76, 68, 60, 49, 34, 20, 12, 7, 5, 4, 2, 1];
        for(var i=0; i<v_arr.length; i++){
            if(v>=v_arr[i]){
                return p_arr[i];
                break;
            }
        }
    },
    barAnimate : function (flag){
        if(flag){
            Information.infoDingweiBar.addClass("dingwei_animate");
            setTimeout(function(){
                Information.barAnimate(false);
            },1000);
        }else{
            Information.infoDingweiBar.removeClass("dingwei_animate");
        }
    },
    beHere : function(){
        if(this.supportPosErr == ""){
            if (!this.yourLat) {
                Message.toast('定位中，请稍后', 2);
            } else {
                window.open('http://m.amap.com/navi/?start=' +this.yourLon + ',' + this.yourLat + '&dest=' + Information.lon[BabyInfo.index] + ',' + Information.lat[BabyInfo.index]  + '&destName=' + $('.info .middel .main').text() + '&key=e26b8cda40107bdb109530c28990582b');
            }
        }else{
            Message.toast(this.supportPosErr, 2);
        }
    }
};