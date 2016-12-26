var JMString = {
    init:function(flag){
        var url;
        switch(flag){
            case "dddd":
                break;
            default :
                url = baseUrl+"/static/soft/language/js/china.js";
                break;
        }

        return url;
    },
    foreach:function(){
        $(".cstr").each(function(){$(this).removeClass("cstr").text(eval("Language."+$(this).data("str")));});
        $(".cplaceholder").each(function(){$(this).removeClass("cplaceholder").attr("placeholder",Language[$(this).data("str")]);});
    }
};