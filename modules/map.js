/**
 * Created by exialym on 2017/5/15 0015.
 */
let map = new BMap.Map("map", {});
map.centerAndZoom(new BMap.Point(-94.63548,39.118077), 5);
map.enableScrollWheelZoom();
let points = [];

function initPoints() {
  points = [];
  if (document.createElement('canvas').getContext) {
    for (let i = 0; i < window.gps.length; i++) {
      let pt = new BMap.Point(window.gps[i][1], window.gps[i][0]);
      points.push(new BMap.Marker(pt));
    }
    let options = {
      size: BMAP_POINT_SIZE_SMALL,
      shape: BMAP_POINT_SHAPE_STAR,
      color: '#d340c3'
    };
    var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:points});
    // let pointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
    // pointCollection.addEventListener('click', function (e) {
    //   alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
    // });
    // map.addOverlay(pointCollection);  // 添加Overlay
  } else {
    alert('请在chrome、safari、IE8+以上浏览器查看本示例');
  }
}
module.exports = {
  map : map,
  points : points,
  initPoints : initPoints,
};