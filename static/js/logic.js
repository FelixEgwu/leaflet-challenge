// Store API

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

//Get request
d3.json(queryURL).then(function(data) {
    //Console log the retrieved data
    console.log(data);
    // function for creating features
    createFeatures(data.features);
});

//determine marker size
function markerSize(magnitude) {
    return magnitude * 2000;

};

//relationship between marker color and depth
function chooseColor(depth){
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
}

function createFeatures(earthquakeData) {

    // Define a function for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: 
        ${feature.geometry.coordinates[2]}</p>`);
    }
  
//
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

    //Point to layer used to alter markers
    pointToLayer: function(feature, latlng) {

        //Determine the style of markers based on properties
        var markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            stroke: true,
            weight: 0.5

        }
        return L.circle(latlng, markers);
    }

});

//send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

function createMap(earthquakes) {

    //Create tile layer
    var grayscale = L.tilelayer('https://api.mapbox.com/styles/v1/{style}/tiles/{z}/{x}/{y}?access_token={access_token}', {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>  © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        style: 'mapbox/light-v11',
        access_token: api_key

    });
    // Create our map, giving it the grayscale map and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 10,
        layers: [grayscale, earthquakes]

    });

    //legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap)
};

