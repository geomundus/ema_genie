var filterInput = document.getElementById('filter-input');
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VvbXVuZHVzIiwiYSI6ImNqM3BoMDVlYjAwam8zMnBmNm1ndWs3bnYifQ.McVUJig2reapiExh7EPOpw';
var map = new mapboxgl.Map({
    container: 'map',
    zoom: 1,
    center: [0, 20],
    //style: 'mapbox://styles/mapbox/light-v10'
    style: 'mapbox://styles/geomundus/ckic4cpgt1cn919pmztwnpgum'
});

map.addControl(new mapboxgl.NavigationControl());

// filters for classifying ema_genie into five categories
const occupations = ['I recently graduated and I am looking for a job','I work in a private company','I am a 1st year Master student','I work for the government','I am a researcher/doing my PhD','I work at a university or public institute','Other'];
const fieldOfStudies = ['Natural Sciences (Astronomy, Biology, Chemistry, Earth Science, Environment and Physics)','Engineering and Technology','Social Sciences and Humanities','Geography','Economic Science','Cultural Science','Other'];
// colors to use for the categories
const colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

function fillLegend(listOfValues,className){
    for (i = 0; i < listOfValues.length; i++) {
        var layer = listOfValues[i];
        var color = colors[i];
        var item = document.createElement('div');
        item.className = className;
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    }
    $("#legend ." + className).hide();
}
map.hideLegendByLayer = function (layerId){
    $("#legend ." + layerId).hide();
}
map.showLegendByLayer = function(layerId){
    $("#legend ." + layerId).show();
}

fillLegend(occupations,'ema_genie_occupation');
fillLegend(fieldOfStudies,'ema_genie_fieldOfStudy');


var occupation1 = ['==', ['get', 'Main occupation'], occupations[0]];
var occupation2 = ['==', ['get', 'Main occupation'], occupations[1]];
var occupation3 = ['==', ['get', 'Main occupation'], occupations[2]];
var occupation4 = ['==', ['get', 'Main occupation'], occupations[3]];
var occupation5 = ['==', ['get', 'Main occupation'], occupations[4]];
var occupation6 = ['==', ['get', 'Main occupation'], occupations[5]];
var occupation7 = ['all', ['!=', ['get', 'Main occupation'], occupations[0]], 
                          ['!=', ['get', 'Main occupation'], occupations[1]],
                          ['!=', ['get', 'Main occupation'], occupations[2]],
                          ['!=', ['get', 'Main occupation'], occupations[3]],
                          ['!=', ['get', 'Main occupation'], occupations[4]],
                          ['!=', ['get', 'Main occupation'], occupations[5]]];

var fieldOfStudy1 = ['==', ['get', 'Field of study'], fieldOfStudies[0]];
var fieldOfStudy2 = ['==', ['get', 'Field of study'], fieldOfStudies[1]];
var fieldOfStudy3 = ['==', ['get', 'Field of study'], fieldOfStudies[2]];
var fieldOfStudy4 = ['==', ['get', 'Field of study'], fieldOfStudies[3]];
var fieldOfStudy5 = ['==', ['get', 'Field of study'], fieldOfStudies[4]];
var fieldOfStudy6 = ['==', ['get', 'Field of study'], fieldOfStudies[5]];
var fieldOfStudy7 = ['all', ['!=', ['get', 'Field of study'], occupations[0]], 
                          ['!=', ['get', 'Field of study'], occupations[1]],
                          ['!=', ['get', 'Field of study'], occupations[2]],
                          ['!=', ['get', 'Field of study'], occupations[3]],
                          ['!=', ['get', 'Field of study'], occupations[4]],
                          ['!=', ['get', 'Field of study'], occupations[5]]];

$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: 'https://docs.google.com/spreadsheets/d/1-QOlufagyT4kxVafcp1kQYRYRLpNy0SC67z2xVfuuvI/gviz/tq?tqx=out:csv&sheet=mapbox',
    dataType: "text",
    success: function (csvData) { makeGeoJSON(csvData); }
  });

  function makeGeoJSON(csvData) {

    csv2geojson.csv2geojson(csvData, {
      latfield: 'Latitude',
      lonfield: 'Longitude',
      delimiter: ','
    }, function (err, data) {

        map.on('load', function () {
            map.addSource('ema_genie', {
                'type': 'geojson',
                'data': data,
                'cluster': true,
                'clusterRadius': 80,
                'clusterProperties': {
                    'occupation1': ['+', ['case', occupation1, 1, 0]],
                    'occupation2': ['+', ['case', occupation2, 1, 0]],
                    'occupation3': ['+', ['case', occupation3, 1, 0]],
                    'occupation4': ['+', ['case', occupation4, 1, 0]],
                    'occupation5': ['+', ['case', occupation5, 1, 0]],
                    'occupation6': ['+', ['case', occupation6, 1, 0]],
                    'occupation7': ['+', ['case', occupation7, 1, 0]],
                    'fieldOfStudy1': ['+', ['case', fieldOfStudy1, 1, 0]],
                    'fieldOfStudy2': ['+', ['case', fieldOfStudy2, 1, 0]],
                    'fieldOfStudy3': ['+', ['case', fieldOfStudy3, 1, 0]],
                    'fieldOfStudy4': ['+', ['case', fieldOfStudy4, 1, 0]],
                    'fieldOfStudy5': ['+', ['case', fieldOfStudy5, 1, 0]],
                    'fieldOfStudy6': ['+', ['case', fieldOfStudy6, 1, 0]],
                    'fieldOfStudy7': ['+', ['case', fieldOfStudy7, 1, 0]]
                }
            });

            // circle and symbol layers for rendering individual ema_genie (unclustered points)
            map.addLayer({
                'id': 'ema_genie_occupation',
                'type': 'circle',
                'source': 'ema_genie',
                'filter': ['!=', 'cluster', true],
                'paint': {
                    'circle-color': [
                        'case',
                        occupation1,
                        colors[0],
                        occupation2,
                        colors[1],
                        occupation3,
                        colors[2],
                        occupation4,
                        colors[3],
                        occupation5,
                        colors[4],
                        occupation6,
                        colors[5],
                        occupation7,
                        colors[6],
                        colors[7]
                    ],
                    'circle-opacity': 0.9,
                    'circle-radius': 12
                }
            });
            map.showLegendByLayer('ema_genie_occupation');

            map.addLayer({
                'id': 'ema_genie_fieldOfStudy',
                'type': 'circle',
                'source': 'ema_genie',
                'filter': ['!=', 'cluster', true],
                'layout': {'visibility':'none'},
                'paint': {
                    'circle-color': [
                        'case',
                        fieldOfStudy1,
                        colors[0],
                        fieldOfStudy2,
                        colors[1],
                        fieldOfStudy3,
                        colors[2],
                        fieldOfStudy4,
                        colors[3],
                        fieldOfStudy5,
                        colors[4],
                        fieldOfStudy6,
                        colors[5],
                        fieldOfStudy7,
                        colors[6],
                        colors[7]
                    ],
                    'circle-opacity': 0.9,
                    'circle-radius': 12
                }
            });

            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            function updatePopup(e){
                var coordinates = e.features[0].geometry.coordinates.slice();

                //set popup text 
                //You can adjust the values of the popup to match the headers of your CSV. 
                // For example: e.features[0].properties.Name is retrieving information from the field Name in the original CSV. 
                var description = `<h3>` + e.features[0].properties["Main occupation"] + `</h3>` + 
                `<h4>` + `<b>` + `Address: ` + `</b>` + e.features[0].properties.Addresse + 
                `<br><b>` + `Field of study: ` + `</b>` + e.features[0].properties["Field of study"] +
                `<br><b>` + `EMJMD: ` + `</b>` + e.features[0].properties.EMJMD + 
                `<br><b>Start year:</b> ` + e.features[0].properties["Start year"] + `</h4>`;

                // Ensure that if the map is zoomed out such that multiples
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                //add Popup to map
                popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            }
  

            map.on('click', 'ema_genie_occupation', function (e) {
                map.flyTo({
                    center:[e.lngLat.lng, e.lngLat.lat],
                });

                updatePopup(e);

            });


            map.on('mouseenter', 'ema_genie_occupation', function (e) {
                map.getCanvas().style.cursor = 'pointer';      
                updatePopup(e);
            });

            map.on('mouseleave', 'ema_genie_occupation', function () {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.on('mouseenter', 'ema_genie_fieldOfStudy', function (e) {
                map.getCanvas().style.cursor = 'pointer';      
                updatePopup(e);
            });

            map.on('mouseleave', 'ema_genie_fieldOfStudy', function () {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });

            map.addLayer({
                'id': 'ema_genie_occupation_label',
                'type': 'symbol',
                'source': 'ema_genie',
                'filter': ['!=', 'cluster', true],
                'layout': {
                    'text-field': [
                        'number-format',
                        ['get', 'mag'],
                        { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
                    ],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-size': 10
                },
                'paint': {
                    'text-color': ['case',['<', ['get', 'Main occupation'], 3],'black','white']
                }
            });
            
            map.addLayer({
                'id': 'ema_genie_fieldOfStudy_label',
                'type': 'symbol',
                'source': 'ema_genie',
                'filter': ['!=', 'cluster', true],
                'layout': {
                    'visibility': 'none',
                    'text-field': [
                        'number-format',
                        ['get', 'mag'],
                        { 'min-fraction-digits': 1, 'max-fraction-digits': 1 }
                    ],
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-size': 10
                },
                'paint': {
                    'text-color': ['case',['<', ['get', 'Field of study'], 3],'black','white']
                }
            });
                                            
            // objects for caching and keeping track of HTML marker objects (for performance)
            map.markers = {};
            map.markersOnScreen = {};

            map.updateMarkers = function() {
                var newMarkers = {};
                var features = map.querySourceFeatures("ema_genie");

                // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
                // and add it to the map if it's not there already
                for (var i = 0; i < features.length; i++) {
                    var coords = features[i].geometry.coordinates;
                    var props = features[i].properties;
                    if (!props.cluster) continue;
                    var id = props.cluster_id;

                    var marker = map.markers[id];
                    if (!marker) {
                        var what = map.getLayer("ema_genie_occupation").isHidden()==true ? "fieldOfStudy" : "occupation";
                        var el = createDonutChart(props,what);
                        marker = map.markers[id] = new mapboxgl.Marker({
                            element: el
                        }).setLngLat(coords);
                        marker.getElement().addEventListener('click', map.markerClick);
                    }
                    newMarkers[id] = marker;

                    if (!map.markersOnScreen[id]) marker.addTo(map);
                }
                // for every marker we've added previously, remove those that are no longer visible
                for (id in map.markersOnScreen) {
                    if (!newMarkers[id]) map.markersOnScreen[id].remove();
                }
                map.markersOnScreen = newMarkers;
            }   

            // after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
            map.on('data', function (e) {
                if (e.sourceId !== 'ema_genie' || !e.isSourceLoaded) return;

                map.on('move',map.updateMarkers);
                map.on('moveend',map.updateMarkers);

                map.updateMarkers();
            });
            map.on("click",spiderifier.unspiderfy);
            // Retrieve cluster leaves on click
            map.markerClick = function() {
                var features = map.querySourceFeatures("ema_genie");
                var source="ema_genie";

                var clusterSource = map.getSource(source);
                spiderifier.unspiderfy();
                if (!features.length || map.getZoom()<7) {
                      return;
                } else {
                    clusterSource.getClusterLeaves(features[0].properties.cluster_id,100,0, function(err, leafFeatures){
                        if (err) {
                            return console.error('error while getting leaves of a cluster', err);
                        }
                        var markers = _.map(leafFeatures, function(leafFeature){
                            return leafFeature.properties;
                        });
                        spiderifier.spiderfy(features[0].geometry.coordinates, markers);
                        }
                    );
                }
            }
            


            var toggleableLayers = [{source: 'ema_genie',id:'ema_genie_occupation',name:'Occupation',className:'active'}, {source:'ema_genie',id:'ema_genie_fieldOfStudy',name:'Field of study',className:''}];
            
            // set up the corresponding toggle button for each layer
            for (var i = 0; i < toggleableLayers.length; i++) {
                var id = toggleableLayers[i].id;
                var name = toggleableLayers[i].name;
                var className = toggleableLayers[i].className;
                var source = toggleableLayers[i].source;
                var link = document.createElement('a');
                link.href = '#';
                link.className = className;
                link.textContent = name;
                link.dataset.id = id;
                link.dataset.source = source;

                link.onclick = function (e) {
                    var clickedLayer = this.dataset.id;
                    var notclickedLayers =  map.getStyle().layers.filter(layer => layer.id.indexOf("ema_genie")!==-1 && layer.id!==clickedLayer); 
                    e.preventDefault();
                    e.stopPropagation();
                    $("#menu .active").removeClass("active");

                    // toggle layer visibility by changing the layout object's visibility property
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    map.showLegendByLayer(clickedLayer);
                    this.className = 'active';
                    for(var i = 0; i < notclickedLayers.length; i++){                           
                        map.setLayoutProperty(notclickedLayers[i].id, 'visibility', 'none');
                        map.hideLegendByLayer(notclickedLayers[i].id);
                    }
                };
                
                var layers = document.getElementById('menu');
                layers.appendChild(link);
                map.updateMarkers();
            }
        });
    });
};
});
var spiderifier = new MapboxglSpiderifier(map, {
    onClick: function(e, spiderLeg){
  },
  markerWidth: 40,
  markerHeight: 40,
});
// code for creating an SVG donut chart from feature properties
function createDonutChart(props,what) {
    var offsets = [];
    var counts = [];
    for(var key in props){
        if(props.hasOwnProperty(key) && key.indexOf("cluster")==-1 && key.indexOf("point")==-1 && key.indexOf(what)>=0){
            counts.push(props[key]);
        }
    }
    var total = 0;
    for (var i = 0; i < counts.length; i++) {
        offsets.push(total);
        total += counts[i];
    }
    var fontSize =
        total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
    var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
    var r0 = Math.round(r * 0.6);
    var w = r * 2;

    var html =
        '<div><svg width="' +
        w +
        '" height="' +
        w +
        '" viewbox="0 0 ' +
        w +
        ' ' +
        w +
        '" text-anchor="middle" style="font: ' +
        fontSize +
        'px sans-serif; display: block">';

    for (i = 0; i < counts.length; i++) {
        html += donutSegment(
            offsets[i] / total,
            (offsets[i] + counts[i]) / total,
            r,
            r0,
            colors[i]
        );
    }
    html +=
        '<circle cx="' +
        r +
        '" cy="' +
        r +
        '" r="' +
        r0 +
        '" fill="white" /><text dominant-baseline="central" transform="translate(' +
        r +
        ', ' +
        r +
        ')">' +
        total.toLocaleString() +
        '</text></svg></div>';

    var el = document.createElement('div');
    el.innerHTML = html;
    return el.firstChild;
}
function donutSegment(start, end, r, r0, color) {
    if (end - start === 1) end -= 0.00001;
    var a0 = 2 * Math.PI * (start - 0.25);
    var a1 = 2 * Math.PI * (end - 0.25);
    var x0 = Math.cos(a0),
        y0 = Math.sin(a0);
    var x1 = Math.cos(a1),
        y1 = Math.sin(a1);
    var largeArc = end - start > 0.5 ? 1 : 0;

    return [
        '<path d="M',
        r + r0 * x0,
        r + r0 * y0,
        'L',
        r + r * x0,
        r + r * y0,
        'A',
        r,
        r,
        0,
        largeArc,
        1,
        r + r * x1,
        r + r * y1,
        'L',
        r + r0 * x1,
        r + r0 * y1,
        'A',
        r0,
        r0,
        0,
        largeArc,
        0,
        r + r0 * x0,
        r + r0 * y0,
        '" fill="' + color + '" />'
    ].join(' ');

}