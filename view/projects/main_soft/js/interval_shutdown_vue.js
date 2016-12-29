var interval_shutdown_vue = function(){
    interval_shutdown_vue = new Vue({
        el: '#interval_shutdown_vue',
        created: function () {},
        compiled: function () {},
        data: {
            h:[
                "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"
            ],
            m:[
                "00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29",
                "30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59"
            ],
            status:SETTING_INTERVALSHUTDOWN_STATUS,
            time_h:SETTING_INTERVALSHUTDOWN_TIMEH,
            time_m:SETTING_INTERVALSHUTDOWN_TIMEM
        },
        computed: {
            set:{
                get:function(){
                    return launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_INTERVALSHUTDOWN];
                }
            }
        },
        methods: {
            init:function(){},
            opt_show:function(flag){
                var self = this;
                var $obj = $(this.$el);
                var start_h = parseInt(this.set['i-'+0][this.time_h]);
                var start_m = parseInt(this.set['i-'+0][this.time_m]);

                var end_h = parseInt(this.set['i-'+1][this.time_h]);
                var end_m = parseInt(this.set['i-'+1][this.time_m]);

                if(start_h<10){start_h='0'+start_h}
                if(start_m<10){start_m='0'+start_m}
                if(end_h<10){end_h='0'+end_h}
                if(end_m<10){end_m='0'+end_m}

                $obj.find('.opt .start_h').val(start_h);
                $obj.find('.opt .start_m').val(start_m);
                $obj.find('.opt .end_h').val(end_h);
                $obj.find('.opt .end_m').val(end_m);
                $obj.find('.opt button:eq(1)').text('修改').unbind().bind('click',function(){self.update()});

                $obj.find('.opt').show();
            },
            toggle:function(index) {
                var input = $("#interval_shutdown_"+index);
                var bool = input.prop("checked");
                bool = bool? 0:1;

                var dataStr = '{' +
                    '"'+INDEX+'":"'+ index +'",' +
                    '"'+TYPE+'":"'+ bool +'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/interval_shutdown_toggle', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false;
                        }else{
                            launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_INTERVALSHUTDOWN]['i-'+index][SETTING_INTERVALSHUTDOWN_STATUS] = bool;
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
            update:function(){
                var self = this;
                var $obj = $(this.$el);
                var start_h = $obj.find('.opt .start_h').val();
                var start_m = $obj.find('.opt .start_m').val();
                var end_h =   $obj.find('.opt .end_h').val();
                var end_m =   $obj.find('.opt .end_m').val();

                var dataStr = '{' +
                    '"'+STARTH+'":"'+ start_h +'",' +
                    '"'+STARTM+'":"'+ start_m +'",' +
                    '"'+ENDH+'":"'+ end_h +'",' +
                    '"'+ENDM+'":"'+ end_m +'",' +
                    '"sessionId":"'+app.sessionId+'"' +
                    '}';
                $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/interval_shutdown_update', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data[CODE] != 0) {
                            Message.toast(data[MESSAGE], 2);
                            return false;
                        }else{
                            launcher_vue.devices[launcher_vue.using][DEVICE_SETTING][SETTING_INTERVALSHUTDOWN] = JSON.parse(data[MESSAGE]);
                            Message.toast('修改成功', 1);
                            self.init();
                            $obj.find('.opt').hide();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {console.log(errorThrown);
                        index_vue.logout();
                    },
                    complete: function () {}
                });
            }
        }
    });
};