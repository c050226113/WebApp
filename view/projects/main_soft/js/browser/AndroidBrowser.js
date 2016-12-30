var AndroidBrowser = (function() {
    function AndroidBrowser(){}

    AndroidBrowser.prototype.setUserPosition = function(res){
        alert(res);
        var WIFI = '1';
        var JIZHAN = '2';
        try{
            var obj = JSON.parse(res);
            alert(obj.code);
            if(obj.code){
                res = obj.msg;
                if(!res){
                    throw new SQLException;
                }
                alert(res);
                switch (obj.code){
                    case WIFI:
                        var arr = res.split(",");
                        try {
                            var arr_1 = arr[1] + '';//BSSID:bo:ods:asd:daf:
                            var string = arr_1.substr(7, 20);//bo:ods:asd:daf
                            alert(string);
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

    return AndroidBrowser;
}());

