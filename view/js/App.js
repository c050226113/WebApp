var __extends = (this && this.__extends) ||
    function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];

        function __() {
            this.constructor = d
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __())
    };
const APP_EVENT_ANIMATION_END = 'APP_EVENT_ANIMATION_END';
const APP_EVENT_ANIMATION_BEGIN = 'APP_EVENT_ANIMATION_BEGIN';
const APP_EVENT_HASH_CHANGE = 'APP_EVENT_HASH_CHANGE';
var App = (function() {
    function App() {}
    App.init = function(self, config) {
        self.defaultHash = config['defaultHash'] || 'index';
        self.isDebug = config['isDebug'];
        self.transitionTag = config['transitionTag'] || 'section';
        self.transitionName = config['transitionName'] || 'all';
        self.transitionTime = config['transitionTime'] || '0';
        self.transitionType = config['transitionType'] || 'ease';
        self.projectName = config['projectName'] || 'webapp';

        App.reSetHash(self, '');

        App.initBind(self);

        App.initView(self);
    };
    App.initBind = function(child) {
        var self = child;
        $('body')[0].addEventListener("transitionend", function(event) {
            self.sectionTransitionEnd(event);
        });

        self.subscribe(APP_EVENT_ANIMATION_END, function() {
            if (self.oprationStacks.length) {
                console.log('opration modal : ' + self.oprationStacks[0]);
                setTimeout(function() {
                    self.pull(self.oprationStacks[0]);
                    self.oprationStacks.remove(0);
                }, 0);
            }
        });
    };
    App.initView = function(child) {
        var self = child;
        $(function() {
            if (self.transitionName && self.transitionTime && self.transitionType) {
                var transition = self.transitionName + ' ' + self.transitionTime + 's' + ' ' + self.transitionType;
                $(self.transitionTag).css({
                    'transition': transition,
                    '-webkit-transition': transition
                })
            }
        });
    };
    App.reSetHash = function(child, hash) {
        var self = child;
        var $obj = $(window);
        $obj.unbind('hashchange');
        location.hash = hash;
        setTimeout(function() {
            $obj.bind('hashchange', function() {
                var hash = location.hash.substr(1, location.hash.length - 1);
                if (!hash) {
                    return false;
                } else {
                    self.hashChange(hash);
                }
            });
        }, 100);
    };

    App.prototype.isDoingAnimation = false;
    App.prototype.oprationStacks = [];
    App.prototype.createTime = new Date();
    App.prototype.$modals = {};
    App.prototype.stacks = [];
    App.prototype.projectName = '';
    App.prototype.lastHash = '';
    App.prototype.loadJs = function(addr, func) {
        if (this.isDebug) {
            for (var i = 0; i < addr.length; i++) {
                addr[i] = addr[i] + '?time=' + this.createTime.getTime();
            }
        }
        if (func) {
            head.js(addr, func);
        } else {
            head.js(addr);
        }
    };
    App.prototype.loadCss = function(addr) {
        var addString = (this.isDebug) ? '?time=' + this.createTime.getTime() : '';
        var str = '';
        for (var i = 0; i < addr.length; i++) {
            str += '<link rel="stylesheet" href="' + addr[i] + addString + '" type="text/css"/>'
        }
        $('body').append(str);
    };
    App.prototype.getJqModal = function(modal) {
        if (!modal) {
            return '';
        } else {
            if (this.$modals[modal]) {
                return this.$modals[modal];
            } else {
                var obj = $('#' + modal);
                this.$modals[modal] = obj;
                return obj;
            }
        }
    };
    App.prototype.pull = function(modal) {
        if (this.isDoingAnimation) {
            this.oprationStacks.push(modal);
            return false;
        } else {
            //开始动画
            this.isDoingAnimation = true;
            this.doPull(modal);
        }
    };
    App.prototype.loadModal = function(modal) {
        var self = this;
        var isFirst = false;

        try {
            if (!eval(modal + ".$el")) {
                throw new SQLException;
            } else {
                try {
                    eval(modal + ".init()");
                } catch (e) {}
            }
        } catch (e) {
            isFirst = true;
            try {
                eval('new ' + modal + '()');
            } catch (e) {}
        }
        self.doAnimation(self.getJqModal(self.stacks[self.stacks.length - 2]), self.getJqModal(self.stacks[self.stacks.length - 1]), isFirst);
    };
    App.prototype.log = function(str) {
        if (this.isDebug) {
            console.log(str);
        }
    };
    App.prototype.hashGoBack = function(hash) {
        App.reSetHash(this, hash);
    };
    App.prototype.subscribe = function(str, func) {
        $('title').bind(str, func);
    };
    App.prototype.publish = function(str, param) {
        if (param) {
            try {
                eval('app.isHappening(str,param)');
            } catch (e) {}
        }

        $('title').trigger(str);
    };
    App.prototype.unSubscribe = function(str) {
        $('title').unbind(str);
    };
    return App;
}());
var IApp = ['init', 'doPull', 'hashChange', 'sectionTransitionEnd'];