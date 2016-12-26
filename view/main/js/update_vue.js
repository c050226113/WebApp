var update_vue = new Vue({
    el: '#update_vue',
    created:function () {},
    compiled:function () {},
    data: {
        imgs:[
            {name:'lunbo.jpg'},
            {name:'lunbo2.jpg'},
            {name:'lunbo.jpg'},
            {name:'lunbo2.jpg'}
        ]
    },
    computed: {
        nowImgIndex:{
            get:function(){
                return this.nowImgIndex_;
            },
            set:function(val){
                var num = parseInt(val);
                this.nowImgIndex_ = num;
                //ui
                $(".carousel .points img").css('background-color','#fff').eq(num-1).css('background-color','#000');
            }
        }
    },
    methods: {}
});