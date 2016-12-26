
function AndroidBrowser(self) {
    self.UNAVALIABLE = '0';
    self.WIFI = '1';
    self.JIZHAN = '2';
    self.userLocationType = '';


    self.androidFunction = function(func){
        return eval("phoneJS."+func+"()");
    };

    self.inputBlur=function(){
        app.focusInput.blur();
    };

    this.inputObj = $('.showKeyboard');
    this.inputEvent = function(){
        this.inputObj.bind('focus',function(){
            app.hasKeyBoard = true;
            app.focusInput = $(this);
        }).bind('blur',function(){
            app.hasKeyBoard = false;
        });
    };

    this.initBind = function(){
        console.log('android inputEvent');
        this.inputEvent();
    };
    this.init = function(){
        console.log('android bind');
        this.initBind();
    };
    this.init();
    implement(self,[IH5App]);
}

self.setUserPosition = function(res){
    if(this.userLocationType){
        if(this.userLocationType == this.WIFI){
            var arr = res.split(",");
            try {
                var arr_1 = arr[1] + '';//BSSID:bo:ods:asd:daf:
                var string = arr_1.substr(7, 20);//bo:ods:asd:daf
            } catch (err) {
                Message.toast(err, 4);
                return false;
            }

            var dataStr = '{' +
                '"'+CODE+'":"'+string+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_position_with_wifi', data: Helper.getJsonObj(dataStr), dataType: 'json',
                success: function (data) {
                    if (data[CODE] == 0) {
                        index.userPlace = data[MESSAGE];
                    } else {
                        Message.toast(data[MESSAGE], 4);
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(errorThrown, 2);
                }
            });
        }else if(this.userLocationType == this.JIZHAN){
            var dataStr1 = '{' +
                '"'+CODE+'":"'+res+'",' +
                '"sessionId":"'+app.sessionId+'"' +
                '}';
            $.ajax({type: 'post', url: app.API_URL+'?r=main_soft/get_position_with_baseStation', data: Helper.getJsonObj(dataStr1), dataType: 'json',
                success: function (data) {
                    if (data[CODE] == 0) {
                        index.userPlace = data[MESSAGE];
                    } else {
                        Message.toast(data[MESSAGE], 4);
                        return false;
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Message.toast(errorThrown, 2);
                }
            });
        }
    }else{
        Message.toast('定位功能被禁用！',3);
    }
};