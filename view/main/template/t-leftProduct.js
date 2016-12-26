var t_leftProduct = function(data){
    Vue.component('my-leftproduct', {
        template: `
        <ul>
           <li v-for="product in productArr">{{product.name}}</li>
        </ul>
        `,
        data:function(){
            return data;
        }
    });
    new Vue({
        el: '#leftProduct',
        compiled:function () {
            this.initBind();
        },
        methods: {
            initBind:function(){
                var el = $(this.$el);
                var flag = '';
                if(el.hasClass('update')){
                    flag = 'update';
                }else if(el.hasClass('download')){
                    flag = 'appdownload';
                }

                el.find('li').each(function(index){
                    $(this).click(function(){
                        location.href =  flag+(index+1)+'.html';
                    });
                });
            }
        }
    });
    t_leftProduct = null;
};

$.ajax({type: 'post', url: app.API_URL+'?r=teng_jia_index/get_left_product', dataType: 'json',
    success: function (value) {
        var jsonObj = JSON.parse(value.msg);

        var data = {
            productArr:[]
        };

        for(var k in jsonObj){
            data.productArr.push({
                name: app.translate[jsonObj[k][0]]
            });
        }
        t_leftProduct(data);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    }
});
