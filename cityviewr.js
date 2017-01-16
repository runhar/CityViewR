var mapEl = document.querySelector('a-map');
var currentLocationEl = document.querySelector('#current-location');
var setProperty = window.AFRAME.utils.entity.setComponentProperty;

//helper function to find index of item in array
function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


// add bar which will show data by height and color
function addMarker(position, id) {
    var marker = document.createElement('a-entity');
    var point = document.createElement('a-box');
    point.setAttribute('height', 0.3);
    point.setAttribute('width', 0.03);
    point.setAttribute('depth', 0.03);
    point.setAttribute('rotation', {
        x: 90,
        y: 0,
        z: 0
    });
    point.setAttribute('position', position);
    point.setAttribute('color', 'lime');
    point.setAttribute('class', 'bar');
    point.setAttribute('bar', id + 0);
    marker.appendChild(point);
    mapEl.appendChild(marker);
    return marker;
}

function fillMenuButton(vartext, id, number, type) {
    var buttontext = document.getElementById('menutext' + number);
    var str = 'color:white'.concat('; text: ', vartext, ';');
    buttontext.setAttribute('bmfont-text', str);
    buttontext.setAttribute('visible', true);
    var buttonpanel = document.getElementById('menupanel' + number);
    buttonpanel.setAttribute('submenu', id);
    if (type == 'TopicGroup') {
        buttonpanel.setAttribute('opacity', .2);
    } else {
        buttonpanel.setAttribute('opacity', 0);
    }
}


function addVarButton(vartext, classname, id, count) {
    var scene = document.getElementById('scene');
    var button = document.createElement('a-entity');
    var str = 'color:white'.concat('; text: ', vartext, ';');
    button.setAttribute('bmfont-text', str);
    button.setAttribute('class', 'menubutton');
    button.setAttribute('id', 'menutext' + count);
    button.setAttribute('scale', "1 1 1");
    button.setAttribute('width', "20");
    button.setAttribute('visible', true);
    var posx = -3;
    var cnt = count;
    console.log(cnt);

    var posy = 4 - (cnt / 4);
    var position = posx + " " + posy + " -3.9";
    button.setAttribute('position', position);
    var menuPanel = document.createElement('a-plane');
    menuPanel.setAttribute('class', 'menupanel');
    menuPanel.setAttribute('id', 'menupanel' + count);
    menuPanel.setAttribute('width', '3');
    menuPanel.setAttribute('height', '0.2');
    menuPanel.setAttribute('color', 'gray');
    menuPanel.setAttribute('position', "1.4 0.08 -0.01");
    menuPanel.setAttribute('submenu', id);
    button.appendChild(menuPanel);
    scene.appendChild(button);
    return button;
}


function get_CBS_varnames() {
    //Get data from CBS Open Data
    //Creating a menu array of dicts, containing
    //id: level, title, key, type, items (childitems)
    //With this array build a menu
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(JSON.parse(xhr.responseText));
            variables = JSON.parse(xhr.responseText).value;
            console.log(variables);
            menuLookup = {};
            for (var i = 0, len = variables.length; i < len; i++) {
                menuLookup[variables[i].ID] = variables[i];
            }
            variables = variables.reduce(function(map, node) {
                map.i[node.ID] = node;
                node.children = [];
                node.ParentID === null ?
                    map.result.push(node) :
                    map.i[node.ParentID].children.push(node);
                return map;
            }, {
                i: {},
                result: []
            }).result;

            var remove = ['Wijken en buurten', 'Regioaanduiding', 'Postcode'];
            for (var i = 0; i < remove.length; i++) {
                var index = findWithAttr(variables, 'Title', remove[i]);
                if (index > -1) {
                    variables.splice(index, 1);
                }
            }
            var CBSdata = {};
            CBSdata.Title = 'CBS data';
            CBSdata.ID = 999;
            CBSdata.Type = 'TopicGroup';
            CBSdata.children = variables;
            menuData[0] = CBSdata;
            console.log(menuData);
            //remove some unnecessary items from menuData
            button = addVarButton(menuData[0].Title, 'CBStopcat', menuData[0].ID, 0);
            menuLookup[999] = menuData[0];
            for (var i = 0; i < menuData[0]['children'].length; i++) {
                button = addVarButton(menuData[0]['children'][i].Title, 'CBStopcat', menuData[0]['children'][i].ID, i + 1);
            }


        }

    }
    xhr.open('GET', 'http://opendata.cbs.nl/ODataApi/odata/83487NED/DataProperties', true);
    xhr.send(null);
}


function onLocationUpdate(lat, long, width, height) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    // Load demo data from Amsterdam (based on CBS wijken en buurten kaart)
    loadJSON('geojson/WK_GM0363.geojson', function(response) {
        response = {
            "type": "FeatureCollection",
            "features": JSON.parse(response)
        };
        for (var i = 0; i < response['features'].length; i++) {
            var district = {};
            district.center = turf.center(response['features'][i]['geometry']);
            district.long = district.center['geometry']['coordinates'][0];
            district.lat = district.center['geometry']['coordinates'][1];
            district.id = response['features'][i]['properties']['WK_CODE'];
            district.marker = addMarker({
                x: 0,
                y: 0,
                z: 0.15
            }, district.id);
            districtCache[district.id] = district;
        }
        Object.keys(districtCache).forEach(markerId => {
            var district = districtCache[markerId];
            var position = mapEl.components.map.project(district.long, district.lat);
            if (
                position.x > halfWidth ||
                position.x < -halfWidth ||
                position.y > halfHeight ||
                position.y < -halfHeight
            ) {
                setProperty(district.marker, 'visible', false);
            } else {
                setProperty(district.marker, 'visible', true);
            }
            setProperty(district.marker, 'id', district.id);
            setProperty(district.marker, 'position', position);
            extra_markers = create_extra_markers(position, district.id);
        });
    });
}

function create_extra_markers(position, id) {
    for (var i = 0; i < 3; i++) {
        var barNr = i + 1;
        var posx = position.x + 0.03 + i * 0.03;
        var posy = position.y;
        var posz = 0.1;
        var extra_markers = [];
        console.log(position.x);
        var marker = document.createElement('a-entity');
        var point = document.createElement('a-box');
        point.setAttribute('height', 0.2);
        point.setAttribute('width', 0.03);
        point.setAttribute('depth', 0.03);
        point.setAttribute('rotation', {
            x: 90,
            y: 0,
            z: 0
        });
        point.setAttribute('position', {
            x: posx,
            y: posy,
            z: posz
        });
        point.setAttribute('color', 'fuchsia');
        point.setAttribute('class', 'bar');
        point.setAttribute('bar', id + barNr);
        point.setAttribute('isFirst', false);
        marker.appendChild(point);
        mapEl.appendChild(marker);
        extra_markers.push(marker);
    }
    return extra_markers;
}

//------------START------------------------------------------------------------

var menu = get_CBS_varnames();

//get_CBS_varnames_local();

// Once the map is loaded

mapEl.addEventListener('map-loaded', function() {
    mapEl.setAttribute('map', 'style', JSON.stringify(style));
    var geomData = mapEl.components.geometry.data;
    //Amsterdam centre (TODO: get centre and zoom from geojson data)
    var long = 4.895168;
    var lat = 52.370216;
    // center the map on that location
    setProperty(mapEl, 'map.center', long + ' ' + lat);
    // and zoom in: 20 is very zoomed in, 0 is really zoomed out
    setProperty(mapEl, 'map.zoom', '10');
    // Place the marker in the correct position
    setProperty(currentLocationEl, 'position', mapEl.components.map.project(long, lat));
    setProperty(currentLocationEl, 'visible', true);
    onLocationUpdate(lat, long, geomData.width, geomData.height);
});
