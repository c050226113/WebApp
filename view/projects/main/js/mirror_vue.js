var mirror_vue = new Vue({
    el: '#mirror_vue',
    created:function () {},
    compiled:function () {
        this.initBind();
    },
    data: {
        title:'腾讯儿童QQ镜'
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