function Browser(){
    self.UNAVALIABLE = 0;
    self.WIFI = 1;
    self.JIZHAN = 2;
    self.userLocationType = '';

    self.die = function(){
        alert('isIOS1111');
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
            navigator.geolocation.getCurrentPosition(self.getPositionSuccess, self.getPositionError,{
                enableHighAccuracy: true,// 指示浏览器获取高精度的位置，默认为false
                timeout: 5000,// 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                maximumAge: 3000// 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
            });
        }else{
            self.positionSupport = false;
        }
    };
    self.getPositionSuccess = function(position){
        alert(position);
        var coords = position.coords;
        var lon,lat;
        lon = coords.longitude;
        lat = coords.latitude;
        map.getPlaceByLatLon(lon, lat, self,0);
    };
    self.getPositionError = function(){
        self.positionSupport = false;
        Message.toast('定位功能被禁用',2);
    };

    implement(self,[IH5App]);
}