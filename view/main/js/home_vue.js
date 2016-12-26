var home_vue = new Vue({
    el:'#home_vue',
    compiled:function () {
        this.startCarousel();
        this.initBind();
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
    data:{
        canCarouselTask:true,
        carouselTimer:null,
        carouselTime:5,
        nowImgIndex_:1,
        imgs:[
            {name:'lunbo1.jpg'},
            {name:'lunbo2.jpg'},
            {name:'lunbo3.jpg'}
        ],
        mainPush:app.translate['zhutuichanpin'][app.langType],
        nowFirstIndex:1,
        productNum:7,
        canSlide:true,
        productImgs:[
            {name:'product1.jpg',hash:'tabletPc',text:'腾讯儿童平板电脑'},
            {name:'product2.jpg',hash:'watch2',text:'腾讯儿童手表3代'},
            {name:'product3.jpg',hash:'watch2',text:'腾讯儿童手表3S'},
            {name:'product4.jpg',hash:'mirror',text:'腾讯儿童QQ镜'},
            {name:'product5.jpg',hash:'',text:'腾讯儿童机器人'},
            {name:'product6.jpg',hash:'watch2',text:'腾讯儿童手表2代'},
            {name:'product7.jpg',hash:'guard',text:'腾讯儿童眼保镖'}
//                    {name:'product7.jpg'}
        ]
    },
    methods: {
        leftClick:function(){
            this.clearCarousel();
            this.carouselTask(false);
            this.startCarousel();
        },
        rightClick:function(){
            this.clearCarousel();
            this.carouselTask(true);
            this.startCarousel();
        },
        pointsClick:function(int){
            this.clearCarousel();
            this.nowImgIndex = parseInt(int);
            $(".carousel .imgs li").hide().eq(this.nowImgIndex-1).css({
                'z-index':9,
                '-ms-transform':'translateX(0)',
                '-webkit-transform':'translateX(0)'
            }).show();
            this.startCarousel();
        },
        startCarousel:function(){
            var self = this;
            this.carouselTimer = setInterval(function(){
                self.carouselTask(true);
            },self.carouselTime*1000);
        },
        clearCarousel:function(){
            if(this.carouselTimer!=null){
                clearInterval(this.carouselTimer);
                this.carouselTimer = null;
            }
        },
        carouselTask:function(isNext){
            if(!this.canCarouselTask){
                return false;
            }else{
                this.canCarouselTask= false;
            }

            var self = this;
            var imgsUl = $(".carousel .imgs");
            var old_li = imgsUl.find('li').eq(self.nowImgIndex-1);

            if(isNext){
                if(self.nowImgIndex >= this.imgs.length){
                    self.nowImgIndex = 1;
                }else{
                    self.nowImgIndex++;
                }
            }else{
                if(self.nowImgIndex <= 1){
                    self.nowImgIndex = this.imgs.length;
                }else{
                    self.nowImgIndex--;
                }
            }

            //开始动画
            var f=isNext?'':'-';
            var f1=isNext?'-':'';
            var li =  imgsUl.find('li').eq(self.nowImgIndex-1);

            old_li.css('z-index',8);
            li.css({
                'z-index':9,
                '-ms-transform':'translateX('+f+'100%)',
                '-webkit-transform':'translateX('+f+'100%)'
            }).show();
            setTimeout(function(){
                li.css({
                    '-ms-transform':'translateX(0)',
                    '-webkit-transform':'translateX(0)'
                });
                old_li.css({
                    '-ms-transform':'translateX('+f1+'100%)',
                    '-webkit-transform':'translateX('+f1+'100%)'
                });
                setTimeout(function(){
                    old_li.hide();
                    self.canCarouselTask = true;
                },900);
            },50);
        },
        initBind:function(){
            var self = this;
            $(this.$el).find('#product-slider')[0].addEventListener("transitionend", function(event){
                self.animationEnd(event)
            });
        },
        animationEnd:function(event){
            var self = this;
            var obj = $('#product-slider');
            obj.css('transition','');
            setTimeout(function(){
                obj.find('.fl').each(function(index_first,o){
                    var i = index_first+self.nowFirstIndex-1;
                    if(i>=7){
                        i = i%7;
                    }
                    var object = self.productImgs[i];

                    $(o).find('h2').text(object.text);
                });
                obj.find('img').each(function(){
                    if($(this).css('display') == 'none'){
                        $(this).css('display','block');
                    }else{
                        $(this).css('display','none');
                    }
                });
                obj.css('transform','translateX(0px)');
                self.canSlide = true;
            },0);
        },
        sliderMove:function(isNext){
            if(!this.canSlide){
                return false;
            }
            this.canSlide = false;

            var self = this;
            var obj = $('#product-slider');



            var width = obj.width();
            obj.css('transition','all .2s linear');
            if(isNext){
                obj.css('transform','translateX(-'+width*0.159999999+'px)');
                this.nowFirstIndex++;
                if(this.nowFirstIndex>7){
                    this.nowFirstIndex = 1;
                }
            }else{
                obj.css('transform','translateX('+width*0.159999999+'px)');
                this.nowFirstIndex--;
                if(this.nowFirstIndex<1){
                    this.nowFirstIndex = 7;
                }
            }

            var hide_index = null;
            obj.find('.fl').each(function(index_first,o){
                //$(o).find('h2').text(this.productImgs[index_first]['text']);
                var imgs = $(this).find('img');
                if(hide_index === null){
                    if(imgs.eq(0).css('display') == 'none'){
                        hide_index = 0;
                    }else{
                        hide_index = 1;
                    }
                }

                var i = (self.nowFirstIndex+index_first);//1+0%7  = 1
                if(i>=8){
                    i = i%7;
                }
                imgs.eq(hide_index).attr('src','./img/product'+i+'.jpg');
            });

        }
    }
});