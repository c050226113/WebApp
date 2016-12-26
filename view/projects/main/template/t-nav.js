var nav = function (data) {
    Vue.component('my-nav', {
        template: `
        <div class="nav_main pos_r">
            <img class="h80 fl logo" :src="'./img/'+img.logo"/>
            <div class="pos_r fr language_box">
                <div class="vam">
                    <i @click="changeLanguage('zh')" class="fl" style="width: 50%"><img class="w50 " :src="img.china" /></i>
                    <span class="fl pos_r" style="top:6px;border-left:1px solid #000;line-height: 15px;width: 1px;">&nbsp;</span>
                    <i @click="changeLanguage('en')" class="fr pos_r" style="width: 49%;"><img class="w50 " :src="img.america" /></i>
                </div>
            </div>
            <ul class="fr titles">
                <li v-for="(title, item) in titles" class="lll">
                    <template v-if="item.href">
                        <a :href="item.href"><span>{{title}}</span></a>
                    </template>
                    <template v-else><span>{{title}}</span>
                        <ul class="opt pos_a">
                            <li v-for="(title1, href) in item.content"><a :href="href">{{title1}}</a></li>
                        </ul>
                    </template>
                </li>
            </ul>
            <img class="pull" src="./img/pull.svg">
        </div>
        `,
        data: function () {
            return data;
        },

        methods:{
            changeLanguage:function(flag){
                localStorage.setItem('lang',flag);
                location.reload();
            }
        }
    });
    nav = new Vue({
        el: '#nav',
        compiled: function () {
            this.initBind();
            var index = localStorage.getItem('navEq');
            $('#nav .lll').eq(index).find('span').css({
                'background-color': '#0085c8',
                'border-radius': '12px',
                'color': 'white'
            })
        },
        data:data,
        methods: {
            initBind: function () {
                $(this.$el).find(".nav_main .titles li").hover(function () {
                    $(this).find('ul').css('z-index', '100').show();
                }, function () {
                    $(this).find('ul').hide();
                });

                $(this.$el).find("a").click(function(){
                    var index = $('#nav .lll').index($(this).parents('.lll'));
                    localStorage.setItem('navEq',index);
                });
            }
        }
    });
};

//get title data
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

        //console.log(jsonObj);

        for(var i=0;i<jsonObj.length;i++){
            var title = '';
            var ttt = jsonObj[i];
            for(var key=0;key<ttt.length;key++){
                var item = ttt[key];
                if(key == 0){//title

                    title = app.translate[item[0]];
                    //console.log(title);
                    data['titles'][title]={};
                    data['titles'][title]['href'] = item[1];
                    data['titles'][title]['content'] = {};
                }else{
                    data['titles'][title]['content'][app.translate[item[0]]] = item[1];
                }
            }
        }
        //console.log(data);


        nav(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        //console.log(errorThrown);
    }
});