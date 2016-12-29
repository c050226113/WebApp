var class_hide_vue = function(){
    class_hide_vue = new Vue({
        el: '#class_hide_vue',
        created: function () {},
        compiled: function () {},
        data: {
            status:SETTING_CLASS_STATUS,
            start_h:SETTING_CLASS_STARTH,
            start_m:SETTING_CLASS_STARTM,
            end_h:SETTING_CLASS_ENDH,
            end_m:SETTING_CLASS_ENDM,
            week:SETTING_CLASS_WEEK,
            opt:{
                week:[
                    {text:'一',checked:false},
                    {text:'二',checked:false},
                    {text:'三',checked:false},
                    {text:'四',checked:false},
                    {text:'五',checked:false},
                    {text:'六',checked:false},
                    {text:'七',checked:false}
                ]
            },
            h:[
                "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"
            ],
            m:[
                "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29",
                "30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"
            ]
        },
        computed: {
            set:{
                get:function(){
                    return launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_CLASS];
                }
            }
        },
        methods: {
            init:function(){},
            opt_show:function(flag){
                var self = this;
                //导出视图
                var index = flag;
                var start_h = parseInt(this.set['i-'+index][this.start_h]);
                var start_m = parseInt(this.set['i-'+index][this.start_m]);
                var end_h = parseInt(this.set['i-'+index][this.end_h]);
                var end_m = parseInt(this.set['i-'+index][this.end_m]);
                var week = this.set['i-'+index][this.week];

                if(start_h<10){start_h='0'+start_h}
                if(start_m<10){start_m='0'+start_m}
                if(end_h<10){end_h='0'+end_h}
                if(end_m<10){end_m='0'+end_m}

                var $obj = $(this.$el);
                $obj.find('.opt .start_h').val(start_h);
                $obj.find('.opt .start_m').val(start_m);
                $obj.find('.opt .end_h').val(end_h);
                $obj.find('.opt .end_m').val(end_m);
                $obj.find('.opt button:eq(1)').text('修改').unbind().bind('click',function(){self.add_class_hide(index)});

                for(var i in this.opt.week){
                    if(Math.pow(2,i) & week){
                        this.opt.week[i].checked = true;
                    }else{
                        this.opt.week[i].checked = false;
                    }
                }

                $obj.find('.opt').show();
            },
            toggle:function(index) {
                var input = $("#class_hide_switch_"+index);
                var bool = input.prop("checked");
                bool = bool? 0:1;

                var dataStr = '{' +
                    '"'+INDEX+'":"'+ index +'",' +
                    '"'+TYPE+'":"'+ bool +'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/class_hide_toggle', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false;
                        }else{
                            launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_CLASS]['i-'+index][SETTING_CLASS_STATUS] = bool;
                            Message.toast('修改成功', 1);
                            if(bool){
                                input.parent().removeClass('open');
                            }else{
                                input.parent().addClass('open');
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                        index_vue.logout();
                    },
                    complete: function () {}
                });
            },
            opt_day_check:function(index){
                this.opt.week[index].checked = this.opt.week[index].checked? false:true;
            },
            add_class_hide:function(index){
                var self = this;
                var $obj = $(this.$el);
                var start_h = $obj.find('.opt .start_h').val();
                var start_m = $obj.find('.opt .start_m').val();
                var end_h =   $obj.find('.opt .end_h').val();
                var end_m =   $obj.find('.opt .end_m').val();

                var week = 0;
                var i;
                for(i in this.opt.week){
                    if(this.opt.week[i].checked){
                        week = week + Math.pow(2,i);
                    }
                }

                var dataStr = '{' +
                    '"'+INDEX+'":"'+ index +'",' +
                    '"'+WEEK+'":"'+ week +'",' +
                    '"'+STARTH+'":"'+ start_h +'",' +
                    '"'+STARTM+'":"'+ start_m +'",' +
                    '"'+ENDH+'":"'+ end_h +'",' +
                    '"'+ENDM+'":"'+ end_m +'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/add_class_hide', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false;
                        }else{
                            launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_CLASS]['i-'+index] = JSON.parse(data[MESSAGE]);
                            Message.toast('修改成功', 2);
                            self.init();
                            $obj.find('.opt').hide();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                        index_vue.logout();
                    }
                });
            }
        }
    });
};
