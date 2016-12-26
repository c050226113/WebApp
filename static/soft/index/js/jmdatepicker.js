var JMDatePicker = {
    click_month:0,
    click_year:0,
    click_eq:0,
    devices:[],
    canNextMonth:false,
    dateData:[],
    dateFlag:[],
    data:[],
    year:"",
    month:"",
    day:"",
    dateContinue:10,
    initView:function(){
        JMDatePicker.year = year;
        JMDatePicker.month = month;
        $(".drp-calendar-start").hide();
        $(".drp-calendar-separator").hide();
        $(".drp-popup .drp-tip").hide();
        $(".custom-date").hide();
        $(".drp-calendar-date").html('').hide();
        $(".drp-popup .drp-calendar").css("left",($("body").width()- $(".drp-popup .drp-calendar").width())*0.5);
    },
    initBind:function(){
        $(".drp-day-selected").addClass("drp-day-in-range");
        //这里的unbind是有意义的
        $(".drp-day-in-range").unbind().bind("click",function(){JMDatePicker.liClick($(this))});
    },
    initData:function(){
        if(!this.dateData[BabyInfo.index]){
            this.createNewDevice();
        }
        this.getData();
    },
    init:function(){
        this.initData();
        this.initView();
        this.initBind();
    },
    createNewDevice:function(){
        this.dateData[BabyInfo.index] = null;
        JMDatePicker.dateFlag[BabyInfo.index] = false;
    },
    liClick:function(obj){
        if(JMDatePicker.year == JMDatePicker.click_year && JMDatePicker.month == JMDatePicker.click_month){
            $(".drp-days").eq(1).find("li").eq(JMDatePicker.click_eq).css("background-color","#ddf3fe");
        }
        $(".drp-day-selected").css("background-color","#2A91CA");
        obj.css("background-color","orange");
        this.click_year = JMDatePicker.year;
        this.click_month = JMDatePicker.month;
        obj.parent().find("li").each(function(index,o){
            if($(o).text() == obj.text()){
                JMDatePicker.click_eq = index;
                return false;
            }
        });
        //清空地图�?
        JMSlider.cannotSlide();
        //显示地图�?
        var data;
        //判断是否有获取数据完�?
        if(this.dateFlag[BabyInfo.index] == false){
            Message.toast(Language.getting_track_data_please_wait,1.5);
            return false;
        }
        //判断是否有数�?
        data =this.dateData[BabyInfo.index];
        if(!data){
            Message.toast(Language.the_device_has_no_trace_data_for_nearly_ten_days,1.5);
            return false;
        }

        this.day = obj.text();
        if(this.day<10){
            this.day = "0"+parseInt(this.day);
        }

        //找到index 日期主键
        var index = 0;
        var arr=[];
        var count = data.length;
        for(var i=0;i<count;i++){
            arr = data[i].split(",");
            if(arr[0] == this.year+"-"+this.month+"-"+this.day){
                index = arr[1];
                break;
            }
        }
        if(index == 0){
            Message.toast(Language.this_date_has_no_trace_data,1.5);
            return false;
        }

        //得到日期数据
        this.getDayData(this.year+"-"+this.month+"-"+this.day,index);
    },
    getDayData:function(dateStr,index){
        //没有日期数据
        if(!this.data[BabyInfo.index+"|"+dateStr]){

            $.ajax({
                type: 'post',
                url: indexUrl + '?r=soft/getpoints',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"],
                    index: index
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        JMDatePicker.data[BabyInfo.index+"|"+dateStr] = data.msg.split("|");
                    } else {
                        P_index.checkTokenError(data.msg);
                        JMDatePicker.data[BabyInfo.index+"|"+dateStr] = "";
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    JMDatePicker.data[BabyInfo.index+"|"+dateStr] = "";
                },
                complete:function(){
                    setTimeout(function(){
                        //开启滑块监听的数据key
                        JMSlider.canSlideByKey(BabyInfo.index+"|"+dateStr);
                    },1000);
                }
            });
        }else{
            //开启滑块监听的数据key
            JMSlider.canSlideByKey(BabyInfo.index+"|"+dateStr);
        }
    },
    getData:function(){
        if(this.dateData[BabyInfo.index] !=null){//某个宝贝的日期数�?
            return true;
        }else{
            $.ajax({
                type: 'post',
                url: indexUrl + '?r=soft/getwaypoints',
                data: {
                    device: devicesData[BabyInfo.index]["D"],
                    role: devicesData[BabyInfo.index]["R"]
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 0) {
                        JMDatePicker.dateData[BabyInfo.index] = data.msg.split("|");
                    } else {
                        P_index.checkTokenError(data.msg);

                        JMDatePicker.dateData[BabyInfo.index] = "";
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    JMDatePicker.dateData[BabyInfo.index] = "";
                },
                complete:function(){
                    JMDatePicker.dateFlag[BabyInfo.index] = true;
                }
            });
        }
    },
    //点击下个月后会调用的最后的过程
    canNextMonthfn:function(){
        if(this.canNextMonth){
            setTimeout(function(){
                if(JMDatePicker.year == JMDatePicker.click_year && JMDatePicker.month == JMDatePicker.click_month){
                    if($(".drp-days").eq(1).find("li").eq(JMDatePicker.click_eq).hasClass("drp-day-selected")){
                        $(".drp-days").eq(1).find("li").eq(JMDatePicker.click_eq).css("background-color","#2A91CA");
                    }else{
                        $(".drp-days").eq(1).find("li").eq(JMDatePicker.click_eq).css("background-color","orange");
                    }

                }
                JMDatePicker.initBind();
            },10);
            return true;
        }
        return false;
    },
    //点击上个月后会调用的最后的过程
    hasData:function(){
        var count = 0;
        $(".drp-calendar-end .drp-days li").each(function(){
            count++;
            if($(this).hasClass("drp-day-selected")){
                return false;
            }
        });

        if(count>this.dateContinue){
            return false;
        }else{
            setTimeout(function(){
                if(JMDatePicker.year == JMDatePicker.click_year && JMDatePicker.month == JMDatePicker.click_month){
                    $(".drp-days").eq(1).find("li").eq(JMDatePicker.click_eq).css("background-color","orange");
                }
                JMDatePicker.initBind();
            },10);
            return true;
        }
    }
};