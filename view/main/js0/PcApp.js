var PcApp = (function(_super){
    __extends(PcApp, _super);
    function PcApp(config){
        _super.init(this,config);
    }
    PcApp.prototype.doPull = function(modal){
        this.stacks.push(modal);

        var nowActive,nextActive,firstLoad = false,self = this;
        nextActive = this.getJqModal(modal);
        nextActive.show();
        nextActive.css({
            'display':'block',
            'z-index':++this.zindex
        });
        nowActive = (this.stacks.length>1)?this.getJqModal(this.stacks[this.stacks.length-2]):'';
        app.publish(APP_EVENT_ANIMATION_BEGIN);

        try{
            eval(modal+".init()");
        }catch (e){}
        try{
            if(!eval(modal+".$el")){
                throw new DOMException();
            }else{
                self.doAnimation(nowActive,nextActive,firstLoad);
            }
        }catch (e){//第一次载入
            firstLoad = true;
            var addString = (this.isDebug)? '?time=' + this.createTime.getTime():'';
            this.loadJs(["./js/"+modal+".js"+addString],function(){
                self.doAnimation(nowActive,nextActive,firstLoad);
            });
        }
    };
    PcApp.prototype.doAnimation = function(nowActive,nextActive,firstLoad){
        var self = this;
        setTimeout(function(){
            if(nowActive){
                nowActive.css(self.transitionName,'0');
            }
            nextActive.css(self.transitionName,'1');
            app.publish(APP_EVENT_ANIMATION_END);
            self.isDoingAnimation = false;
        },(firstLoad?50:20));
    };
    PcApp.prototype.hashChange = function(){
        var id = location.hash.split('#')[1];
        app.publish(APP_EVENT_HASH_CHANGE);
        this.pull(id+'_vue');
    };
    PcApp.prototype.sectionTransitionEnd = function(event){
        var obj = event.target;
        if(event.propertyName == this.transitionName && obj.tagName == this.transitionTag.toUpperCase()){
            var $obj = $(obj);
            if($obj.css(this.transitionName) < 0.1){
                $obj.hide();
            }
        }
    };
    PcApp.prototype.run = function(){
        console.log( Cookie.getCookie('hash') || this.defaultHash);
        location.hash = Cookie.getCookie('hash') || this.defaultHash;
    };
    return PcApp;
}(App));
