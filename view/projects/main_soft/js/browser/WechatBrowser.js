var WechatBrowser = function(self){
    self.die = function(){
        wx.closeWindow();
    };
    self.setUserPosition = function(placeInfo){
        index.userPlace = placeInfo;
    };
    self.getPlaceByLatLon_CallBack = function(addComp){
        if(addComp){
            var placeInfo = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
            this.setUserPosition(placeInfo)
        }else{
            Message.toast('error', 2);
        }
    };
    self.getUserPosition = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(){
                var coords = position.coords;
                var lon,lat;
                lon = coords.longitude;
                lat = coords.latitude;
                map.getPlaceByLatLon(lon, lat, self,0);
            }, function(){
                self.positionSupport = false;
                Message.toast('定位功能被禁用',2);
            },{
                enableHighAccuracy: true,// 指示浏览器获取高精度的位置，默认为false
                timeout: 5000,// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                maximumAge: 3000// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            });
        }else{
            self.positionSupport = false;
        }
    };

    implement(self,[IH5App]);
};


wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '', // 必填，企业号的唯一标识，此处填写企业号corpid
    timestamp: 20552655, // 必填，生成签名的时间戳
    nonceStr: '', // 必填，生成签名的随机串
    signature: '',// 必填，签名，见附录1
    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function(){
    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
});
wx.error(function(res){
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});