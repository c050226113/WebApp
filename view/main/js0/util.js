String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

Array.prototype.remove=function(dx) {
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
};

var Helper = {
    isMobileNumber : function(tel){
        if(!tel){
            return false;
        }
        var telReg = !!tel.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
        if (telReg == false) {
            return false;
        } else {
            return true;
        }
    },
    checkTwoPassword : function(password, password1){
        var allIsNumber = /^[0-9]{1,20}$/;//纯数字
        var allIsEn = /^[a-zA-Z]{1,20}$/;//纯数字
        var hasSpecial = /[^0-9a-zA-Z]/;//除英文和数字
        var six = /.{6,}/;//六位以上

        if (allIsNumber.exec(password) || allIsEn.exec(password) || hasSpecial.exec(password) || !six.exec(password)) {
            return ("密码为6位以上，带字母和数字！");
        }

        if (password != password1) {
            return ("两次输入的密码不一致！");
        }
        return true;
    },
    getLastChar:function(str){
        str = str.trim();
        return str.substr(str.length-1,str.length);
    },
    getJsonObj:function(str){
        return eval('('+str+')');
    },
    isWeChat:function(){
        if(window.navigator.userAgent.match(/MicroMessenger/i) == "MicroMessenger"){
            return true;
        }else{
            return false;
        }
    },
    isIos:function(){
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            return true;
        } else if (/android/.test(ua)) {
            return false;
        }
    },
    isAndroid:function(){
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            return false;
        } else if (/android/.test(ua)) {
            return true;
        }
    },
    hasObjKey:function(obj){
        var flag = false;
        for(var using in obj){
            flag = true;
            break;
        }
        return flag;
    },
    in_array:function(arr,val){
        for(var i=0;i<arr.length;i++){
            if(arr[i] == val){
                return true;
            }
        }
        return false;
    }
};

var Time = {
    getStramp : function(){
        var str = (new Date()).valueOf()+"";

        return parseInt(str.substr(0,str.length-3))
    },
    change : function(cha){
        var m = "分钟";
        var h = "小时";
        var d = "天";

        if(cha<=900){
            return 15+m;
        }else if(cha>900 && cha<=3600){
            return parseInt(cha/60)+m;
        }else if(cha>3600 && cha<=3600*24){
            return parseInt(cha/3600)+h;
        }else{
            return parseInt(cha/86400)+d;
        }
    },
    getLocalTime:function(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    },
    getCTSTime:function(year, month, date, hour, min, seconds){
        return Date.UTC(year, month, date, hour, min, seconds)-8*3600*1000
    }
};

var Message = {
    toastTimer : false,
    toast : function (str, time){
        if(this.toastTimer !== false){
            clearTimeout(this.toastTimer);
        }

        $("#toast").remove();
        $("body").append(
            '<div id="toast" class="pos_a" style="top:'+$(document).scrollTop()+'px;width:'+window.innerWidth+'px;height:'+window.innerHeight+'px"><div class="pos_r w100 h100">' +
            '<div class="span_box" style="text-align: center;width: 100%;height: 40px;line-height: 40px;overflow: auto;padding: 0 18px;margin: auto;position: absolute;top: 60%;left: 0;bottom: 0;right: 0;z-index: 99999999999;color: white;background: rgba(0,0,0,.8);">' +
            '<span style="line-height: 25px;display: inline-block;"></span>' +
            '</div></div></div>'
        );
        var toast = $("#toast");
        toast.show();
        toast.find("span").text(str);
        var width = toast.find("span").width();
        if(width>BasicTool.screenWidth){
            width = BasicTool.screenWidth*0.7;
            var height = toast.find("span").height();
            toast.find(".span_box").css("height",height);
        }
        toast.find(".span_box").css("width",width+60);
        toast.css({opacity: 1});
        if(!time){time = 2;}
        this.toastTimer = setTimeout(function () {
            toast.css("opacity", 0);
            setTimeout(function () {
                toast.remove();
            }, 500);
        }, time * 1000);
    },
    hasDialog : false,
    dialog:function(title,message,button1,button2,func1,func2){
        if($("#all_notice").html()){
            $("#all_notice").remove();
            $("#all_notice_cover").remove();
        }

        $("body").append(
        //    /transform:scale(1);
        '<div id="all_notice" style="transition:all .4s ease;overflow: hidden;background-color:#fff;z-index:9999;border-radius:10px;position:absolute;width:70%;left:0;right:0;top:0;bottom:0;margin:auto;opacity:0;height:186px;padding: 0;">' +
            '<div class="w100 pos_r" style="margin: 0;padding: 0;height: 120px">' +
                '<h1 class="txtc clbl" style="font-size: 131%;font-weight: 600;padding: 2% 0;">'+title+'</h1>' +
                '<p class="txtc clbl c w100" style="margin: 55px auto auto auto;padding:0 10%;position: relative;line-height: 21px;font-size: 15px;word-break: break-all;">'+message+'</p>' +
            '</div>' +
            '<div class="w50 fl txtc" id="all_notice_button1" style="height:45px;padding: 4%;font-size: 18px;color: #ccf;border-top: solid 1px #ddd;border-right: solid 1px #ddd;"><a>'+button1+'</a></div>' +
            '<div class="w50 fl txtc" id="all_notice_button2" style="height:45px;border-top: solid 1px #ddd;padding: 4%;font-size: 18px;color: #ccf;"><a>'+button2+'</a></div>' +
        '</div>' +
        '<div id="all_notice_cover" style="left:0;top:0;z-index:999;position:absolute;height: 100%;width: 100%;background-color: #000000;opacity: 0.6;"></div>'
        );
        var all_notice = $("#all_notice");
        var p = all_notice.find("p");

        p.css({
           'height': p.height()+'px',
            'position' : 'absolute'
        });

        setTimeout(function(){
            all_notice.css({
                //"transform": "scale(1)",
                "opacity": "1"
            });
        },22);

        Message.hasDialog = true;
        $("#all_notice").find("#all_notice_button1 a").on("click",func1);
        $("#all_notice").find("#all_notice_button2").on("click",func2);
        $("#all_notice_cover").on("click",function(){Message.removeDialog()});
    },
    removeDialog:function(){
        var dialog = $("#all_notice");
        var cover = $("#all_notice_cover");
        Message.hasDialog = false;
        dialog.css({
            //"transform": "scale(.9)",
            "opacity": "0"
        });
        setTimeout(function(){
            dialog.remove();
            cover.remove();
        },390);
    },
    showLoad:function(obj){
        obj.append('<div class="load pos_a h100 w100"><div class="cover h100 w100 pos_a"></div><div class="loading"><span>历史消息数据加载中</span><ul class="spinner"><li></li><li></li><li></li><li></li></ul></div></div>');
    }
};

var BasicTool = {
    screenHeight : document.body.clientHeight,
    screenWidth : document.body.clientWidth
};