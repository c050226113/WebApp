var app = new Vue({
    el: '#head',
    created:function () {},
    compiled:function () {
        this.initData();
    },
    data: {
        translate:{},
        html:null,
        API_URL:''
    },
    computed: {},
    methods: {
        initConstant:function(){
            var hrefArr = location.href.split('highcharts');
            if(hrefArr[0] == location.href){
                this.API_URL = 'highcharts'+'/index.php';
            }else{
                this.API_URL = hrefArr[0]+'highcharts'+'/index.php';
            }
        },
        lang:function(str){
            var obj = {};
            var k='';
            switch (str){
                default :
                case 'zh':
                    for(k in translate){
                        obj[k] = translate[k][0];
                    }
                    break;
                case 'en':
                    for(k in translate){
                        obj[k] = translate[k][1];
                    }
                    break;
            }

            return JSON.parse(JSON.stringify(obj));
        },
        initLanguage:function(){
            var langString;
            try{
                langString = localStorage.getItem('lang');
            }catch (err){
                langString = 'zh';
            }

            this.translate = new this.lang(langString);
        },
        loadComplete:function(){
            var imgArr = $(".loadImg");
            imgArr.each(function(index,obj){
                setTimeout(function(){
                    var img = $(obj);
                    img.attr('src',img.attr('data-src'));
                }, parseInt($(this).attr('data-wait')));
            });
        },
        initData:function(){
            this.initConstant();
            this.initLanguage();
            this.loadComplete();
        }
    }
});