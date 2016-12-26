
var app = {
    init : function(){
        //$("html").css({
        //    "font-size":BasicTool.screenWidth*0.037+"px"
        //
        //});
        //$("body").css({
        //    "font-size":BasicTool.screenWidth*0.037+"px"
        //});



        $(".w-h").each(function () {
            $(this).removeClass("w-h");
            var height = $(this).outerHeight();

            $(this).css("width", height + "px");
            $(this).css("height", height + "px");
        });



        $(".h-w").each(function () {
            $(this).removeClass("h-w");
            var width = $(this).outerWidth();

            $(this).css("height", width + "px");
            $(this).css("width", width + "px");
        });

        //设置vertical-align:virtule 的 line-height 属性
        $(".vtm").each(function () {
            $(this).removeClass("vtm");
            var height = $(this).parent().height();

            height = Math.floor(height);
            $(this).css({
                "line-height": height + "px"
            });
            $(this).children("*").css({
                "line-height": height + "px",
                "display" : "inline-block"
            });
        });

        //mid
        $(".mid").each(function () {
            $(this).removeClass("mid");
            var n_height = parseInt($(this).css("height"));
            var w_height = $(this).parent().height();
            $(this).css("margin-top", (w_height - n_height) / 2 + "px");
        });

        $(".disno").each(function(){
            $(this).removeClass("disno");
            $(this).hide();
        });
    },
    task:function(fn){
        setTimeout(fn,0);
    }
};

$(function(){
    app.init();
});





