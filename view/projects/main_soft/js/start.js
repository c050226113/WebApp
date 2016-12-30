var app = new H5App({
    'isDebug' : false,
    'projectName' : 'webapp',
    'defaultHash' : 'launcher',
    'transitionTag' : 'section',
    'transitionName' : 'transform',
    'transitionTime' : '0.3',
    'transitionType' : 'ease-in-out'
});

//延时加载
const BEGIN_DOWNLOAD_RESOURCE = 'BEGIN_DOWNLOAD_RESOURCE';
app.subscribe(BEGIN_DOWNLOAD_RESOURCE,function(){
    $('img').each(function(){
        var src = $(this).attr('data-src');
        if(src){
            $(this).attr('src',src);
        }
    });
});

app.isHappening = function(str,param){
    switch (str){
        case APP_EVENT_CHANGE_SESSION:
            this.sessionId = param;
            break;
        default :
            break;
    }
};
app.subscribe(APP_EVENT_CHANGE_SESSION,function(){
    Cookie.setCookie("sessionId",app.sessionId,3600*1000);
});
app.subscribe(APP_EVENT_LOAD_SESSIONID,function(){
    Cookie.removeCookie('sessionId');
    $.ajax({type: 'get', url: app.API_URL, dataType: 'text',
        success: function (data) {
            if(data.length==32){
                app.publish(APP_EVENT_CHANGE_SESSION,data);
            }else{
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            location.reload();
        }
    });
});
app.subscribe(APP_EVENT_ANIMATION_BEGIN, function(){//APP_EVENT_ANIMATION_BEGIN => will move
    var nextActive = app.getJqModal(app.stacks[app.stacks.length-1]);
    if(nextActive.attr('data-isActive') != 1){//下一个active 不在 stacks中 说明 是 right2left
        console.log('r2l');
        nextActive.css('z-index',++app.maxZindex);
    }
});
app.subscribe(APP_EVENT_BEGIN_RIGHT_TO_LEFT,function(){
    var nextActive = app.getJqModal(app.stacks[app.stacks.length-1]);
    var nowActive = app.getJqModal(app.stacks[app.stacks.length-2]);
    if(nowActive){
        nowActive.attr('data-willHide',1);//第一次回没有对象
    }
    nextActive.attr('data-isActive',1);
    nextActive.css({
        'transform':'translate3d(0,0,0)',
        '-webkit-transform':'translate3d(0,0,0)'
    });
});
app.subscribe(APP_EVENT_BEGIN_LEFT_TO_RIGHT,function(){
    var nowActive = app.getJqModal(app.stacks[app.stacks.length-2]);
    nowActive.attr('data-willHide',1);
    nowActive.css({
        'transform':'translate3d('+BasicTool.screenWidth+'px,0,0)',
        '-webkit-transform':'translate3d('+BasicTool.screenWidth+'px,0,0)'
    });
});
app.subscribe(APP_EVENT_TRANSITION_END,function(){
    $(app.transitionTag+'[data-willHide="1"]').attr('data-willHide',0).hide();
    app.isDoingAnimation = false;
    app.publish(APP_EVENT_ANIMATION_END);
});
app.subscribe(APP_EVENT_LOGOUT,function(){
    app.isLogingout = true;
    location.hash='login';
    Cookie.removeCookie("sessionId");
    app.publish(APP_EVENT_LOAD_SESSIONID);
    app.sessionId = '';
    localStorage.setItem('using','');
});

//初始化 需要的变量
app.maxZindex = 99;
app.API_URL = ((location.href.split(app.projectName)[0] == location.href)?'':location.href.split(app.projectName)[0]) + app.projectName+'/index.php';
console.log('app_API_URL:'+app.API_URL);
if(!(app.sessionId = Cookie.getCookie("sessionId"))){
    console.log('has not sessionId');
    app.publish(APP_EVENT_LOAD_SESSIONID)
}else{
    console.log('has the sessionId');
}

if(Helper.isWeChat()){
    app.browser = new AndroidBrowser();
}else if(Helper.isIos()){
    app.browser = new AndroidBrowser();
}else if(Helper.isAndroid()){
    app.browser = new AndroidBrowser();
}else{
    includeFile = 'Browser';
}
var timer = setInterval(function(){
    if(app.sessionId){
        clearInterval(timer);
        console.log('app run with:' + app.sessionId);
        app.run();
        app.publish(BEGIN_DOWNLOAD_RESOURCE);
        app.unSubscribe(BEGIN_DOWNLOAD_RESOURCE);
    }
},600);