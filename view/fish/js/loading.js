//开始预加载
function startPreload(manifest) {
    preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound); //注意加载音频文件需要此行代码
    // preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}
//处理单个文件加载
function handleFileLoad(event) {
    // console.log("文件类型: " + event.item.type);
    // if(event.item.id == "logo"){
    //     console.log("logo图片已成功加载");
    // }
}
//处理加载错误：大家可以修改成错误的文件地址，可在控制台看到此方法调用
function loadError(e) {
    // console.log("加载出错！", e.text);
}
//已加载完毕进度 
function handleFileProgress(e) {
    document.getElementById('loading').innerHTML = '已加载 ' + (preload.progress*100|0) + ' %';
}
//全度资源加载完毕
function loadComplete(e) {
    document.getElementById('loading').style.display = 'none'
}
manifest = [
    // picture
    {src: "res/background.jpg"},
    {src: "res/ui/left.png"},
    {src: "res/ui/right.png"},
    {src: "res/ui/ship.png"},
    {src: "res/ui/launch.png"},
    {src: "res/ui/rod.png"},
    {src: "res/ui/hook2.png"},
    {src: "res/ui/line2.png"},
    {src: "res/spine/yu01/yu01.png"},
    {src: "res/spine/yu02/yu02.png"},
    {src: "res/spine/yu03/yu03.png"},
    {src: "res/spine/yu04/yu04.png"},

    // sk
    {src: "res/spine/yu01/yu01.sk"},
    {src: "res/spine/yu02/yu02.sk"},
    {src: "res/spine/yu03/yu03.sk"},
    {src: "res/spine/yu04/yu04.sk"},
    // src js
    {src: "http://www.wan.com/tmp/libs1/laya.core.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.webgl.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.ani.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.filter.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.html.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.particle.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.tiledmap.js"},
    {src: "http://www.wan.com/tmp/libs1/laya.ui.js"},
    {src: "http://www.wan.com/tmp/libs1/matter.js"},
    {src: "http://www.wan.com/tmp/libs1/matter-RenderLaya.js"}
];
startPreload(manifest);