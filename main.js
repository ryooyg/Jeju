
// const map = new naver.maps.Map('map', {
//   mapTypeId: 'normal',
//   center: new naver.maps.LatLng(33.5507, 126.5706),
//   zoom: 10
// });

const terrian = document.getElementById('TERRAIN');
const normal = document.getElementById('NORMAL');
const sate = document.getElementById('SATELLITE');
const hybr = document.getElementById('HYBRID');
const osm_map = document.getElementById('osm_map');

const jejuland_check = document.getElementById('jejuland');
const jejusea_check = document.getElementById('jejusea');
const jejufarsea_check = document.getElementById('jejufarsea');
const jejuoleum_check = document.getElementById('jejuoleum');
const jejuaws_check = document.getElementById('jejuaws');
const jejuhiking_check = document.getElementById('jejuhiking');

var bicycleLayer = new naver.maps.BicycleLayer();

var btn = $('#bicycle');

var mapOptions = {
    // mapTypeControl: true,
    // mapTypeControlOptions: {
    //     style: naver.maps.MapTypeControlStyle.BUTTON,
    //     position: naver.maps.Position.TOP_RIGHT
    // },
    zoomControl: true,
    zoomControlOptions: {
        // style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
    },
    scaleControl: true,
    // scaleControlOptions: {
    //     position: naver.maps.Position.RIGHT_CENTER
    // },
    // logoControl: true,
    // logoControlOptions: {
    //     position: naver.maps.Position.TOP_LEFT
    // },
    // mapDataControl: true,
    // mapDataControlOptions: {
    //     position: naver.maps.Position.BOTTOM_LEFT
    // }
};

var openStreetMapType = new naver.maps.ImageMapType({
    name: 'OSM',
    minZoom: 0,
    maxZoom: 19,
    tileSize: new naver.maps.Size(256, 256),
    projection: naver.maps.EPSG3857,
    repeatX: true,
    tileSet: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
    ],
    provider: [{
        title: " /OpenStreetMap",
        link: "http://www.openstreetmap.org/copyright"
    }]
});

var map = new naver.maps.Map(document.getElementById('map'),mapOptions);
var jejucenter = new naver.maps.LatLng(33.5507, 126.5706);

var jejuland;
var jejusea;
var jejufarsea;
var jejuoleum;
var osm;
var markerList=[];
var circleList=[];
var infoWindowList=[];

var awsmarkerList=[];
var awsinfoWindowList=[];

var jejuhiking;

map.setCenter(jejucenter);
map.setZoom(10);

map.mapTypes.set('osm', openStreetMapType);

normal.addEventListener('click', () => {
    map.setMapTypeId(naver.maps.MapTypeId.NORMAL)    
});

terrian.addEventListener('click', () => {
    map.setMapTypeId(naver.maps.MapTypeId.TERRAIN)      
});

sate.addEventListener('click', () => {
    map.setMapTypeId(naver.maps.MapTypeId.SATELLITE)    
});

hybr.addEventListener('click', () => {
    map.setMapTypeId(naver.maps.MapTypeId.HYBRID)    
});

osm_map.addEventListener('click', () => {    
    map.setMapTypeId("osm");    
});

jejuland_check.addEventListener('change', function () {
    
    if (this.checked) {
        var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_land.geojson";
        $.ajax({
            // url: './geojson/jeju_land.geojson',
            url: file_url,
            dataType: 'json',
            success: startlandDataLayer            
        });
    } else { 
        map.data.removeGeoJson(jejuland);
    }
});

var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
tooltip.appendTo(map.getPanes().floatPane);

function startlandDataLayer(geojson) {    

    map.data.setStyle(function(feature) {
        var styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };

        if (feature.getProperty('focus')) {
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#0f0';
            styleOptions.strokeColor = '#0f0';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        }

        return styleOptions;
    });

    jejuland = geojson;
    map.data.addGeoJson(geojson);

    map.data.addListener('click', function(e) {
        var feature = e.feature;

        if (feature.getProperty('focus') !== true) {
            feature.setProperty('focus', true);
        } else {
            feature.setProperty('focus', false);
        }
    });

    map.data.addListener('mouseover', function(e) {
        var feature = e.feature,
            regionName = feature.getProperty('Name');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);

        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    map.data.addListener('mouseout', function(e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });

}

jejusea_check.addEventListener('change', function () {
    if (this.checked) {
        var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_sea.geojson";
        $.ajax({
            // url: './geojson/jeju_sea.geojson',
            url: file_url,
            dataType: 'json',
            success: startseaDataLayer            
        });
    } else { 
        map.data.removeGeoJson(jejusea);
    }
});

function startseaDataLayer(geojson) { 
    map.data.setStyle(function(feature) {
        var styleOptions = {
            fillColor: '#ff0000',
            fillOpacity: 0.0001,
            strokeColor: '#ff0000',
            strokeWeight: 2,
            strokeOpacity: 0.4
        };

        if (feature.getProperty('focus')) {
            styleOptions.fillOpacity = 0.6;
            styleOptions.fillColor = '#0f0';
            styleOptions.strokeColor = '#0f0';
            styleOptions.strokeWeight = 4;
            styleOptions.strokeOpacity = 1;
        }

        return styleOptions;
    });

    jejusea = geojson;
    map.data.addGeoJson(geojson);

    map.data.addListener('click', function(e) {
        var feature = e.feature;

        if (feature.getProperty('focus') !== true) {
            feature.setProperty('focus', true);
        } else {
            feature.setProperty('focus', false);
        }
    });

    map.data.addListener('mouseover', function(e) {
        var feature = e.feature,
            regionName = feature.getProperty('Name');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(regionName);

        map.data.overrideStyle(feature, {
            fillOpacity: 0.6,
            strokeWeight: 4,
            strokeOpacity: 1
        });
    });

    map.data.addListener('mouseout', function(e) {
        tooltip.hide().empty();
        map.data.revertStyle();
    });

}

jejufarsea_check.addEventListener('change', function () {
    if (this.checked) {
        var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_farsea.geojson";
        $.ajax({
            // url: './geojson/jeju_farsea.geojson',
            url: file_url,
            dataType: 'json',
            success: startfarseaDataLayer            
        });
    } else { 
        map.data.removeGeoJson(jejufarsea);
    }
});

function startfarseaDataLayer(geojson) {    
    jejufarsea = geojson;
    map.data.addGeoJson(geojson);
}

jejuoleum_check.addEventListener('change', function () {
    if (this.checked) {
        // var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_oleum_231115.geojson";
        $.ajax({
            url: './geojson/jeju_oleum_231115.geojson',
            // url: file_url,
            dataType: 'json',
            success: startoleumDataLayer            
        });
    } else { 

        for(let i = 0; i<markerList.length;  i++) {
            markerList[i].setMap(null);
            circleList[i].setMap(null);   
            infoWindowList[i] = null;
        }   
        
    }
});

function startoleumDataLayer(geojson) {    
   
    // window.alert(geojson.features.length);
    var count, i, coord, point, feature, dia, name, myicon_url;    
    count = geojson.features.length;
    
    myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/main/oleum/circle_default.png"; 

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 

        name = feature.properties['오름명'];
        dia = feature.properties['반경'];
        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);        

        var infoWindow = new naver.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:10px;">오름명 : <b>'+ name +'</b></div>'
        });

        var circle = new naver.maps.Circle({
            map: map,
            center: point,
            radius: dia,    
            strokeColor: '#5347AA',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: '#E51D1A',
            fillOpacity: 0.3
        });  

        var marker = new naver.maps.Marker({
            map: map,
            position: point,
            icon: {
                url: myicon_url,
                size: new naver.maps.Size(15, 16),
                // origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(7, 7)
            }
        });
   
        markerList.push(marker);
        circleList.push(circle);   
        infoWindowList.push(infoWindow);
    }   

    // window.alert(circles.length);

    // for (var i=0, ii=circles.length; i<ii; i++) {
    //     naver.maps.Event.addListener(circles[i], 'click', getClickHandler(i));
    // }
    
    // window.alert(circleList.length);

    for(let i = 0, ii = markerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", ClickMap(i));
        naver.maps.Event.addListener(markerList[i], "click", getClickHandler(i));
    }         
}

function ClickMap(i) {
    return function () {
      var infowindow = infoWindowList[i];
      infowindow.close()
    }
}

function getClickHandler(i) {
    return function() {
      var marker = markerList[i]
      var infowindow = infoWindowList[i]
      if(infowindow.getMap())  {// getMap -> infowindow가 표시 유무에 따라 true/false
        infowindow.close()
      } else {
        infowindow.open(map, marker);
        map.setZoom(14, false);
        map.panTo(marker.position)
      }
    }
}


jejuaws_check.addEventListener('change', function () {
    if (this.checked) {
        var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_obs.geojson";
        $.ajax({
            // url: './geojson/jeju_obs.geojson',
            url: file_url,
            dataType: 'json',
            success: startawsDataLayer            
        });
    } else {  
        
        for(let i = 0; i<awsmarkerList.length;  i++) {
            awsmarkerList[i].setMap(null);
            awsinfoWindowList[i] = null;
        }           
    }
});

function startawsDataLayer(geojson) {    
   
    // window.alert(geojson.features.length);
    var count, i, coord, point, feature, dia, stname, eqname, co;    
    var myicon_url;
    count = geojson.features.length;
    
    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 

        stname = feature.properties['지점명'];
        eqname = feature.properties['장비명'];
        
        if (eqname == '방재기상관측장비' ) {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";            
            // myicon_url = './markers/aws.png';
        } else if (eqname == '종관기상관측장비') {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/asos.png";
            // myicon_url = './markers/asos.png';
        } else if (eqname == '해양기상부이') {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/buoy.png";
            // myicon_url = './markers/buoy.png';
        } else if (eqname == '파고부이') {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/tidalbuoy.png";
            // myicon_url = './markers/tidalbuoy.png';
        } else if (eqname == '지진관측장비') {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/earth.png";
            // myicon_url = './markers/earth.png';
        } else if (eqname == '연직바람관측장비') {
            myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/wind.png";
            // myicon_url = './markers/seasos.png';
        }        
        // else if (eqname == '연안방재관측장비') {
        //     myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/beacon.png";
        //     // myicon_url = './markers/seasos.png';
        // }         
        else {
            myicon_url='';
            // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/wind.png";
            // myicon_url = './markers/wind.png';
        }        

        coord = feature.geometry.coordinates;
        // window.alert(coord[0]);
        co = coord[0]

        var y = co[1];
        var x = co[0];
        // window.alert(x);
        // window.alert(y);
        point = new naver.maps.LatLng(y, x);        

        var infoWindow = new naver.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:10px;"> 지점명 : <b>'+stname+' </b> <p>'+eqname+'</p></div>'
        });

        var marker = new naver.maps.Marker({
            map: map,
            position: point,
            icon: {
                url: myicon_url,
                size: new naver.maps.Size(25, 25),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 12)
            }
        });   
        awsmarkerList.push(marker);
        awsinfoWindowList.push(infoWindow);
    }   

    // window.alert(circles.length);

    // for (var i=0, ii=circles.length; i<ii; i++) {
    //     naver.maps.Event.addListener(circles[i], 'click', getClickHandler(i));
    // }
    
    // window.alert(circleList.length);

    for(let i = 0, ii = awsmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", awsClickMap(i));
        naver.maps.Event.addListener(awsmarkerList[i], "click", awsgetClickHandler(i));
    }         
}

function awsClickMap(i) {
    return function () {
      var infowindow = awsinfoWindowList[i];
      infowindow.close()
    }
}

function awsgetClickHandler(i) {
    return function() {
      var marker = awsmarkerList[i]
      var infowindow = awsinfoWindowList[i]
      if(infowindow.getMap())  {// getMap -> infowindow가 표시 유무에 따라 true/false
        infowindow.close()
      } else {
        infowindow.open(map, marker);
        // map.setZoom(14, false);
        // map.panTo(marker.position)
      }
    }
}

jejuhiking_check.addEventListener('change', function () {
    if (this.checked) {
        // var file_url= "https://raw.githubusercontent.com/ryooyg/Jeju/main/geojson/jeju_hiking_total.geojson";
        $.ajax({
            url: './geojson/jeju_hiking_total.geojson',
            // url: file_url,
            dataType: 'json',
            success: starthikingDataLayer            
        });

    } else {  
        
        map.data.removeGeoJson(jejuhiking);
        // for(let i = 0; i<awsmarkerList.length;  i++) {
        //     awsmarkerList[i].setMap(null);
        //     awsinfoWindowList[i] = null;
        // }           
    }
});

function starthikingDataLayer(geojson) {    
    
    jejuhiking = geojson;

    map.data.addGeoJson(geojson);

    map.data.setStyle(function(feature) {
        var color = 'blue';

        if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
        }

        return {
            fillColor: color,
            strokeColor: color,
            strokeWeight: 3,
            icon: null,            
        };
    });

    // map.data.addListener('click', function(e) {
    //     e.feature.setProperty('isColorful', true);
    // });

    // map.data.addListener('dblclick', function(e) {
    //     var bounds = e.feature.getBounds();

    //     if (bounds) {
    //         map.panToBounds(bounds);
    //     }
    // });

    map.data.addListener('mouseover', function(e) {
        map.data.overrideStyle(e.feature, {
            strokeWeight: 8,
            strokeColor: 'red',
            // text: feature.properties['PMNTN_NM'],
            // icon: HOME_PATH +'/img/example/pin_spot.png'
        });
    });

    map.data.addListener('mouseout', function(e) {
        map.data.revertStyle();
    });

}

// var contentString = [
    //     '<div class="iw_inner">',
    //     '   <h3>제주 중심</h3>',    
    //     '</div>'
    // ].join('');
    
    // var marker = new naver.maps.Marker({
    //     map: map,
    //     position: jejucenter
    // });
    
    // var circle = new naver.maps.Circle({
    //     map: map,
    //     center: jejucenter,
    //     radius: 5000,    
    //     strokeColor: '#5347AA',
    //     strokeOpacity: 0.5,
    //     strokeWeight: 2,
    //     fillColor: '#E51D1A',
    //     fillOpacity: 0.3
    // });
    
    // var infowindow = new naver.maps.InfoWindow({
    //     content: contentString,
    //     maxWidth: 140,
    //     backgroundColor: "#eee",
    //     borderColor: "#2db400",
    //     borderWidth: 5,
    //     anchorSize: new naver.maps.Size(30, 30),
    //     anchorSkew: true,
    //     anchorColor: "#eee",
    //     pixelOffset: new naver.maps.Point(20, -20)
    // });
    
    // naver.maps.Event.addListener(circle, "click", function(e) {
    //     if (infowindow.getMap()) {
    //         infowindow.close();
    //     } else {
    //         infowindow.open(map, circle);
    //     }
    // });
    
    
// for (var i=0, ii=circles.length; i<ii; i++) {
//     naver.maps.Event.addListener(circles[i], 'click', getClickHandler(i));
// }

// naver.maps.Event.once(map, 'init', function() {
//     bicycleLayer.setMap(map);
// });

// var labelLayer = new naver.maps.LabelLayer();
// $('#label').on("click", function(e) {
//     e.preventDefault();

//     if (labelLayer.getMap()) {        
//         labelLayer.setMap(null);
//         $(this).removeClass("control-on");        
//     } else {        
//         labelLayer.setMap(map);
//         $(this).addClass("control-on");        
//     }
// });

// var labelMapType = new naver.maps.NaverStyleMapTypeOptions.getNormalLabelLayer();
// var labelMapTypeRegistry = new naver.maps.MapTypeRegistry({
//     'label': labelMapType
// });
// var labelLayer = new naver.maps.Layer('label', labelMapTypeRegistry);

// $('#labelLayer').on('click', function(e) {
//     e.preventDefault();

//     var btn = $(this);

//     if (labelLayer.getMap()) {
//         labelLayer.setMap(null);
//         btn.removeClass('control-on').val('POI 켜기');
//     } else {
//         labelLayer.setMap(map);
//         btn.addClass('control-on').val('POI 끄기');
//     }
// });