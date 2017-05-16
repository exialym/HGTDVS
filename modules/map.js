/**
 * Created by exialym on 2017/5/15 0015.
 */
import eventDispatcher from './event'
let map = new BMap.Map("map", {});
map.centerAndZoom(new BMap.Point(-94.63548,39.118077), 5);
map.enableScrollWheelZoom();
let points = [];
let markerClusterer = null;
let options = {
  size: BMAP_POINT_SIZE_SMALL,
  shape: BMAP_POINT_SHAPE_STAR,
  color: '#d340c3'
};
function initPoints() {
  points = [];
  for (let i = 0; i < window.gps.length; i++) {
    let pt = new BMap.Point(window.gps[i][1], window.gps[i][0]);
    points.push(pt);
  }
  displayPoints([]);
}
function displayPoints(indexes)  {
  if (markerClusterer) {
    markerClusterer.clearMarkers();
  }
  let markers = [];
  if (indexes.length===0) {
    for (let i = 0; i < points.length; i++) {
      markers.push(new BMap.Marker(points[i]));
    }
  } else {
    for (let i = 0; i < indexes.length; i++) {
      markers.push(new BMap.Marker(points[indexes[i]]));
    }
  }
  markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
  // let pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
  // pointCollection.addEventListener('click', function (e) {
  //   alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
  // });
  // map.addOverlay(pointCollection);  // 添加Overlay
}

//回调获得覆盖物信息
let overlaycomplete = function(e){
  let left = Math.min(e.overlay.po[0].lat,e.overlay.po[1].lat,e.overlay.po[2].lat,e.overlay.po[3].lat);
  let right = Math.max(e.overlay.po[0].lat,e.overlay.po[1].lat,e.overlay.po[2].lat,e.overlay.po[3].lat);
  let top = Math.min(e.overlay.po[0].lng,e.overlay.po[1].lng,e.overlay.po[2].lng,e.overlay.po[3].lng);
  let bottom = Math.max(e.overlay.po[0].lng,e.overlay.po[1].lng,e.overlay.po[2].lng,e.overlay.po[3].lng);
  let chosenIndexes = [];
  for (let i = 0; i < points.length;i++) {
    if (points[i].lat<=right&&points[i].lat>=left&&points[i].lng<=bottom&&points[i].lng>=top) {
      chosenIndexes.push([i]);
    }
  }
  eventDispatcher.emit('choose',chosenIndexes,'map');
  e.overlay.remove();
};

let styleOptions = {
  strokeColor:"#19a1f2",    //边线颜色。
  fillColor:"#19a1f2",      //填充颜色。当参数为空时，圆形将没有填充效果。
  strokeWeight: 2,       //边线的宽度，以像素为单位。
  strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
  fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
  strokeStyle: 'solid' //边线的样式，solid或dashed。
};
//实例化鼠标绘制工具
let drawingManager = new BMapLib.DrawingManager(map, {
  isOpen: false, //是否开启绘制模式
  enableDrawingTool: true, //是否显示工具栏

  drawingToolOptions: {
    drawingModes : [BMAP_DRAWING_RECTANGLE],
    anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
    offset: new BMap.Size(5, 5), //偏离值
    scale: 0.8 //工具栏缩放比例
  },
  rectangleOptions: styleOptions //矩形的样式
});


//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
eventDispatcher.on('choose',displayPoints);
module.exports = {
  map : map,
  points : points,
  initPoints : initPoints,
  displayPoints : displayPoints,
};