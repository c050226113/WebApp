var small_nav = function(data){
    Vue.transition('small_nav_cover',{
        beforeEnter:function(){},
        enter:function(el){},
        afterEnter:function(){},
        afterLeave:function(){
            small_nav.small_navShow = false;
        }
    });
    Vue.transition('small_nav_nav',{});
    Vue.component('my-small_nav', {
        template: `
        <div v-show="coverShow" transition="small_nav_cover" @click="coverClick()"></div>
        <div v-show="navShow" transition="small_nav_nav">
             <ul>
                <li v-for="(title, item) in titles" @click="navClick($event)">
                    <template v-if="item.href">
                        <a :href="item.href">{{title}}<img src="./img/right.svg"></a>
                    </template>
                    <template v-else>
                        <a>{{title}} <img src="./img/right.svg"></a>
                        <ul>
                            <li v-for="(title1, href) in item.content"><a :href="href">{{title1}}</a></li>
                        </ul>
                    </template>
                </li>
            </ul>
        </div>
        `,
        data:function(){
            return data;
        },
        methods:{
            coverClick:function(){
                small_nav.navShow = false;
                small_nav.coverShow = false;
            },
            navClick:function(event){
                var ul;
                if( ul = $(event.target).parent().find('ul')){
                    if(ul.height() > 10){
                        ul.css('height',0);
                    }else{
                        var lis = ul.children('li');
                        var li0 = lis.eq(0);
                        var padding_top = parseInt(lis.eq(0).css('padding-top'));
                        ul.css('height',(li0.height()+2*padding_top)*lis.length+'px');
                    }
                }
            }
        }
    });
    small_nav = new Vue({
        el: '#small_nav',
        compiled:function () {
            this.initBind();
        },
        data:data,
        methods: {
            initBind:function(){
                var self = this;
                $('#nav img.pull').click(function(){
                    self.small_navShow = true;
                    self.navShow = true;
                    self.coverShow = true;
                });
            }
        }
    });
};
var data = {
    small_navShow:false,
    coverShow:false,
    navShow:false
};
var timer = setInterval(function(){
    try{
        data['titles'] = nav.titles;
        clearInterval(timer);
        small_nav(data);
    }catch (err){}
},100);

