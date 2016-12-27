
var Browser = (function() {
    function Browser(){

    }

    //self.androidFunction = function(func){
    //    return eval("phoneJS."+func+"()");
    //};
    //
    //self.inputBlur=function(){
    //    app.focusInput.blur();
    //};
    //
    //this.inputObj = $('.showKeyboard');
    //this.inputEvent = function(){
    //    this.inputObj.bind('focus',function(){
    //        app.hasKeyBoard = true;
    //        app.focusInput = $(this);
    //    }).bind('blur',function(){
    //        app.hasKeyBoard = false;
    //    });
    //};
    //
    //this.initBind = function(){
    //    console.log('android inputEvent');
    //    this.inputEvent();
    //};
    //this.init = function(){
    //    console.log('android bind');
    //    this.initBind();
    //};
    //this.init();

    Browser.prototype.setUserPosition = function(res){
        var WIFI = '1';
        var JIZHAN = '2';
        try{
            var obj = JSON.parse(res);
            if(obj.code){
                res = obj.msg;
                if(!res){
                    throw new SQLException;
                }

                switch (obj.code){
                    case WIFI:
                        var arr = res.split(",");
                        try {
                            var arr_1 = arr[1] + '';//BSSID:bo:ods:asd:daf:
                            var string = arr_1.substr(7, 20);//bo:ods:asd:daf
                        } catch (err) {
                            Message.toast(err, 4);
                            return false;
                        }

                        launcher_vue.setLocationWithWifi(string);
                        break;
                    case JIZHAN:
                        launcher_vue.setLocationWithJiZhan(res);
                        break;
                }
            }else{
                throw new EventException;
            }
        }catch (e){
            Message.toast('定位功能被禁用！',2);
        }
    };

    return Browser;
}());

