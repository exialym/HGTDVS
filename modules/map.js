/**
 * Created by exialym on 2017/5/15 0015.
 */
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
module.exports = {
  map : map,
  points : points,
  initPoints : initPoints,
  displayPoints : displayPoints,
};