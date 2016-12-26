var start = function(data){
    Vue.component('my-footer', {
        template: `
            <table class="h100 w100">
                    <tr>
                        <td class="txtc">
                            ©2016 {{company}} 粤ICP备16123198号 {{copy}}
                        </td>
                    </tr>
            </table>
        `,
        data:function(){
            return data;
        }
    });
    new Vue({
        el: '#footer',
        compiled:function () {
        },
        methods: {
        }
    });
    start = null;
};

//get title data
var dataStr = '{' +
        //'"'+KEY+'":"'+ 3 +'",' +苏ICP备14038121号 | 技术支持：优站1号 | 管理登录.
        //'"sessionId":"'+SESSION_ID+'"' +
    '}';
//$.ajax({type: 'post', url: API_URL+'?r=main_soft/get_events', data: Helper.getJsonObj(dataStr), dataType: 'json',
//$.ajax({type: 'post', url: API_URL+'?r=main_soft/get_events', dataType: 'json',
//    success: function (data) {
//        if (data[CODE] != 0) {
//            Message.toast(data[MESSAGE], 2);
//            return false
//        } else {
//            var events = [];
//            var obj = Helper.getJsonObj(data[MESSAGE]);
//            for(var i in obj){
//                for(var t in obj[i]){
//                    var event = {
//                        time:parseInt(t.substr(1,t.length-1)),
//                        isrecieve:obj[i][t][DEVICE_EVENT_ISRECIEVE],
//                        message:obj[i][t][DEVICE_EVENT_MESSAGE],
//                        type:obj[i][t][DEVICE_EVENT_TYPE]
//                    };
//                    events.push(event);
//                }
//            }
//            alarm.events = events;
//        }
//    },
//    error: function (jqXHR, textStatus, errorThrown) {
//        console.log(errorThrown);
//        index_vue.logout();
//    }
//});

start({
    company:app.translate.tengjiakejiyouxiangongsi,
    copy:app.translate.banquansuoyou
});
