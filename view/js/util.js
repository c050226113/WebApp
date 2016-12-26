// http://spin.js.org/#v2.3.2
!function(a,b){"object"==typeof module&&module.exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return m[e]||(k.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",k.cssRules.length),m[e]=1),e}function d(a,b){var c,d,e=a.style;if(b=b.charAt(0).toUpperCase()+b.slice(1),void 0!==e[b])return b;for(d=0;d<l.length;d++)if(c=l[d]+b,void 0!==e[c])return c}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}k.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.scale*d.width,left:d.scale*d.radius,top:-d.scale*d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.scale*(d.length+d.width),k=2*d.scale*j,l=-(d.width+d.length)*d.scale*2+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k,l=["webkit","Moz","ms","O"],m={},n={lines:12,length:7,width:5,radius:10,scale:1,corners:1,color:"#000",opacity:.25,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",shadow:!1,hwaccel:!1,position:"absolute"};if(h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=a(null,{className:d.className});if(e(f,{position:d.position,width:0,zIndex:d.zIndex,left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.scale*(f.length+f.width)+"px",height:f.scale*f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.scale*f.radius+"px,0)",borderRadius:(f.corners*f.scale*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.scale*f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),"undefined"!=typeof document){k=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}();var o=e(a("group"),{behavior:"url(#default#VML)"});!d(o,"transform")&&o.adj?i():j=d(o,"animation")}return h});
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

Number.prototype.addZ = function () {
    var int = parseInt(this);
    if(int < 10){
        return '0'+this;
    }else{
        return this+'';
    }
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
        var maxWidth = BasicTool.screenWidth*0.7;
        if(width>maxWidth){
            var height = toast.find("span").height()*Math.ceil(width/maxWidth);
            toast.find(".span_box").css("height",height);
            width = maxWidth;
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
    },
    showWait:function(str){
        this.removeWait();
        var template = `
                <div id="waitTip" class="pos_a w100 h100 t0 l0" style="z-index: 999;">
                    <img class="pos_a w100 h100 t0 l0" src="./img/s.png" />
                    <div class='content c pos_a' style="border-radius: 15px;width: 100px;height: 100px;">
                        <div class"pos_a w100 t0 l0" style="border-radius: 15px;background-color: #000;opacity: .7;height:100%"></div>
                        <div class="pos_a t0 l0 w100 h70">

                        </div>
                        <div class="pos_a b0 l0 w100 h30 txtc clwh">
                            `+str+`
                        </div>
                    </div>
                </div>
            `;
        $('body').append(template);
        var opts = {
            lines: 13 // The number of lines to draw
            , length: 28 // The length of each line
            , width: 14 // The line thickness
            , radius: 48 // The radius of the inner circle
            , scale: 0.25 // Scales overall size of the spinner
            , corners: 1 // Corner roundness (0..1)
            , color: '#fff' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1.1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '50%' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'absolute' // Element positioning
        };
        var spinner = new Spinner(opts).spin();
        $('#waitTip div.h70').append(spinner.el);
    },
    removeWait:function(){
        try{
            $('#waitTip').remove();
        }catch (e){}
    }
};

var BasicTool = {
    screenHeight : document.body.clientHeight,
    screenWidth : document.body.clientWidth
};