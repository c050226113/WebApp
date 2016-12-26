var t_link = function(data){
    Vue.component('my-link', {
        template: `

        <div class="row">
            <div class="col-xs-8 col-xs-8 columns">
                <div v-for="title in titles" class="fl lll" style="height: auto">
                    <h1>{{title['name']}}</h1>
                </div>
            </div>
            <div class="col-xs-4 col-xs-4 columns">
                <table class="w100">
                    <tr>
                        <td class="w40">
                            <img class="w100 erweima" src="./img/erweima.png" />
                        </td>
                        <td class="w60" style="padding-left:15px">
                            <h1 style="font-family: 'Arial','Microsoft YaHei';font-weight: 600;">400-8835-933</h1>
                            <p>({{kefu}})</p>

                        </td>
                    </tr>
                </table>
            </div>
        </div>
        `,
        data:function(){
            return data;
        }
    });
    new Vue({
        el: '#link',
        create:function(){},
        compiled:function () {
            this.initView();
        },
        methods: {
            initView:function(){
                for (var index in data.titles){
                    var parent =  $('#link').find('.lll h1').eq(index).parent();
                    for(var k in data.titles[index]['content']){
                        var content = data.titles[index]['content'][k];
                        var html = '<div class="opt"><a href="#'+content.href+'">'+content.name+'</a></div>';
                        parent.append(html);
                    }
                }

                $('#link .lll').css('width',(100/Math.floor($('#link .lll').length))+'%');
            }
        }
    });
    t_link = null;
};

//get title data
var dataStr = '{' +
        //'"'+KEY+'":"'+ 3 +'",' +
        //'"sessionId":"'+SESSION_ID+'"' +
    '}';
//$.ajax({type: 'post', url: API_URL+'?r=main_soft/get_events', data: Helper.getJsonObj(dataStr), dataType: 'json',
$.ajax({type: 'post', url: app.API_URL+'?r=teng_jia_index/get_link_contents', dataType: 'json',
    success: function (data) {

        var dataForStart = {
            //kefu:translate.kefurexian
            kefu:app.translate['gongsigongzuori'][app.langType]+" 9:00-18:30"
        };
        var jsonObj = JSON.parse(data.msg);

        dataForStart['titles'] = [];
        for(var k in jsonObj){
            var contents = [];
            for(var key in jsonObj[k]){
                if(key == 0){
                    continue;
                }else{
                    contents.push({name:app.translate[jsonObj[k][key][0]][app.langType],href:jsonObj[k][key][1]})
                }
            }
            dataForStart['titles'].push({name:app.translate[jsonObj[k][0]][app.langType],content:contents});
        }

        t_link(dataForStart);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});