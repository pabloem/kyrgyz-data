var years = kg_data.years,
    crops = kg_data.crops,
    more = kg_data.more,
    less = kg_data.less,
    kg_data = kg_data.data;

var lang = 'english',
    crop = 'potatoes',
    year = 2014,
    perc = true;
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

function get_data(item,year,lang,perc) {
  var data = [],
      crop, max, sum = 100;
  if(year === undefined) year = 2014;
  if(lang === undefined) lang = 'english';
  if(perc === undefined) perc = false;
  
  if(perc == true) {
    sum = 0;
    for(var ob in kg_data) {
      sum +=(kg_data[ob]['items'][item][year] || 0);
    }
  }
  var val, max_val = 0;
  for(ob in kg_data) {
    val = Math.round(kg_data[ob]['items'][item][year]/sum*1000)/10 || 0;
    if(val > max_val) max_val = val;
    data.push({"hc-key":ob, "value": val});
  }
  crop = crops[item][lang];
  max = perc === true ? max_val : crops[item]['max'];
  var label = perc === true ? " - (%)" : " - (VOL)";
  return {data:data, crop:crop, year:year,max:max,label:label};
}
function plotMap(fd) {
  var data = fd.data,
      dt_name = fd.crop,
      year = fd.year;
    $('#container').highcharts('Map', {
        title : {
          text : dt_name+" - "+year+fd.label
        },
        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/countries/kg/kg-all.js">Kyrgyzstan</a>'
        },
        colorAxis: {
          min: 0,
          max: fd.max*0.8,
          type: 'linear'
        },
        series : [{
            data : data,
            mapData: Highcharts.maps['countries/kg/kg-all'],
            joinBy: 'hc-key',
            name: dt_name,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
}
function togglePercentage() {
  perc = !perc;
  plotMap(get_data(crop,year,lang,perc));
}
function updateCrop(crp) {
  crop = crp;
  plotMap(get_data(crop,year,lang,perc));
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
  plotMap(get_data(crop,year,lang,perc));
  var cnt = 0;
  for(var cr in crops) {
    createCropButton(cr,crops[cr][lang]);
  }
  addMoreButton();
  toggleMore();
  $("#onoffperc").on('change',function() {togglePercentage();});
  $("#range-slider").on("change",function() {
    $("#year-input").val(this.value);
    year = this.value;
    plotMap(get_data(crop,year,lang,perc)); });
});
