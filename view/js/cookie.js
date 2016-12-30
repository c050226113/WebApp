var Cookie = {
    setCookie: function(name, value, iDay) {
        var cookieStr = '';
        if (iDay == undefined) {
            cookieStr += name + '=' + value + ';'
        } else {
            var exp = new Date();
            exp.setTime(exp.getTime() + iDay);
            cookieStr += name + '=' + value + ';expires=' + exp.toGMTString()
        }
        document.cookie = cookieStr
    },
    getCookie: function(name) {
        var arr = document.cookie.split(';');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0].trim() == name) {
                return arr2[1]
            }
        }
        return ''
    },
    removeCookie: function(name) {
        this.setCookie(name, '1', -100)
    },
    removeAllCookie: function() {
        var arr = document.cookie.split(';');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            this.setCookie(arr2[0].trim(), '1', -100)
        }
    }
};