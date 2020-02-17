var plates;
var myMap;
var plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

d3.json(plates_url,function(response){
    //console.log(response);
    plates = L.geoJSON(response,{  
        style: {
                color:"purple",
                fillColor: "white",
                fillOpacity:0
        },      
        onEachFeature: function(feature,layer){
            layer.bindPopup("Plate Name: "+feature.properties.PlateName);
        }
        
    })

    
    var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    

    d3.json(earthquakes_url,function(data){
    console.log(data);
   
    function createCircleMarker(feature,latlng){
        var options = {
            radius:feature.properties.mag*4,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        }
        return L.circleMarker( latlng, options );

    }


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(plates,earthQuakes);

    });

    
});

  function createMap(plates,earthQuakes) {
  
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY
    });

  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Light": light,
      "Outdoors": outdoors
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Tectonic Plates": plates,
      Earthquakes: earthQuakes
    };
  
    // Create our map
    var myMap = L.map("map", {
      center: [
        39.0997,-94.5786
      ],
      zoom: 4,
      layers: [outdoors, plates, earthQuakes]
    });
  
    
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    legend.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  }


  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "green";
        case (mag<2):
            return "beige";
        case (mag<3):
            return "gray";
        case (mag<4):
            return "pink";
        case (mag<5):
            return "navy";
        default:
            return "red";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "Mag: 0-1",
        color: "green"
    },{
        limit: "Mag: 1-2",
        color: "beige"
    },{
        limit:"Mag: 2-3",
        color:"gray"
    },{
        limit:"Mag: 3-4",
        color:"pink"
    },{
        limit:"Mag: 4-5",
        color:"navy"
    },{
        limit:"Mag: 5+",
        color:"red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }
    
    return header+strng;

}