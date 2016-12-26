function IosBrowser(self){
    self.UNAVALIABLE = 0;
    self.WIFI = 1;
    self.JIZHAN = 2;
    self.userLocationType = '';

    self.die = function(){
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
