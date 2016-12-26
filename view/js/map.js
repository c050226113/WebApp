var map = {
    getPlaceByLatLon : function(lon, lat, obj, i){
        var point = new BMap.Point(lon, lat);
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs){
            var addComp = rs.addressComponents;
            obj.getPlaceByLatLon_CallBack(addComp,i);
        });
    }
};