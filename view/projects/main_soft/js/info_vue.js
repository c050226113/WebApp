var info_vue = new Vue({
    el: '#info_vue',
    created: function () {
        this.launcher_vue = launcher_vue;
    },
    compiled: function () {
        launcher_vue.makeSureHeight(this.$el);
    },
    data: {
        DEVICE_INFO:DEVICE_INFO,
        DEVICE_NAME:DEVICE_NAME,
        DEVICE_SEX:DEVICE_SEX,
        DEVICE_ID:DEVICE_ID,
        DEVICE_HU:DEVICE_HU,
        DEVICE_TYPE:DEVICE_TYPE,
        DEVICE_SCHOOL:DEVICE_SCHOOL,
        DEVICE_CLASS:DEVICE_CLASS,
        DEVICE_FACE:DEVICE_FACE,
        DEVICE_SCHOOLWAY:DEVICE_SCHOOLWAY,
        DEVICE_LIVE:DEVICE_LIVE
    },
    computed: {
        year:{
            get:function(){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH]+'';
                var arr = str.split('|');
                return arr[0];
            },
            set:function(val){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH]+'';
                var arr = str.split('|');
                launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH] = val+"|"+arr[1]+"|"+arr[2];
            }
        },
        month:{
            get:function(){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH];
                var arr = str.split('|');
                return arr[1];
            },
            set:function(val){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH];
                var arr = str.split('|');
                launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH] = arr[0]+"|"+val+"|"+arr[2];
            }
        },
        day:{
            get:function(){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH];
                var arr = str.split('|');
                return arr[2];
            },
            set:function(val){
                var str = launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH];
                var arr = str.split('|');
                launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH] =  arr[0]+"|"+arr[1]+"|"+val;
            }
        },
        y:{
            get:function(){
                var arr = [];
                var year = parseInt((new Date).getFullYear())-1;
                var i;
                for( i= year;i>=(year - 30);i--){
                    arr.push({val:i});
                }
                return arr;
            }
        },
        m:{
            get:function(){
                var arr = [];
                for(var i=1;i<=12;i++){
                    arr.push({val:i});
                }
                return arr;
            }
        },
        d:{
            get:function(){
                var arr = [];
                for(var i=1;i<=31;i++){
                    arr.push({val:i});
                }
                return arr;
            }
        }
    },
    methods: {
        init:function(){},
        save:function(){
            //get and post
            var dataStr = '{' +
                '"'+NAME+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_NAME] +'",' +
                '"'+SEX+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_SEX] +'",' +
                '"'+BIRTH+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_BIRTH] +'",' +
                '"'+ID+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_ID] +'",' +
                '"'+HU+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_HU] +'",' +
                '"'+TYPE+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_TYPE] +'",' +
                '"'+SCHOOL+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_SCHOOL] +'",' +
                '"'+CLAS+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_CLASS] +'",' +
                '"'+FACE+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_FACE] +'",' +
                '"'+WAY+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_SCHOOLWAY] +'",' +
                '"'+LIVE+'":"'+ launcher_vue.devices[launcher_vue.using][DEVICE_INFO][DEVICE_LIVE] +'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/set_info', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if(data[CODE] != 0){
                        Message.toast(data[MESSAGE]);
                        return false;
                    }else{
                        Message.toast('保存成功');
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    Message.toast('信息验证已过期请重新登陆',3);
                }
            });
        }
    }
});