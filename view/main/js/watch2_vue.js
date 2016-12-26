var watch2_vue = new Vue({
    el: '#watch2_vue',
    created:function () {},
    compiled:function () {
        this.initBind();
    },
    data: {
        title:'第二代智能手表'
    },
    computed: {},
    methods: {
        initBind:function(){
            $('.realImg').load(function(){
                $('.imgReload').remove();
            })
        }
    }
});