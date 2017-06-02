/**
 * Created by exialym on 2017/5/17 0017.
 */
import eventDispatcher from './event'
module.exports = {
  changeDataList : changeDataList,
};


let $Datas = $('.datas');
let $Ops = $('.ops');
let $RightNav = $('.right-nav');
let $toggleExpand = $('#toggleListOpen');
let canExpend = false;

$toggleExpand.on('click',function(){
  if (canExpend) {
    $toggleExpand.html("can't expand");
  } else {
    $toggleExpand.html("can expand");
  }
  canExpend = !canExpend;
});

$('#table').on('click-row.bs.table',function(e,row,el){
  if ($(el).hasClass("chosen")) {
    eventDispatcher.emit('hover',[row.index],false,'list');
    $(el).removeClass('chosen');
  } else {
    eventDispatcher.emit('hover',[row.index],true,'list');
    $(el).addClass('chosen');
  }
});
$Datas.hover(function(){
  if (canExpend) {
    let tableWidth =$('#table').width();
    if (tableWidth>$('body').width()) {
      tableWidth = $('body').width();
    }
    $Datas.animate({
      width:tableWidth+'px'
    });
  }

},function(){
  if (canExpend) {
    $Datas.animate({
      width:$RightNav.width()+'px'
    });
  }

});

function changeDataList (indexes) {
  console.time("list:changeDataList:");
  // let html = "";
  // for ( let i = 0; i < indexes.length; i ++ ) {
  //   html += "<li data-index='"+ indexes[i] +"'>"
  //     +"<span>"+ indexes[i] +"</span>"
  //     +"<span>&"+ window.date[indexes[i]].slice(0,4) +"</span>"
  //     +"<span>&"+ window.gps[indexes[i]][0].slice(0,6) +"</span>"
  //     +"<span>&"+ window.gps[indexes[i]][1].slice(0,6) +"</span>"
  //     +"</li>";
  // }
  // $(".dataList").html(html);
  $Datas.height($RightNav.height()-$Ops.height());
  $Datas.width($RightNav.width());
  $Datas.css({top:($Ops.height()+$('header').outerHeight()+($RightNav.outerHeight()-$RightNav.height())/2)+'px'});
  let columns = [{
    field: 'index',
    title: 'index',
    sortable: true
  },{
    field: 'lng',
    title: 'lng',
    sortable: true
  },{
    field: 'lat',
    title: 'lat',
    sortable: true
  },{
    field: 'date',
    title: 'date',
    sortable: true
  }];
  for (let i = 0; i< window.colName.length;i++) {
    columns.push({
      field: window.colName[i],
      title: window.colName[i],
      sortable: true
    })
  }
  let data = [];

  for (let i = 0; i< indexes.length;i++) {
    let obj = {};
    obj.index = indexes[i];
    obj.date = window.date[indexes[i]].slice(0,4);
    obj.lng = window.gps[indexes[i]][0].slice(0,6);
    obj.lat = window.gps[indexes[i]][1].slice(0,6);
    for (let j = 0; j< window.colName.length;j++) {
      obj[window.colName[j]] = window.rawData[indexes[i]][j].toFixed(5);
    }
    data.push(obj);
  }
  $('#table').bootstrapTable('destroy').bootstrapTable({
    columns,
  });
  $('#table').bootstrapTable('load', data);

  console.timeEnd("list:changeDataList:");
}
function hoverData(indexes,hoverFlag,view) {
  if (view==='list') return;
  $('#table tr').each(function () {
    for (let k = 0; k < indexes.length;k++) {
      if ($(this).children().eq(0).html()==indexes[k]) {
        if (hoverFlag) {
          $(this).addClass('chosen');
        } else {
          $(this).removeClass('chosen');
        }
      }
    }

  });


}
eventDispatcher.on('hover',hoverData);
eventDispatcher.on('choose',changeDataList);