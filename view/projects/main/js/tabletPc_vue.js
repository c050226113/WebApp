var tabletPc_vue = new Vue({
    el: '#tabletPc_vue',
    created:function () {},
    compiled:function () {
        this.initBind();
    },
    data: {
        title:'腾讯儿童平板电脑'
    },
    computed: {
    },
    methods: {
        initBind:function(){
            $('.realImg').load(function(){
                $(this).show();
                $('.imgReload').remove();
            })
        }
    }
});