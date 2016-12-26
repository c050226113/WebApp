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
<link rel="stylesheet" href="<?=$mainDir?>./css/t-nav.css">
<div class="pos_a nav_shadow l0"></div>
<div class="nav" id="nav">
    <my-nav></my-nav>
</div>
<script src="<?=$mainDir?>./template/t-nav.js"></script>

<section class="txtc">
    <fieldset class="w50 diin" id="login">
        <legend>admin login</legend>
        <label>Name
            <input type="text" v-model="account" placeholder="Enter Account..">
        </label>
        <label>password
            <input type="password" v-model="password" placeholder="Enter Password..">
        </label>

        <button class="button small" @click="login">登录</button>
    </fieldset>
</section>

<link rel="stylesheet" href="<?=$mainDir?>./css/t-link.css">
<div id="link">
    <my-link></my-link>
</div>
<script src="<?=$mainDir?>./template/t-link.js"></script>
<link rel="stylesheet" href="<?=$mainDir?>./css/t-footer.css">
<div id="footer" class="pos_r">
    <my-footer></my-footer>
</div>
<script src="<?=$mainDir?>./template/t-footer.js"></script>

</body>
</html>
<script src="<?=$mainDir?>../js/util.js"></script>
<script>
    new Vue({
        el: '#login',
        compiled:function () {
        },
        data:{
            account:'',
            password:''
        },
        methods: {
            login:function(){
                var dataStr = '{' +
                        '"acc":"'+ this.account +'",' +
                        '"pwd":"'+ this.password +'"' +
                    '}';
                $.ajax({type: 'post', url: 'index.php'+'?r=teng_jia_index/admin_login', data: Helper.getJsonObj(dataStr), dataType: 'json',
                    success: function (data) {
                        if (data.code != 0) {
                            return false
                        } else {
                            location.reload();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown);
                    }
                });
            }
        }
    });
</script>
<script>
    $(function(){
        var timer = setInterval(function(){
            if(hasImg){
                clearInterval(timer);
            }
            var hasImg = false;
            $('img').each(function() {
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                    hasImg = true;
                    $(this).attr('src','<?=$mainDir?>'+$(this).attr('src'));
                }
            });
        },500);
    });
</script>