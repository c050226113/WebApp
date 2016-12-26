var guard_vue = new Vue({
    el: '#guard_vue',
    created:function () {},
    compiled:function () {
        this.initBind();
    },
    data: {
        title:'腾讯儿童眼保镖'
    },
    computed: {
    },
    methods: {
        initBind:function(){
            $('.realImg').load(function(){
                $('.imgReload').remove();
            })
        }
    }
});