const terrian = document.getElementById('TERRAIN');
const normal = document.getElementById('NORMAL');
const sate = document.getElementById('SATELLITE');
const hybr = document.getElementById('HYBRID');
const osm_map = document.getElementById('osm_map');

const jejuoleum_check = document.getElementById('jejuoleum');
const jejuhiking_check = document.getElementById('jejuhiking');
const jejuolle_check = document.getElementById('jeju_olle_trail');
const jejuhalla_check = document.getElementById('jeju_halla_trail');
const jejuzpt_check = document.getElementById('jeju_zpt');

const jejucafe_check = document.getElementById('jeju_cafe');
const jejurest_check = document.getElementById('jeju_rest');
const seogwipocafe_check = document.getElementById('seogwipo_cafe');
const seogwiporest_check = document.getElementById('seogwipo_rest');
const jejuheajang_check = document.getElementById('jeju_heajang');

const jejuwishlist_check = document.getElementById('jeju_wishlist');
const jejucamellia_check = document.getElementById('jeju_camellia');
const jejucctv_check = document.getElementById('jeju_cctv');

var bicycleLayer = new naver.maps.BicycleLayer();

var osm;

var jejuoleum;
var oleummarkerList=[];
var oleumcircleList=[];
var oleuminfoWindowList=[];

var jejuhiking;
var jejuhalla;
var jejuolle;
var jejuzpt;

var jejucafe;
var jejucafemarkerList=[];
var jejucafeinfoWindowList=[];

var jejurest;
var jejurestmarkerList=[];
var jejurestinfoWindowList=[];

var seogwipocafe;
var seogwipocafemarkerList=[];
var seogwipocafeinfoWindowList=[];

var seogwiporest;
var seogwiporestmarkerList=[];
var seogwiporestinfoWindowList=[];

var jejuheajang;
var jejuheajangmarkerList=[];
var jejuheajanginfoWindowList=[];

var jejucctv;
var jejucctvmarkerList=[];
var jejucctvinfoWindowList=[];

var jejuwishlist;
var jejuwishlistmarkerList=[];
var jejuwishlistinfoWindowList=[];

var jejucamellia;
var jejucamelliamarkerList=[];
var jejucamelliainfoWindowList=[];

var zoomindex=10;
var jejucenter=naver.maps.LatLng(33.5507, 126.5706);

// const mediaQuery = '(max-width: 700px)';
// const mediaQueryList = window.matchMedia(mediaQuery);

// window.alert(myindex);

// mediaQueryList.addEventListener('change', event => {
//     // window.alert(window.innerWidth);
//   if (event.matches) {    
//     zoomindex=7;
//     jejucenter = naver.maps.LatLng(33.4000, 126.5706);
//     //window.alert('The window is now 700px or under');
//     map.setCenter(jejucenter);
//     map.setZoom(zoomindex);
//   } else {
//     zoomindex=10;
//     jejucenter = naver.maps.LatLng(33.5507, 126.5706);
//     // window.alert('The window is now over 700px');
//     map.setCenter(jejucenter);
//     map.setZoom(zoomindex);
//   }
// })

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

if (myindex==1 ) {
    zoomindex=9;
    jejucenter = naver.maps.LatLng(33.4500, 126.5706);
    // window.alert('The window is now 700px or under');    
} else {
    zoomindex=10;
    jejucenter = naver.maps.LatLng(33.5507, 126.5706);
    // window.alert('The window is now over 700px');
}

var map = new naver.maps.Map(document.getElementById('map'),mapOptions);
map.setCenter(jejucenter);
map.setZoom(zoomindex);
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


var tooltip = $('<div style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
tooltip.appendTo(map.getPanes().floatPane);

jejuoleum_check.addEventListener('change', function () {

    if (this.checked) {

        var url_path = './geojson/jeju_oleum.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startoleumDataLayer            
        });
    } else { 

        for(let i = 0; i<oleummarkerList.length;  i++) {
            oleummarkerList[i].setMap(null);
            oleumcircleList[i].setMap(null);   
            oleuminfoWindowList[i] = null;
        }   
        
    }
});

function startoleumDataLayer(geojson) {    
   
    // window.alert(geojson.features.length);
    var count, i, coord, point, feature, dia, name, myicon_url, markercon;    
    count = geojson.features.length;
    
    // myicon_url = 'https://github.com/ryooyg/RyooInJeju/blob/3561068d0e2a8b3a388b1f6418ebd89f4a5d84ca/img/circle_default.png';
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

        markercon = '<div style="text-align:left;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,
            icon: {
                content: markercon,
                size: new naver.maps.Size(15, 16),
                // origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(7, 7)
            }
        });
   
        oleummarkerList.push(marker);
        oleumcircleList.push(circle);   
        oleuminfoWindowList.push(infoWindow);
    }   

    // window.alert(circles.length);

    // for (var i=0, ii=circles.length; i<ii; i++) {
    //     naver.maps.Event.addListener(circles[i], 'click', getClickHandler(i));
    // }
    
    // window.alert(circleList.length);

    for(let i = 0, ii = oleummarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", oleumClickMap(i));
        naver.maps.Event.addListener(oleummarkerList[i], "click", oleumgetClickHandler(i));
    }         
}

function oleumClickMap(i) {
    return function () {
      var infowindow = oleuminfoWindowList[i];
      infowindow.close()
    }
}

function oleumgetClickHandler(i) {
    return function() {
      
        var marker = oleummarkerList[i]
      var infowindow = oleuminfoWindowList[i]

      if(infowindow.getMap())  {// getMap -> infowindow가 표시 유무에 따라 true/false
        infowindow.close()
      } else {
        infowindow.open(map, marker);
        map.setZoom(14, false);
        map.panTo(marker.position)
      }
    }
}

jejuhiking_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_hiking_total.geojson';
        $.ajax({
            url: url_path,
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

        var feature = e.feature,
            pathName = feature.getProperty('PMNTN_NM');
            
        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(pathName);

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

jejuolle_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path ='./geojson/jeju_olle_trail.geojson';         
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startolleDataLayer            
        });

    } else {          
        map.data.removeGeoJson(jejuolle);        
    }
});

function startolleDataLayer(geojson) {    
    
    jejuolle = geojson;
    map.data.addGeoJson(geojson);
    map.data.setStyle(function(feature) {
        var color = 'blue';

        if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
        }

        return {
            fillColor: color,
            strokeColor: color,
            strokeWeight: 2,
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
        var feature = e.feature,
            pathName = feature.getProperty('name');

        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(pathName);

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

jejuhalla_check.addEventListener('change', function () {
    if (this.checked) {
        
        var url_path ='./geojson/jeju_halla_trail.geojson';

        $.ajax({
            url: url_path ,
            dataType: 'json',
            success: starthallaDataLayer            
        });

    } else {          
        map.data.removeGeoJson(jejuhalla);        
    }
});

function starthallaDataLayer(geojson) {    
    
    jejuhalla = geojson;
    
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
        var feature = e.feature,
            pathName = feature.getProperty('layer');
        tooltip.css({
            display: '',
            left: e.offset.x,
            top: e.offset.y
        }).text(pathName);

        map.data.overrideStyle(e.feature, {
            strokeWeight: 8,
            strokeColor: 'red',
            // text: tt,
            // icon: HOME_PATH +'/img/example/pin_spot.png'
        });
    });

    map.data.addListener('mouseout', function(e) {
        map.data.revertStyle();
    });
}

jejuzpt_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_zpt.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startzptDataLayer            
        });

    } else { 
        map.data.removeGeoJson(jejuzpt);        
    }
});

function startzptDataLayer(geojson) {    
    
    jejuzpt = geojson;
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

jejucafe_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_favorites.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejucafeDataLayer            
        });

    } else { 

        for(let i = 0; i<jejucafemarkerList.length;  i++) {
            jejucafemarkerList[i].setMap(null);
            jejucafeinfoWindowList[i] = null;
        }  
        // map.data.removeGeoJson(jejucafe);        
    }
});

function startjejucafeDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count, region;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;    
    // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";    
    myicon_url ='./img/jeju_cafe.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];
        // window.alert(slink)
        if (layer != '제주 카페') {
            continue;
        }
        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                        
        
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        
        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        jejucafemarkerList.push(marker);
        jejucafeinfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = jejucafemarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejucafeClickMap(i));
        naver.maps.Event.addListener(jejucafemarkerList[i], "click", jejucafegetClickHandler(i));
    }   

}

function jejucafeClickMap(i) {
    return function () {
      var infowindow = jejucafeinfoWindowList[i];
      infowindow.close()
    }
}

function jejucafegetClickHandler(i) {
    return function() {
      var marker = jejucafemarkerList[i]
      var infowindow = jejucafeinfoWindowList[i]
      if(infowindow.getMap())  {// getMap -> infowindow가 표시 유무에 따라 true/false
        infowindow.close()
      } else {
        infowindow.open(map, marker);
        // map.setZoom(14, false);
        // map.panTo(marker.position)
      }
    }
}

jejurest_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_favorites.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejurestDataLayer            
        });

    } else { 

        for(let i = 0; i<jejurestmarkerList.length;  i++) {
            jejurestmarkerList[i].setMap(null);
            jejurestinfoWindowList[i] = null;
        }
    }
});

function startjejurestDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count, region;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";    
    myicon_url ='./img/jeju_rest.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];

        if (layer != '제주 식당') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';// infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        jejurestmarkerList.push(marker);
        jejurestinfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = jejurestmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejurestClickMap(i));
        naver.maps.Event.addListener(jejurestmarkerList[i], "click", jejurestgetClickHandler(i));
    }
}

function jejurestClickMap(i) {
    return function () {
      var infowindow = jejurestinfoWindowList[i];
      infowindow.close()
    }
}

function jejurestgetClickHandler(i) {
    return function() {
      var marker = jejurestmarkerList[i]
      var infowindow = jejurestinfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}


seogwipocafe_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_favorites.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startseogwipocafeDataLayer            
        });

    } else { 

        for(let i = 0; i<seogwipocafemarkerList.length;  i++) {
            seogwipocafemarkerList[i].setMap(null);
            seogwipocafeinfoWindowList[i] = null;
        }
    }
});

function startseogwipocafeDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count, region;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";    
    myicon_url ='./img/seogwipo_cafe.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer']; 
        slink = feature.properties['link'];          

        if (layer != '서귀포 카페') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        // infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        seogwipocafemarkerList.push(marker);
        seogwipocafeinfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = seogwipocafemarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", seogwipocafeClickMap(i));
        naver.maps.Event.addListener(seogwipocafemarkerList[i], "click", seogwipocafegetClickHandler(i));
    }
}

function seogwipocafeClickMap(i) {
    return function () {
      var infowindow = seogwipocafeinfoWindowList[i];
      infowindow.close()
    }
}

function seogwipocafegetClickHandler(i) {
    return function() {
      var marker = seogwipocafemarkerList[i]
      var infowindow = seogwipocafeinfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}

seogwiporest_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_favorites.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startseogwiporestDataLayer            
        });

    } else { 

        for(let i = 0; i<seogwiporestmarkerList.length;  i++) {
            seogwiporestmarkerList[i].setMap(null);
            seogwiporestinfoWindowList[i] = null;
        }
    }
});

function startseogwiporestDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count, region;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";    
    myicon_url ='./img/seogwipo_rest.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];         

        if (layer != '서귀포 식당') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        // infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        seogwiporestmarkerList.push(marker);
        seogwiporestinfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = seogwiporestmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", seogwiporestClickMap(i));
        naver.maps.Event.addListener(seogwiporestmarkerList[i], "click", seogwiporestgetClickHandler(i));
    }
}

function seogwiporestClickMap(i) {
    return function () {
      var infowindow = seogwiporestinfoWindowList[i];
      infowindow.close()
    }
}

function seogwiporestgetClickHandler(i) {
    return function() {
      var marker = seogwiporestmarkerList[i]
      var infowindow = seogwiporestinfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}

jejuheajang_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_favorites.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejuheajangDataLayer            
        });

    } else { 

        for(let i = 0; i<jejuheajangmarkerList.length;  i++) {
            jejuheajangmarkerList[i].setMap(null);
            jejuheajanginfoWindowList[i] = null;
        }
    }
});

function startjejuheajangDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count, region;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";    
    myicon_url ='./img/jejuheajang.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];           

        if (layer != '제주 해장국') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        // infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        jejuheajangmarkerList.push(marker);
        jejuheajanginfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = jejuheajangmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejuheajangClickMap(i));
        naver.maps.Event.addListener(jejuheajangmarkerList[i], "click", jejuheajanggetClickHandler(i));
    }
}

function jejuheajangClickMap(i) {
    return function () {
      var infowindow = jejuheajanginfoWindowList[i];
      infowindow.close()
    }
}

function jejuheajanggetClickHandler(i) {
    return function() {
      var marker = jejuheajangmarkerList[i]
      var infowindow = jejuheajanginfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}

jejucctv_check.addEventListener('change', function () {
    if (this.checked) {        
        var url_path = './json/jeju_cctv.json';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejucctvDataLayer            
        });

    } else { 
        for(let i = 0; i<jejucctvmarkerList.length;  i++) {
            jejucctvmarkerList[i].setMap(null);
            jejucctvinfoWindowList[i] = null;
        }  
        // map.data.removeGeoJson(jejucctv);        
    }
});

function startjejucctvDataLayer(json) {    

    var count, i, point, name, count;    
    var infocon, markercon, myicon_url;
    var channel, vodUrl, x, y;
    
    count = json.length;
    myicon_url ='./img/cctv.png';
    for(i = 0; i < count; i++) 
    {
        channel = json[i].channel
        vodUrl = json[i].vodUrl
        name = json[i].cctvStrtSecnNm
        y = json[i].y;
        x = json[i].x;    
        point = new naver.maps.LatLng(y, x);
        // infocon = '<div style="width:250px;text-align:left;"          >장    소 : '+name+'<p>'+
        //           '<a href="r1.html?vodUrl='+vodUrl+'" target="_blank">채널번호 : '+channel+'</a></p></div>';
        // infocon ='\
        //     <iframe title="cctv video player" class="video-js" controls autoplay preload="auto" width="720" height="480" \
        //             src="https://cctvsecn01.ktict.co.kr/7204/IR6-NtfRbxfdEjTb8h4zerwqHl9Pg6JF4N8R64QEujLIkILQQ__jqmEojemCTcsh" type="video/mp4" frameborder="0"> \
        //     </iframe>';
        // <div><button onclick="jejucctvgetClickHandler(1)" type="button">x</button></div> \
           
        infocon =' \
           <div style="width:305px;text-align:left;height:260px;padding-left:5px; padding-top:5px">장 소 : '+name+'<p> \
              <video class="video-js vjs-default-skin" preload="auto" poster autoplay loop controls data-setup=\'{}\'>\
                <source src="'+vodUrl+'" type="video/mp4" /> \
              </video> </p>'+' \
              <p><a href="cctv_temp.html?vodUrl='+vodUrl+'" target="_blank">채널번호 : '+channel+'</a></p> \
              <p>경찰청(UTIC)제공</p> \
            </div>';

        
        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,            
            // maxWidth: 700,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });

        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'><b>'+name+'</b></div>';
        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            icon: {
                content: markercon,
                size: new naver.maps.Size(20, 20),
                anchor: new naver.maps.Point(10, 10)
            },            
        });
        jejucctvmarkerList.push(marker);
        jejucctvinfoWindowList.push(infoWindow);
    }

    for(let i = 0, ii = jejucctvmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejucctvClickMap(i));
        naver.maps.Event.addListener(jejucctvmarkerList[i], "click", jejucctvgetClickHandler(i));
    }    
}

function jejucctvClickMap(i) {
    return function () {
      var infowindow = jejucctvinfoWindowList[i];
      infowindow.close()
    }
}

function jejucctvgetClickHandler(i) {
    return function() {
      var marker = jejucctvmarkerList[i]
      var infowindow = jejucctvinfoWindowList[i]
      if(infowindow.getMap())  {// getMap -> infowindow가 표시 유무에 따라 true/false
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}

// var jejuwishlist;
// var jejuwishlistmarkerList=[];
// var jejuwishlistinfoWindowList=[];

// var jejucamellia;
// var jejucamelliamarkerList=[];
// var jejucamelliainfoWindowList=[];

jejuwishlist_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_wishlist.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejuwishlistDataLayer            
        });
    } else { 
        for(let i = 0; i<jejuwishlistmarkerList.length;  i++) {
            jejuwishlistmarkerList[i].setMap(null);
            jejuwishlistinfoWindowList[i] = null;
        }
    }
});

function startjejuwishlistDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    myicon_url ='./img/jeju_wishlist.png';

    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];           

        if (layer != '제주 가볼곳') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        // infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        jejuwishlistmarkerList.push(marker);
        jejuwishlistinfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = jejuwishlistmarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejuwishlistClickMap(i));
        naver.maps.Event.addListener(jejuwishlistmarkerList[i], "click", jejuwishlistgetClickHandler(i));
    }
}

function jejuwishlistClickMap(i) {
    return function () {
      var infowindow = jejuwishlistinfoWindowList[i];
      infowindow.close()
    }
}

function jejuwishlistgetClickHandler(i) {
    return function() {
      var marker = jejuwishlistmarkerList[i]
      var infowindow = jejuwishlistinfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
}

jejucamellia_check.addEventListener('change', function () {
    if (this.checked) {
        var url_path = './geojson/jeju_camellia.geojson';
        $.ajax({
            url: url_path,
            dataType: 'json',
            success: startjejucamelliaDataLayer            
        });
    } else { 
        for(let i = 0; i<jejucamelliamarkerList.length;  i++) {
            jejucamelliamarkerList[i].setMap(null);
            jejucamelliainfoWindowList[i] = null;
        }
    }
});

function startjejucamelliaDataLayer(geojson) {    

    var count, i, coord, point, feature, name, count;    
    var infocon, markercon, myicon_url;
    var layer, slink;
    
    count = geojson.features.length;
    myicon_url ='./img/jeju_camellia.png';
    
    for(i = 0; i < count; i++) 
    {
        feature = geojson.features[i]; 
        name = feature.properties['Name'];
        layer = feature.properties['layer'];
        slink = feature.properties['link'];           

        if (layer != '제주 동백') {
            continue;
        }

        coord = feature.geometry.coordinates;
        var y = coord[1];
        var x = coord[0];
        point = new naver.maps.LatLng(y, x);                
        
        // infocon = '<div style="width:250px;text-align:left;"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b> </p></div>';
        infocon = '<div style="width:250px;text-align:left;padding-left:5px"> 지  역 : <b>'+layer+' </b> <p> 상호 : <b>'+ name+'</b></p><p><a href="'+slink+'" target="_blank">정보</a></a></p></div>';
        

        var infoWindow = new naver.maps.InfoWindow({
            content: infocon,
            // maxWidth: 200,
            // backgroundColor: "#eee",
            // borderColor: infoborderColor,
            // borderWidth: 5,
            // anchorSize: new naver.maps.Size(50, 50),
            // anchorSkew: true,
            // anchorColor: "#eee",
            // pixelOffset: new naver.maps.Point(20, -20)
        });
        // window.alert(cont);


        markercon = '<div style="text-align:center;"> <img src='+myicon_url+'>'+name+'</div>';

        var marker = new naver.maps.Marker({
            map: map,
            position: point,            
            // title: stname,
            icon: {
                content: markercon,
                size: new naver.maps.Size(8, 8),
                // anchor: new naver.maps.Point(7, 7)
            },
            
        });

        jejucamelliamarkerList.push(marker);
        jejucamelliainfoWindowList.push(infoWindow);
    }   

    for(let i = 0, ii = jejucamelliamarkerList.length; i < ii; i++) {
        naver.maps.Event.addListener(map, "click", jejucamelliaClickMap(i));
        naver.maps.Event.addListener(jejucamelliamarkerList[i], "click", jejucamelliagetClickHandler(i));
    }
}

function jejucamelliaClickMap(i) {
    return function () {
      var infowindow = jejucamelliainfoWindowList[i];
      infowindow.close()
    }
}

function jejucamelliagetClickHandler(i) {
    return function() {
      var marker = jejucamelliamarkerList[i]
      var infowindow = jejucamelliainfoWindowList[i]
      if(infowindow.getMap()){
        infowindow.close()
      } else {
        infowindow.open(map, marker);
      }
    }
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

// var HOME_PATH = window.HOME_PATH || '.';
// var cityhall = new naver.maps.LatLng(37.5666805, 126.9784147),
//     map = new naver.maps.Map('map', {
//         center: cityhall,
//         zoom: 10
//     }),
//     marker = new naver.maps.Marker({
//         map: map,
//         position: cityhall
//     });

// var contentString = [
//         '<div class="iw_inner">',
//         '   <h3>서울특별시청</h3>',
//         '   <p>서울특별시 중구 태평로1가 31 | 서울특별시 중구 세종대로 110 서울특별시청<br />',
//         '       <img src="'+ HOME_PATH +'/img/example/hi-seoul.jpg" width="55" height="55" alt="서울시청" class="thumb" /><br />',
//         '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
//         '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
//         '   </p>',
//         '</div>'
//     ].join('');

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

// const iconStyle = `<div style="background-color:red;">Hello</div>`;

// const content = [
//         "<div>",
//         `       <img src="/icon/current-location.svg" width="85" height="85" alt="현재 위치"/>`,
//         "</div>",
//       ].join("");
// jejucafe = geojson;
    // map.data.addGeoJson(geojson);


    // var count, i, coord, point, feature, stname, eqname, co;    
    // var myicon_url;
    // var infocon;
    // var infoborderColor;
    // var markercon;

    // count = geojson.features.length;
    
    // for(i = 0; i < count; i++) 
    // {
    //     feature = geojson.features[i]; 

    //     stname = feature.properties['지점명'];
    //     eqname = feature.properties['장비명'];
        
    //     if (eqname == '방재기상관측장비' ) {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/aws.png";            
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'>'+stname+'</div>';
    //         // myicon_url = './markers/aws.png';
    //     } else if (eqname == '종관기상관측장비') {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/asos.png";
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+'</p></div>';
    //         infoborderColor = "#222400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'></div>';
    //         // myicon_url = './markers/asos.png';
    //     } else if (eqname == '해양기상부이') {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/buoy.png";
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'>'+stname+'</div>';
    //         // myicon_url = './markers/buoy.png';
    //     } else if (eqname == '파고부이') {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/tidalbuoy.png";
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'>'+stname+'</div>';
    //         // myicon_url = './markers/tidalbuoy.png';
    //     } else if (eqname == '지진관측장비') {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/earth.png";
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'></div>';
    //         // myicon_url = './markers/earth.png';
    //     } else if (eqname == '연직바람관측장비') {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/wind.png";
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'>'+stname+'</div>';
    //         // myicon_url = './markers/seasos.png';
    //     }        
    //     // else if (eqname == '연안방재관측장비') {
    //     //     myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/beacon.png";
    //     //     // myicon_url = './markers/seasos.png';
    //     // }         
    //     else {
    //         myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/wind.png";            
    //         infocon = '<div style="width:200px;text-align:left;padding:10px;"> 지점명 : <b>'+stname+' </b> <p> 장비명 : <b>'+eqname+'</b> </p></div>';
    //         infoborderColor = "#2db400";
    //         markercon = '<div style="text-align:center;padding:10px;"> <img src='+myicon_url+'>'+stname+'</div>';
    //         // myicon_url = "https://raw.githubusercontent.com/ryooyg/Jeju/946c7936fa9a4356d899b51c62e82b665c4f3721/Markers/wind.png";
    //         // myicon_url = './markers/wind.png';
    //     }        

    //     coord = feature.geometry.coordinates;
    //     // window.alert(coord[0]);
    //     co = coord[0]
    //     var y = co[1];
    //     var x = co[0];
    //     // window.alert(x);
    //     // window.alert(y);
    //     point = new naver.maps.LatLng(y, x);        
    //     var infoWindow = new naver.maps.InfoWindow({
    //         content: infocon,
    //         maxWidth: 200,
    //         backgroundColor: "#eee",
    //         borderColor: infoborderColor,
    //         borderWidth: 5,
    //         anchorSize: new naver.maps.Size(50, 50),
    //         anchorSkew: true,
    //         anchorColor: "#eee",
    //         pixelOffset: new naver.maps.Point(20, -20)
    //     });
    //     // window.alert(cont);
    //     var marker = new naver.maps.Marker({
    //         map: map,
    //         position: point,            
    //         title: stname,
    //         icon: {
    //             content: markercon,
    //             size: new naver.maps.Size(25, 25),
    //             origin: new naver.maps.Point(0, 0),
    //             anchor: new naver.maps.Point(12, 12)
    //         },
            
    //     });        
    //     awsmarkerList.push(marker);
    //     awsinfoWindowList.push(infoWindow);
    // }   

    // for(let i = 0, ii = awsmarkerList.length; i < ii; i++) {
    //     naver.maps.Event.addListener(map, "click", awsClickMap(i));
    //     naver.maps.Event.addListener(awsmarkerList[i], "click", awsgetClickHandler(i));
    // }    

    // jejucafemarkerList=[];
    // jejucafeinfoWindowList=[];


    // map.data.setStyle(function(feature) {
    //     var color = 'red';

    //     if (feature.getProperty('isColorful')) {
    //         color = feature.getProperty('color');
    //     }

    //     return {
    //         fillColor: color,
    //         strokeColor: color,
    //         strokeWeight: 3,
    //         icon: null,            
    //     };
    // });

    // // map.data.addListener('click', function(e) {
    // //     e.feature.setProperty('isColorful', true);
    // // });

    // // map.data.addListener('dblclick', function(e) {
    // //     var bounds = e.feature.getBounds();

    // //     if (bounds) {
    // //         map.panToBounds(bounds);
    // //     }
    // // });

    // map.data.addListener('mouseover', function(e) {
    //     map.data.overrideStyle(e.feature, {
    //         strokeWeight: 8,
    //         strokeColor: 'blue',
    //         // text: feature.properties['PMNTN_NM'],
    //         // icon: HOME_PATH +'/img/example/pin_spot.png'
    //     });
    // });

    // map.data.addListener('mouseout', function(e) {
    //     map.data.revertStyle();
    // // });
    // ' <!DOCTYPE html> \
    //     <html> \
    //       <head> \
    //         <meta charset="UTF-8"> \
    //         <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
    //         <title>어쩌다 제주도민</title> \
    //         <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video-js.min.css" rel="stylesheet"> \
    //         <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video.min.js"></script> \
    //       </head> \
    //       <body> \
    //         <div class="cctv_co"> \
    //                     <video id="video1" class="video-js vjs-default-skin" style="width:100%;"></video> \
    //             <script> \
    //                 videojs("video1", {  \
    //                     sources : [ { src : "http://119.65.216.155:1935/live/cctv05.stream_360p/playlist.m3u8", type : "application/x-mpegURL"} ] \
    //                                   , controls : false \
    //                                   , playsinline : true \
    //                                   , muted : true \
    //                                   , preload : "auto" \
    //                                   , autoplay : true \
    //                                   , responsive : true \
    //                                   ,aspectRatio : "4:3" \
    //                                     });	 \
    //             </script> \
    //         </div> \
    //       </body>\
    //     </html>';
//     \
//         <!DOCTYPE html> \
// <html> \
//   <head> \
//     <meta charset="UTF-8"> \
//     <meta http-equiv="X-UA-Compatible" content="IE=edge"> \
//     <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
//     <title>어쩌다 제주도민</title> \
//     <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video-js.min.css" rel="stylesheet"> \
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.8.1/video.min.js"></script> \
//   </head> \
//   <body> \
//     <div class="cctv_co" style="width:1000px" > \
// 		<video id="video1" class="video-js vjs-default-skin" style="width:90%;"></video>                                      \
//         <script> \
//             videojs("video1", {  \
//                 sources : [ { src : "http://119.65.216.155:1935/live/cctv05.stream_360p/playlist.m3u8", type : "application/x-mpegURL"} ] \
//                               , controls : false \
//                               , playsinline : true \
//                               , muted : true \
//                               , preload : "auto" \
//                               , autoplay : true \
//                               , responsive : true \
//                               ,aspectRatio : "4:3" \
//                                 });	\
//         </script> \
//     </div> \
//   </body> \
// </html>';