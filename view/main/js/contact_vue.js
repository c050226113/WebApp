var contact_vue = new Vue({
    el:'#contact_vue',
    created:function () {},
    compiled:function () {
        this.initView();
    },
    data: {
        map:null
    },
    methods: {
        initView:function(){
            this.map = new BMap.Map("map");
            var poi = new BMap.Point(113.869245, 22.573342);
            this.map.centerAndZoom(poi, 19);
            this.map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
            this.map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的
            //this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

            var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
                '<img src="./img/erweima.png" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
                '<b>地址</b>：深圳市宝安区宝源路1065号F518时尚创意园F17栋101、102<br/>' +
                '<b>电话</b>：0755-26804567 26804008<br/>' +
                '<b>传真</b>：0755-26804588<br/>' +
                '<b>客服</b>：400-8835-933（工作日9:00-18:30）<br/>' +
                '<b>经销合作</b>：梁总 18682328171<br/>' +
                '</div>';

            //创建检索信息窗口对象
            var searchInfoWindow = new BMapLib.SearchInfoWindow(this.map, content, {
                title  : "深圳腾家科技有限公司",      //标题
                width  : 375,             //宽度
                height : 160,              //高度
                panel  : "panel",         //检索结果面板
                enableAutoPan : true,     //自动平移
                searchTypes   :[
                    BMAPLIB_TAB_SEARCH,   //周边检索
                    BMAPLIB_TAB_TO_HERE,  //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            });
            var marker = new BMap.Marker(poi); //创建marker对象
            marker.addEventListener("click", function(e){
                openInfoWindow1();
            });
            this.map.addOverlay(marker); //在地图中添加marker


            //样式1
            var searchInfoWindow1 = new BMapLib.SearchInfoWindow(this.map, content, {
                title: "深圳腾家科技有限公司", //标题
                panel : "panel", //检索结果面板
                enableAutoPan : true, //自动平移
                searchTypes :[
                    BMAPLIB_TAB_FROM_HERE, //从这里出发
                    BMAPLIB_TAB_SEARCH   //周边检索
                ]
            });
            function openInfoWindow1() {
                searchInfoWindow1.open(poi);
            }
            //样式2
            var searchInfoWindow2 = new BMapLib.SearchInfoWindow(this.map, "信息框2内容", {
                title: "信息框2", //标题
                panel : "panel", //检索结果面板
                enableAutoPan : true, //自动平移
                searchTypes :[
                    BMAPLIB_TAB_SEARCH   //周边检索
                ]
            });
            function openInfoWindow2() {
                searchInfoWindow2.open(new BMap.Point(116.324852,40.057031));
            }
            //样式3
            var searchInfoWindow3 = new BMapLib.SearchInfoWindow(this.map, "信息框3内容", {
                title: "信息框3", //标题
                width: 290, //宽度
                height: 40, //高度
                panel : "panel", //检索结果面板
                enableAutoPan : true, //自动平移
                searchTypes :[
                ]
            });
            function openInfoWindow3() {
                searchInfoWindow3.open(new BMap.Point(116.328852,40.057031));
            }
        }
    }
});