//get title data
var nav = '';
console.log(nav);
$.ajax({type: 'post', url: app.API_URL+'?r=teng_jia_index/get_nav_contents', dataType: 'json',
    success: function (value) {
        var jsonObj = JSON.parse(value.msg);
        var data = {
            img:{
                logo:'logo400.png',
                china:'http://s2.uzooo.cn/static/images/china.png',
                america:'http://s2.uzooo.cn/static/images/english.png'
            },
            titles:{}
        };
        for(var i=0;i<jsonObj.length;i++){
            var title = '';
            var ttt = jsonObj[i];
            for(var key=0;key<ttt.length;key++){
                var item = ttt[key];
                if(key == 0){//title
                    title = app.translate[item[0]][app.langType];
                    data['titles'][title]={};
                    if(item[1]){
                        data['titles'][title]['href'] = '#'+item[1];
                    }else{
                        data['titles'][title]['href'] = '';
                    }

                    data['titles'][title]['content'] = {};
                }else{
                    data['titles'][title]['content'][app.translate[item[0]][app.langType]] = item[1];
                }
            }
        }
        nav = data;
        console.log(nav);
    },
    error: function (jqXHR, textStatus, errorThrown) {}
});