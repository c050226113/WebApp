<!DOCTYPE html>
<html>
<head>
    <title>title</title>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=2.0, user-scalable=no, width=device-width">
    <link rel="stylesheet" href="http://cdn.static.runoob.com/libs/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="/highcharts/view/main/../css/css.css">
    <link rel="stylesheet" href="/highcharts/view/main/./css/app.css">
    <script src="http://cdn.static.runoob.com/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="/highcharts/view/main/../js/head.load.min.js"></script>
    <script src="/highcharts/view/main/../js/vue.min.js"></script>
    <script src="/highcharts/view/main/./js/translate.js"></script>
    <script src="/highcharts/view/main/./js/require.js"></script>
</head>
<body>

<style>
    #translate{
        width: 28%;
        float: left;
    }
    #translate li{
        border: solid 1px #ddd;
        border-top: 0;
    }

    #translate li input{
        width: 50%;
        float: left;
    }
    #translate input{
        color: #000;
        height : 30px;
        margin-bottom: 0;
    }
    ::-webkit-input-placeholder{
        color: #aaa;
        font-size: 80%;
    }
</style>
<div id="translate" class="fl w30">
    <ul>
        <li v-for="obj in translate">
            <input style="width: 100%;font-weight: 600;outline:none;border: 0;box-shadow:none;" type="text" v-model="obj.py"/>
            <input style="outline:none;border: 0;box-shadow:none;" type="text" v-model="obj.zh" placeholder="请输入中文"/>
            <input style="outline:none;border: 0;box-shadow:none;" type="text" v-model="obj.en" placeholder="请输入英文"/>
            <div class="cb"></div>
        </li>
        <li class="txtc"><button class="btn btn-primary" style="margin: 20px" @click="add">添加</button></li>
    </ul>
</div>
<script src="<?=$mainDir?>./js/translate.js"></script>
<script>
    new Vue({
        el: '#translate',
        compiled:function () {
            var self = this;
            this.initData();
            setTimeout(function(){
                self.initBind();
            },100);
        },
        data:{
            translate:[],
            hasChange:false
        },
        methods: {
            initData:function(){
                var i = 0;
                for(var key in translate){
                    this.translate.$set(i,{
                       py:key,
                       zh:translate[key][0],
                       en:translate[key][1]
                    });
                    i++;
                }
            },
            initBind:function(){
                var self = this;
                $(this.$el).find('input').unbind().bind('blur',function(){
                    self.saveTranslate();
                }).bind('keydown',function(){
                    self.hasChange = true;
                });
            },
            saveTranslate:function(){
                if(!this.hasChange){
                    return false;
                }

                this.hasChange = false;
                var obj = {};
                for(var i in this.translate){
                    obj[this.translate[i].py] = [this.translate[i].zh,this.translate[i].en];
                }
                $.ajax({type: 'post', url: 'index.php' + '?r=teng_jia_setting/set_translate', data: {json:obj}, dataType: 'text',
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            },
            add:function(){
                var self = this;
                var length = this.translate.length;
                this.translate.$set(length,{
                    py:'iiii'+(new Date()).getTime(),
                    zh:'',
                    en:''
                });
                setTimeout(function(){
                    self.initBind();
                },100);
            }
        }
    });
</script>

<style>
    .off-canvas-wrap{
        width: 70%;
        float: right;
    }
</style>
<div class="off-canvas-wrap h100" data-offcanvas>

</div>
<script src="<?=$mainDir?>../js/util.js"></script>
</body>
</html>