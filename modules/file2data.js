/**
 * Created by exialym on 2017/2/16.
 */
module.exports.readRawFile = function (txt) {
  // var promise = new Promise(function (resolve, reject) {
  //
  // });
  let res = {
    isValid:true,
    error:'',
    data:[],
  };
  let lines = txt.split("\n");
  let data = [];
  let len = -1;
  for(let i = 0;i < lines.length;i++) {
    let row = lines[i];
    if (! /\S/.test(row)) {
      // row is empty and only has whitespace
      continue;
    }
    let cells = row.split(',');
    let point = [];
    for(let j = 0;j < cells.length;j++) {
      if(cells[j].length !== 0) {
        point.push(parseFloat(cells[j]));
      }
    }
    let dl = point.length;
    if(i === 0) { len = dl; }
    if(len !== dl) {
      // TROUBLE. Not all same length.
      res.error = 'TROUBLE: row ' + i + ' has bad length ' + len;
      len = dl; // hmmm...
      res.isValid = false;
      return res;
    }
    data.push(point);
  }
  res.data = data; // set global
  return res;
};



// function preProLabels() {
//   var txt = $("#inlabels").val();
//   var lines = txt.split("\n");
//   labels = [];
//   for(var i=0;i<lines.length;i++) {
//     var row = lines[i];
//     if (! /\S/.test(row)) {
//       // row is empty and only has whitespace
//       continue;
//     }
//     labels.push(row);
//   }
// }


