// 定义自定义覆盖物的构造函数  
function SquareOverlay(center, zoom) {
    this._center = center;
    this._zoom = zoom;
}
// 继承API的BMap.Overlay  
SquareOverlay.prototype = new BMap.Overlay();

// 实现初始化方法  
SquareOverlay.prototype.initialize = function (map) {
    // 保存map对象实例  
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器  
    var div = document.createElement("div");
    div.id = "areas";
    div.style.width = "2000px";
    div.style.height = "2000px";
    div.style.position = "absolute";
    div.style.opacity = "0.7";
    // 将div添加到覆盖物容器中  
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例  
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show,hide方法，或者对覆盖物进行移除时，API都将操作此元素。  
    return div;
}
// 实现绘制方法  
SquareOverlay.prototype.draw = function () {
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - 1000 + "px";
    this._div.style.top = position.y - 1000 + "px";
    draw(this._zoom);
}

function drawmap() {
    var map = new BMap.Map("bdmap");
    var point = new BMap.Point(104.1, 30.6);
    map.centerAndZoom(point, 10);
    var mySquare = new SquareOverlay(point, map.getZoom());
    map.addOverlay(mySquare);
    map.addEventListener("zoomend", function (e) {
        map.clearOverlays();
        var mySquare = new SquareOverlay(point, map.getZoom());
        map.addOverlay(mySquare);

    });
    //添加控件
    map.addControl(new BMap.NavigationControl());

    var plys = [];
    var bdary = new BMap.Boundary();
    bdary.get("武侯区", function (rs) {
        var count = rs.boundaries.length;
        //建立多边形覆盖物
        for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {
                strokeWeight: 2,
                strokeOpacity: 0.8,
                StrokeStyle: "solid",
                strokeColor: "#1abc9c",
                fillColor: "#16a085",
                fillOpacity: 0.2
            });
            plys.push(ply);
            map.addOverlay(ply);  //添加覆盖物
        }
    });



}
window.onload = drawmap;