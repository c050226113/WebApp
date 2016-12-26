var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var indexUI = (function (_super) {
        __extends(indexUI, _super);
        function indexUI() {
            return _super.call(this) || this;
        }
        indexUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.indexUI.uiView);
        };
        return indexUI;
    }(View));
    indexUI.uiView = { "type": "View", "props": { "width": 750, "height": 1206 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "background.jpg" }, "child": [{ "type": "Image", "props": { "y": 57, "x": 231, "skin": "ui/ship.png" } }, { "type": "Image", "props": { "y": 1027, "x": 50, "skin": "ui/left.png" } }, { "type": "Image", "props": { "y": 1028, "x": 302, "skin": "ui/right.png" } }, { "type": "Image", "props": { "y": 1001, "x": 511, "skin": "ui/launch.png" } }, { "type": "Image", "props": { "y": 311, "x": 448, "skin": "ui/hand.png" } }] }] };
    ui.indexUI = indexUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map