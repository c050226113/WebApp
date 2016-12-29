var sports_vue = function(){
    sports_vue =   new Vue({
        el: '#sports_vue',
        created: function () {},
        compiled: function () {
            this.initData();
        },
        data: {
            dayago:3,
            lastTime:'',
            sendValue:'',
            sportsData:{},
            refreshFlag:true
        },
        computed: {},
        methods: {
            init:function(){
                this.initData();
            },
            initData:function(){
                var self = this;
                try{
                    if(this.refreshFlag){
                        this.refreshFlag = false;
                        if(this.sportsData[launcher_vue.using] && this.sportsData[launcher_vue.using].length){
                            self.drawPic(self.sportsData[launcher_vue.using]);
                        }else{
                            $('#sports_main').find('.main').remove();
                            setTimeout(function(){
                                $('#sports_main').append('<div class="main"></div>');
                            },0);

                            throw new SQLException;
                        }
                    }
                }catch (err){
                    var whatDayAgo = 30;
                    var dataStr = '{' +
                        '"'+STARTH+'":'+ whatDayAgo +',' +
                        '"sessionId":"'+app.sessionId+'"' +
                        '}';
                    $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_sports_data', data: Helper.getJsonObj(dataStr), dataType: 'json',
                        success: function (data) {
                            if (data[CODE] != 0) {
                                Message.toast('没有运动数据', 2);
                                return false;
                            } else {
                                //更新ui
                                if(data[MESSAGE]){
                                    if(data[MESSAGE].length < 10){
                                        Message.toast('暂无数据', 2);
                                        return false;
                                    }else{
                                        self.sportsData[launcher_vue.using] = Helper.getJsonObj(data[MESSAGE]);
                                        self.drawPic(self.sportsData[launcher_vue.using]);
                                    }
                                }
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                            index_vue.logout();
                        }
                    });
                }
            },
            drawPic:function(dataArr){
                var data = [];

                for(var i=0;i<dataArr.length;i++){
                    var sportObj = dataArr[i];
                    var time = sportObj[DEVICE_SPORTS_INTTIME];
                    var newDate = new Date(time * 1000);
                    var year = newDate.getFullYear();
                    var month = newDate.getMonth();
                    var date = newDate.getDate();
                    var hour = newDate.getHours();
                    var min = newDate.getMinutes();
                    var seconds = newDate.getSeconds();
                    var timeKey = Time.getCTSTime(year, month, date, hour, min, seconds);

                    console.log([timeKey,sportObj[DEVICE_SPORTS_STEPS]]);
                    data.push([timeKey,sportObj[DEVICE_SPORTS_STEPS]]);
                }

                var chart = {
                    zoomType: 'x'
                };
                var title = {
                    //text: 'USD to EUR exchange rate from 2006 through 2008'
                    text: ''
                };
                var subtitle = {
                    text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' :
                        ''
                };
                var xAxis = {
                    type: 'datetime',
                    //minRange: 3600000 // 1小时
                    minRange: 1000 // 1小时
                };
                var yAxis = {
                    title: {
                        text: '步数每秒'
                    }
                };
                var legend = {
                    enabled: false
                };
                var plotOptions = {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                };

                var series= [{
                    type: 'area',
                    name: '步数每秒',
                    //pointInterval: 600*1000,//10分钟记录一次
                    //pointStart: startTime,
                    data: data
                }];

                var json = {};
                json.chart = chart;
                json.title = title;
                json.subtitle = subtitle;
                json.legend = legend;
                json.xAxis = xAxis;
                json.yAxis = yAxis;
                json.series = series;
                json.plotOptions = plotOptions;
                Highcharts.setOptions({ global: { useUTC: false } });
                var $obj = $(this.$el);
                $obj.find('.main').highcharts(json);
                $obj.find('.highcharts-credits').remove();
            },
            refresh:function(){
                this.sportsData[launcher_vue.using] = [];
                this.refreshFlag = true;
                this.initData();
            }
        }
    });
};