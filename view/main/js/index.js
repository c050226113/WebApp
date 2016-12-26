var index = new Vue({
    el: '#index',
    created:function () {},
    compiled:function () {
        this.initView();
        this.initBind();
    },
    data: {
        img:{
            logo:'logo.png',
            china:'logo.png',
            america:'logo.png'
        },
        index:'adfad'
    },
    computed: {


    },
    methods: {
        initView:function(){
            //get nav title data

        },
        initBind:function(){
            $(".nav_main .titles li").hover(function(){
                $(this).find('ul').show();
            },function(){
                $(this).find('ul').hide();
            });
        }
    }
});