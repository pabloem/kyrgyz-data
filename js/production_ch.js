var years = kg_data.years,
    crops = kg_data.crops,
    more = kg_data.more,
    less = kg_data.less,
    units = kg_data.units,
    kg_data = kg_data.data;

var lang = 'english',
    crop = 'potatoes',
    perc = true,
    ctx, myLineChart, curChart;

var title = {
  'english': 'Product: ',
  'russian': 'Производство: ',
  'kyrgyz': 'Өндүрүү: '
};
var source = {
  'english': 'Source: Stat. Committee of K.R.',
  'russian': 'Источник: Статистический Комитет КР',
  'kyrgyz': 'Булак: КР Улуттук статистика комитети'
};
function parse(val) {
    var result,
        tmp = [];
  location.search
    //.replace ( "?", "" )
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      console.log(tmp);
      if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
function get_oblast_crop_list(oblast,crop) {
  var res = [];
  for(var i = 0; i < years.length; i++) {
    res.push(kg_data[oblast]['items'][crop][years[i]] || 0);
  }
  return res;
}

function refreshChart(crop,language,first) {
  var chart_data = {labels: years},
      datasets = [], ds, cnt=0,
      unit = units['default'][language];
  if(units[crop] !== undefined) {
    unit = units[crop][language];
  }
  $('#title').html(title[language]+crops[crop][language]+" ("+unit+")");
  for(var ob in kg_data) {
    ds = {};
    ds.label = kg_data[ob][language];
    ds.data = get_oblast_crop_list(ob,crop);
    ds.strokeColor = colors[cnt];
    ds.pointColor = colors[cnt++];
    datasets.push(ds);
  }
  chart_data.datasets = datasets;
  if(curChart) curChart.destroy();
  curChart = myLineChart.Line(chart_data,{bezierCurve:false, datasetFill: false,
                                          pointDotRadius: 2,
                                          tooltipTemplate: "<%%><%=label%>: <%%><%= value %>",
                                          multiTooltipTemplate: "<%%><%=datasetLabel%>: <%%><%= value %>",
                                          showTooltips: true, scaleLabel: "<%= '  '+value%>",
                                         });
  if(first) {
    var legend = curChart.generateLegend();
    $('#legend').append(legend);
  }
  return(curChart);
}

function updateCrop(crp) {
  crop = crp;
  refreshChart(crop,lang);
}
function createCropButton(crop_id,label) {
  var str = "<button class=\"pure-button pure-button-primary\" onclick=\"updateCrop('"+crop_id+"');\">"+label+"</button>",
      temp = document.createElement('span');
  temp.innerHTML = str;
  temp.className = "button-span";
  document.getElementById("buttons").appendChild(temp);
}
function addMoreButton() {
  var str = "<button class=\"pure-button\" onclick=\"toggleMore();\">"+more[lang]+"</button>",
      temp = document.createElement('span');
  temp.innerHTML = str;
  temp.className = "button-span";
  document.getElementById("buttons").appendChild(temp);
}
function toggleMore() {
  var list = $("#buttons").children(),
      last = list.length - 1;
  list.each(function(i) {
    if(i < 5 || i == last) return;
    $(this).toggle();
  });
}
$(function () {
  lang = parse('lang') || 'english';
  var cnt = 0;
  for(var cr in crops) {
    createCropButton(cr,crops[cr][lang]);
  }
  addMoreButton();
  toggleMore();
  document.getElementById("citation").innerHTML = source[lang];
  ctx = document.getElementById("container").getContext("2d");
  myLineChart = new Chart(ctx);
  refreshChart(crop,lang,true);
});
