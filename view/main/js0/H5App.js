const APP_EVENT_BEGIN_RIGHT_TO_LEFT = 'APP_EVENT_BEGIN_RIGHT_TO_LEFT';
const APP_EVENT_BEGIN_LEFT_TO_RIGHT = 'APP_EVENT_BEGIN_LEFT_TO_RIGHT';
const APP_EVENT_TRANSITION_END = 'APP_EVENT_TRANSITION_END';
const APP_EVENT_LOGOUT = 'APP_EVENT_LOGOUT';
const APP_EVENT_LOAD_SESSIONID = 'APP_EVENT_LOAD_SESSIONID';
var H5App = (function(_super){
    __extends(H5App, _super);
    function H5App(config){
        _super.init(this,config);
    }
    H5App.prototype.doPull = function(modal){
        console.log('do pull : '+modal);
        this.stacks.push(modal);
        var nextActive = this.getJqModal(modal);
        nextActive.show();
        this.loadModal(modal);
        app.publish(APP_EVENT_ANIMATION_BEGIN);
    };
    H5App.prototype.doAnimation = function(nowActive,nextActive){
        var self = this;
        setTimeout(function(){
            if(nextActive == self.getJqModal(self.stacks[self.stacks.length-3])){
                app.publish(APP_EVENT_BEGIN_LEFT_TO_RIGHT);

                //stacks - 2
                self.stacks.pop();
                self.stacks.pop();
            }else{
                app.publish(APP_EVENT_BEGIN_RIGHT_TO_LEFT);
            }
            self.isDoingAnimation = false;
            app.publish(APP_EVENT_ANIMATION_END);
        },(500));
    };
    H5App.prototype.hashChange = function(hash){
        app.publish(APP_EVENT_HASH_CHANGE);
        var self = this;
        if(this.stacks.length && hash == this.defaultHash){
            Message.dialog('提醒',"是否要退出应用程序",'确定','取消',function(){
                self.functionApi('die');
                Message.removeDialog();
            },function(){
                self.hashGoBack(self.lastHash);
                Message.removeDialog();
            });
        }else{
            this.lastHash = hash;
            this.pull(hash+'_vue');
        }
    };
    H5App.prototype.sectionTransitionEnd = function(event){
        var obj = event.target;
        if(event.propertyName == this.transitionName && obj.tagName == this.transitionTag.toUpperCase()){
            app.publish(APP_EVENT_TRANSITION_END);
        }
    };
    H5App.prototype.functionApi = function(func,callBack){
        if(typeof callBack == 'undefined'){
            callBack = '';
        }
        var url = "function://"+func+'-'+callBack;
        $('body').append('<iframe id="functionApi" class="disn" src="'+url+'"></iframe>');
        $('#functionApi').remove();
    };
    H5App.prototype.run = function(){
        console.log('the first hash is : '+this.defaultHash);
        location.hash = this.defaultHash;
    };
    return H5App;
}(App));