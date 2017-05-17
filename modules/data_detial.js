/**
 * Created by exialym on 2017/5/17 0017.
 */
import eventDispatcher from './event'
let changeDataList = function(indexes) {
  console.time("changeDataList:");
  let html = "";
  for ( let i = 0; i < indexes.length; i ++ ) {
    html += "<li data-index='"+ indexes[i] +"'>"
      +"<span>"+ indexes[i] +"</span>"
      +"<span>&"+ window.date[indexes[i]].slice(0,4) +"</span>"
      +"<span>&"+ window.gps[indexes[i]][0].slice(0,6) +"</span>"
      +"<span>&"+ window.gps[indexes[i]][1].slice(0,6) +"</span>"
      +"<button class='btn btn-xs'>detail</button>"
      +"</li>";
  }
  $(".dataList").html(html);
  console.timeEnd("changeDataList:");
};
function hoverData(index,hoverFlag,view) {
  if (view==='list') return;
  if (hoverFlag) {
    $(".dataList [data-index=\""+index+"\"]").addClass('hover');
  } else {
    $(".dataList li").removeClass('hover');
  }

}
eventDispatcher.on('hover',hoverData);
eventDispatcher.on('choose',changeDataList);