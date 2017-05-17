/**
 * Created by exialym on 2017/2/16.
 */
module.exports.readRawFile = function (txt) {

  let res = {
    isValid:true,
    error:'',
    data:[],
    gps:[],
    date:[],
  };
  let lines = txt.split("\n");
  let data = [];
  let len = -1;
  for(let i = 1;i < lines.length;i++) {
    let row = lines[i];
    if (! /\S/.test(row)) {
      // row is empty and only has whitespace
      continue;
    }
    let cells = row.split(',');
    let point = [];
    let gpsTemp = [];
    for(let j = 1;j < cells.length;j++) {
      if (j===1) gpsTemp.push(cells[j]);
      else if (j===2) gpsTemp.push(cells[j]);
      else if (j===3) res.date.push(cells[j]);
      else {
        point.push(parseFloat(cells[j]));
      }
    }
    // let dl = point.length;
    // if(i === 0) { len = dl; }
    // if(len !== dl) {
    //   // TROUBLE. Not all same length.
    //   res.error = 'TROUBLE: row ' + i + ' has bad length ' + len;
    //   len = dl; // hmmm...
    //   res.isValid = false;
    //   return res;
    // }
    data.push(point);
    res.gps.push(gpsTemp);
  }
  res.data = data; // set global

  return res;
};
module.exports.readEmbeddingFile = function (txt) {

  let res = {
    isValid:true,
    error:'',
    data:[],
    gps:[],
    date:[],
    embedding:[],
  };
  let lines = txt.split("\n");
  let data = [];
  let len = -1;
  for(let i = 1;i < lines.length;i++) {
    let row = lines[i];
    if (! /\S/.test(row)) {
      // row is empty and only has whitespace
      continue;
    }
    let cells = row.split(',');
    let point = [];
    let gpsTemp = [];
    let embeddingTemp = [];
    for(let j = 1;j < cells.length;j++) {
      if (j===1) gpsTemp.push(cells[j]);
      else if (j===2) gpsTemp.push(cells[j]);
      else if (j===3) res.date.push(cells[j]);
      else if (j===4) embeddingTemp.push(cells[j]);
      else if (j===5) embeddingTemp.push(cells[j]);
      else if (j===6) embeddingTemp.push(cells[j]);
      else {
        point.push(parseFloat(cells[j]));
      }
    }
    data.push(point);
    res.gps.push(gpsTemp);
    res.embedding.push(embeddingTemp);
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


