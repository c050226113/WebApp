<!DOCTYPE html>
<html>
<head>
    <!--    #0098FB-->
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>腾讯儿童手表</title>

    <link href="http://libs.baidu.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?=ROOT_URL?>/static/common/css/css.css<?= "?a=" . time() ?>" rel="stylesheet">
    <link href="<?=ROOT_URL?>/static/common/css/common.css<?= "?a=" . time() ?>" rel="stylesheet">
    <link href="<?=ROOT_URL?>/static/soft/index/css/index.css<?="?a=".time()?>" rel="stylesheet">
    <link href="<?=ROOT_URL?>/static/soft/index/css/calendar.css" rel="stylesheet">
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
    <style>body{
            height: 100%;
        }</style>
</head>
<body>

<!--NAV-->
<div class="nav row" style="position: relative;overflow: hidden;">
    <div class="col-xs-4"></div>
    <div class="col-xs-4 vtm h100 txtc">
        <?php if(!$do){ ?>
            <span class="name clwh h100">设备员绑定</span>
        <?php }else{ ?>
            <span class="name clwh h100">管理员绑定</span>
        <?php } ?>
    </div>
    <div class="col-xs-4">
    </div>
</div>
<?php if(!$do){ ?>
    <script>
        var action = "bind";
    </script>
    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>角色</b></div>
        <div class="col-xs-7">
            <select class="form-control" id="role">
                <option value="1">爸爸</option>
                <option value="2">妈妈</option>
                <option value="3">爷爷</option>
                <option value="4">奶奶</option>
                <option value="5">外公</option>
                <option value="6">外婆</option>
            </select>
        </div>
        <div class="col-xs-1"></div>
    </div>

    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>宝贝昵称</b></div>
        <div class="col-xs-7"><input id="nickname" class="form-control" placeholder="请输入昵称"></div>
        <div class="col-xs-1"></div>
    </div>

    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>绑定码</b></div>
        <div class="col-xs-7"><input id="bindCode" class="form-control" placeholder="请输入手表的绑定码"></div>
        <div class="col-xs-1"></div>
    </div>

    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>设备号码</b></div>
        <div class="col-xs-7"><input id="watchphone" class="form-control" placeholder="请输入手表的号码"></div>
        <div class="col-xs-1"></div>
    </div>
    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-10">
            <button class="btn btn-lg" id="bindBtn" style="width: 100%;background: #0098FB;color: #fff;">确定</button>
        </div>
        <div class="col-xs-1"></div>
    </div>
<?php }else{ ?>
    <script>
        var action = "register";
    </script>
    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>您的手机号</b></div>
        <div class="col-xs-7"><input id="phone" class="form-control" placeholder="请输入您的手机号码"></div>
        <div class="col-xs-1"></div>
    </div>
    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>管理员密码</b></div>
        <div class="col-xs-7"><input type="password" id="password" class="form-control" placeholder="请输入密码"></div>
        <div class="col-xs-1"></div>
    </div>
    <div class="row reg" style="margin-top: 20px;">
        <div class="col-xs-1"></div>
        <div class="col-xs-3 mid"><b>确认密码</b></div>
        <div class="col-xs-7"><input type="password" id="password2" class="form-control" placeholder="请确认密码"></div>
        <div class="col-xs-1"></div>
    </div>
    <div class="row" style="margin-top: 20px;margin-bottom: 4%;">
        <div class="col-xs-1"></div>
        <div class="col-xs-10">
            <button class="btn btn-lg" id="bindBtn" style="width: 100%;background: #0098FB;color: #fff;">确定</button>
        </div>
        <div class="col-xs-1"></div>
    </div>
    <a class="reg" href="javascript:action='login';$('.reg').hide();$('.log').show()" style="margin-left: 9%">已有账号？进行登录</a>
    <a class="log" href="javascript:action='register';$('.reg').show();$('.log').hide()" style="margin-left: 9%;display: none">返回</a>
<?php } ?>



<script src="<?=ROOT_URL?>/static/common/js/head.js"></script>
<script src="<?=ROOT_URL?>/static/common/js/util.js"></script>
<script src="<?=ROOT_URL?>/static/soft/index/js/myjs.js"></script>
<script>
    var baseUrl = '<?=ROOT_URL?>';
    var indexUrl = baseUrl+'/index.php';
    var today = parseInt('<?=strtotime(date("Y-m-d"));?>');

    head.js(
        "<?=ROOT_URL?>/static/soft/index/js/bind.js",
        function(){
            $("body > div").css("opacity",1);
            Bind.init();
        }
    );
</script>

</body>
</html>