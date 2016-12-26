var news_vue = new Vue({
    el: '#news_vue',
    created:function () {},
    compiled:function () {
        this.initBind();
    },
    data: {
        coverOpacity:0.75,
        news:[
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo2.jpg',content:'adsfadsfad'},
            {imgName:'lunbo3.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'},
            {imgName:'lunbo1.jpg',content:'adsfadsfad'}
        ]
    },
    computed: {
    },
    methods: {
        initBind:function(){
            var self =this;
            $(this.$el).find('.background >div').hover(function(){
                var obj = $(this);
//                    obj.show();
                setTimeout(function(){
                    obj.css('opacity',self.coverOpacity);
                },0);
            },function(){
                var obj = $(this);
                setTimeout(function(){
                    obj.css('opacity',0);
                },0);
            });
        }
    }
});