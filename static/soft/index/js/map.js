var Map = {
    map  : new AMap.Map('aMap'),
    fenceCircle:null,
    circle : null,
    fenceMarker:null,
    marker : null,
    satellite       : new AMap.TileLayer.Satellite(),
    geolocation     : null,
    init : function(){
        this.map.setCenter([116.39,39.9]);
        this.map.setZoom(11);
        this.satellite.setMap(this.map);
        this.satellite.hide();
    },
    getPlaceByLatLon : function(lon, lat, obj, index){
        index = index? index:0;
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress([lon, lat], function(status, result) {
            if (status == 'complete' && result.info == 'OK') {
                var place = result.regeocode.formattedAddress;
                if(place){
                    obj.getPlaceByLatLon_CallBack(place,index);
                }else{
                    obj.getPlaceByLatLon_CallBack(false,index);
                }
            }else{
                obj.getPlaceByLatLon_CallBack(false,index);
            }
        });
    },
    setMarker:function(marker){
        marker.setMap(this.map);
    },
    getCircle:function(lon,lat,radius,lineColor,fillColor){
        return new AMap.Circle({
            center: [lon, lat],
            radius: radius?radius:100,
            strokeColor: lineColor,
            strokeWeight: 1,
            fillColor: fillColor,
            fillOpacity: 0.4
        });
    },
    setCircle : function(circle){
        circle.setMap(this.map);
    },
    removeMarker:function(marker){
        if(marker != null){
            marker.setMap();
        }
    },
    removeCircle:function(circle){
        if(circle != null){
            circle.setMap();
        }
    },
    toggleSatellite : function(flag){
        if(flag){
            this.satellite.show();
        }else{
            this.satellite.hide();
        }
    }
};