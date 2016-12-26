var JMSlider = {
    infoWindow:null,
    polyline:null,
    activeMarkers:[],
    lineArr:[],
    markers:[],
    dateStr:"",
    dateTime:0,
    points_length:[],
    points:[],
    canSlide:false,
    slipper:$("#range-slider"),
    init:function(){
        this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
        var d = document.getElementById("range-slider");
        d.addEventListener('touchstart',JMSlider.touch, false);
        d.addEventListener('touchend',JMSlider.touch, false);
        d.addEventListener('touchmove',JMSlider.touch, false);
        $("#slider").css({"z-index":2147483641,"opacity":0});
    },
    touch:function(event){
        var event = event || window.event;
        switch(event.type){
            case "touchstart":
                JMSlider.infoWindow.close();
                break;
            case "touchend":
                var percent = parseInt(JMSlider.slipper.attr("data-slider"));
                var time = JMSlider.setTime(percent);
                if(time){
                    JMSlider.showWindows(time);
                }
                break;
            case "touchmove":
                event.preventDefault();
                var percent = parseInt(JMSlider.slipper.attr("data-slider"));
                var time = JMSlider.setTime(percent);
                if(time){
                    JMSlider.showWindows(time);
                }
                break;
        }
    },
    showWindows:function(val){
        console.log(val);
        var index;
        for(var i=0;i<this.points_length.length;i++){
            if(val>=this.points_length[i]){
                index = this.activeMarkers.indexOf(i);
                if(index == -1){
                    //发现一个点可以添加并且不再地图上
                    Map.setMarker(this.markers[i]);
                    this.activeMarkers.push(i);
                    JMSlider.lineArr.push([JMSlider.points[i][0],JMSlider.points[i][1]]);
                    this.polyline.setMap();
                    this.polyline = new AMap.Polyline({
                        path: JMSlider.lineArr,
                        strokeColor: "#ff0000",//线颜色
                        strokeOpacity: 0.5,//线透明度
                        strokeWeight: 1,//线宽
                        strokeStyle: "solid"//线样式
                    });
                    this.polyline.setMap(Map.map);
                }
            }else{
                index = this.activeMarkers.indexOf(i);
                if(index != -1){
                    //发现一个点可以去除并且在地图上
                    Map.removeMarker(this.markers[i]);
                    this.activeMarkers.remove(index);
                    this.lineArr.remove(index);
                    this.polyline.setMap();
                    this.polyline = new AMap.Polyline({
                        path: JMSlider.lineArr,
                        strokeColor: "#ff0000",//线颜色
                        strokeOpacity: 0.5,//线透明度
                        strokeWeight: 1,//线宽
                        strokeStyle: "solid"//线样式
                    });
                    this.polyline.setMap(Map.map);
                }
            }
        }
    },
    setTime:function(val){
        var time =  $("#slider .time");
        if(val == 100 || val==0){
            time.text("00:00");
            return false;
        }

        var d = this.dateTime+val*864;
        var res = Time.getLocalTime(d);
        var arr = res.split(" ");

        if(arr.length>3){
            time.text(arr[4]);
        }else{
            time.text(arr[1]);
        }

        return d;
    },
    canSlideByKey:function(key){
        var arr = key.split("|");

        this.dateStr = arr[1];
        this.dateTime = new Date(arr[1]+" "+"00:00:00").getTime()/1000;

        this.canSlide = key;

        this.removeAllMarker();

        this.createMarkers();

        this.addAllMarker();
    },
    cannotSlide:function(){
        this.canSlide = false;
        this.removeAllMarker();
    },
    removeAllMarker:function(){
        //移除所有点
        if(this.markers){
            for(var i=0;i<this.markers.length;i++) {
                Map.removeMarker(this.markers[i]);
            }
        }
        if(this.polyline!=null){
            this.polyline.setMap();
        }
        this.polyline = null;
        this.markers = [];
    },
    createMarkers:function(){
        this.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
        this.points = [];
        this.points_length = [];
        this.lineArr = [];
        this.activeMarkers = [];
        var arr,timeStart,timeEnd,cha,length,marker;
        var array = JMDatePicker.data[this.canSlide];
        for(var i=0; i<array.length;i++){
            arr = array[i].split(",");
            //"63,3720,22.56719,113.86286,150,66,0,17,12:00:12,1"
            timeEnd = new Date(this.dateStr+" "+arr[8]).getTime()/1000;
            this.points_length.push(timeEnd);//time长度
            this.lineArr.push([arr[3],arr[2]]);//长度
            this.points.push([arr[3],arr[2],arr[1]]);//经度，维度，电量
            marker = new AMap.Marker({
                map: Map.map,
                position: [arr[3], arr[2]],
                icon: new AMap.Icon({
                    size: new AMap.Size(44, 44),  //图标大小
                    image: imgUrl+"map_history.png",
                    imageOffset: new AMap.Pixel(-7, 3)
                })
            });
            marker.content = '<h5 class="txtc">'+arr[8]+'</h5>' +
            '<p style="font-size: 80%">'+Language.electricity+'： '+Information.get_power_percent(arr[1])+'%</p>';
            marker.on('click', function(e){
                JMSlider.infoWindow.setContent(e.target.content);
                JMSlider.infoWindow.open(Map.map, e.target.getPosition());
            });

            marker.emit('click', {target: marker});
            this.markers.push(marker);
        }
        JMSlider.infoWindow.close();
    },
    addAllMarker:function(){
        //添加所有点
        for(var i=0;i<this.markers.length;i++) {
            this.activeMarkers.push(i);
            Map.setMarker(this.markers[i]);
        }

        this.polyline = new AMap.Polyline({
            path: JMSlider.lineArr,
            strokeColor: "#ff0000",//线颜色
            strokeOpacity: 0.5,//线透明度
            strokeWeight: 1,//线宽
            strokeStyle: "solid"//线样式
        });
        this.polyline.setMap(Map.map);

    }
};


