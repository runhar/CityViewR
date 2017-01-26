var mapEl = document.querySelector('a-map');
var currentLocationEl = document.querySelector('#current-location');
var setProperty = window.AFRAME.utils.entity.setComponentProperty;
var queryData = ['Marokko_19', 'NederlandseAntillenEnAruba_20', 'Suriname_21', 'Turkije_22', 'OverigNietWesters_23'];
var menuHeaderColors = ['#393939', '#FF5A09', '#F3843E', '#FF9900', '#6E6E6E'];

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
    point.setAttribute('bar', id);
    point.setAttribute('id', id + 0);
    point.setAttribute('visible', false);
    marker.appendChild(point);
    mapEl.appendChild(marker);
    return marker;
}

function fillMenuButton(vartext, id, number, type, key) {
    var buttontext = document.getElementById('menutext' + number);
    var buttonpanel = document.getElementById('menupanel' + number);
    var buttonselect = document.getElementById('menuselect' + number);
    buttonpanel.setAttribute('selecthover', id);
    var menuHeaderColor = number;
    if (menuHeaderColor > 4) {
        menuHeaderColor = 4;
    }
    if (type == 'Topic') {
        vartext = '- ' + vartext;
        buttonselect.setAttribute('visible', true);
        buttonselect.setAttribute('selectvar', id);
        buttonselect.setAttribute('submenu', 'noAction');
        buttonpanel.setAttribute('submenu', 'noAction');
        buttonpanel.setAttribute('selectvar', id);
        if (cart.indexOf(key) > -1) {
            buttonselect.setAttribute('material', 'src: #checked;side:double;');
        } else {
            buttonselect.setAttribute('material', 'src: #unchecked;side:double;');
        }
    } else {
        buttonselect.setAttribute('visible', false);
        buttonpanel.setAttribute('submenu', id);
    }
    var str = 'color:white'.concat('; text: ', vartext.replace(';', '-'), ';');
    buttontext.setAttribute('bmfont-text', str);
    buttontext.setAttribute('visible', true);
    if (type == 'TopicGroup') {
        buttonpanel.setAttribute('opacity', .8);
        buttonpanel.setAttribute('color', 'lightslategray');
    } else if (type == 'Parent') {
        buttonpanel.setAttribute('opacity', .8);
        buttonpanel.setAttribute('color', menuHeaderColors[menuHeaderColor]);
    } else {
        buttonpanel.setAttribute('opacity', 0);
        buttonpanel.setAttribute('color', 'gray');
    }
}


function addVarButton(vartext, classname, id, count) {
    var selection_panel = document.getElementById('selection_panel');
    var button = document.createElement('a-entity');
    var str = 'color:white'.concat('; text: ', vartext, ';');
    button.setAttribute('bmfont-text', str);
    button.setAttribute('class', 'menubutton');
    button.setAttribute('id', 'menutext' + count);
    button.setAttribute('scale', "0.4 0.4 0.4");
    button.setAttribute('width', "20");
    button.setAttribute('visible', true);
    var posx = -0.6;
    var cnt = count;
    var posy = 0.4 - (cnt / 12);
    var position = posx + " " + posy + " 0.01";
    button.setAttribute('position', position);
    var menuPanel = document.createElement('a-plane');
    menuPanel.setAttribute('class', 'menupanel');
    menuPanel.setAttribute('id', 'menupanel' + count);
    menuPanel.setAttribute('width', '2.98');
    menuPanel.setAttribute('height', '0.19');
    menuPanel.setAttribute('opacity', '0.8');
    if (count == 0) {
        menuPanel.setAttribute('color', menuHeaderColors[0]);
    } else {
        menuPanel.setAttribute('color', 'lightslategray');
    }
    menuPanel.setAttribute('position', "1.4 0.08 -0.01");
    menuPanel.setAttribute('submenu', id);
    var menuSelect = document.createElement('a-entity');
    menuSelect.setAttribute('geometry', 'primitive: plane; width:0.15;height:0.15;');
    menuSelect.setAttribute('class', 'menuselect');
    menuSelect.setAttribute('id', 'menuselect' + count);
    menuSelect.setAttribute('color', 'black');
    menuSelect.setAttribute('position', "-1.4 0 0.02");
    menuSelect.setAttribute('material', 'src:#unchecked');
    menuSelect.setAttribute('selectvar', id);
    menuSelect.setAttribute('visible', false);
    menuPanel.appendChild(menuSelect);
    var menuHover = document.createElement('a-entity');
    menuHover.setAttribute('geometry', 'primitive: plane; width:3;height:0.2;color:white');
    menuHover.setAttribute('class', 'menuhover');
    menuHover.setAttribute('id', 'menupanel' + count + 'hover');
    menuHover.setAttribute('position', "0 0 -0.011");
    menuHover.setAttribute('visible', false);
    menuPanel.appendChild(menuHover);
    button.appendChild(menuPanel);
    selection_panel.appendChild(button);
    return button;
}


function addOwnDataButton(vartext) {
    var selection_panel = document.getElementById('selection_panel');
    var button = document.createElement('a-entity');
    var str = 'color:white'.concat('; text: ', vartext, ';');
    button.setAttribute('bmfont-text', str);
    button.setAttribute('class', 'owndatabutton');
    button.setAttribute('id', 'owndatatext');
    button.setAttribute('scale', " 0.4 0.4 0.4");
    button.setAttribute('width', "1");
    button.setAttribute('visible', true);
    button.setAttribute('position', '-0.5 -0.5 0.01');
    var menuPanel = document.createElement('a-plane');
    menuPanel.setAttribute('class', 'owndatapanel');
    menuPanel.setAttribute('id', 'owndatapanel');
    menuPanel.setAttribute('width', '3.2');
    menuPanel.setAttribute('height', '0.2');
    menuPanel.setAttribute('opacity', '1');
    menuPanel.setAttribute('color', 'black');
    menuPanel.setAttribute('position', "1.4 0.08 -0.01");
    menuPanel.setAttribute('action', 'toggleowndata');
    var menuSelect = document.createElement('a-entity');
    menuSelect.setAttribute('geometry', 'primitive: plane; width:0.15;height:0.15;');
    menuSelect.setAttribute('class', 'owndataselect');
    menuSelect.setAttribute('id', 'owndataselect');
    menuSelect.setAttribute('color', 'black');
    menuSelect.setAttribute('position', "-1.6 0 0.02");
    menuSelect.setAttribute('material', 'src:#unchecked');
    menuSelect.setAttribute('action', 'toggleowndata');
    menuSelect.setAttribute('visible', true);
    menuPanel.appendChild(menuSelect);
    button.appendChild(menuPanel);
    selection_panel.appendChild(button);
    return button;
}

function get_CBS_varnames() {
    //Get data categories from CBS Open Data
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(JSON.parse(xhr.responseText));
            variables = JSON.parse(xhr.responseText).value;
            console.log(variables);
            menuLookup = {};
            for (var i = 0, len = variables.length; i < len; i++) {
                menuLookup[variables[i].ID] = variables[i];
                varTitleLookup[variables[i].Key] = variables[i].Title;
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
            //remove some unnecessary items from menuData
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
            button = addVarButton(menuData[0].Title, 'CBStopcat', menuData[0].ID, 0);
            menuLookup[999] = menuData[0];
            for (var i = 0; i < menuData[0]['children'].length; i++) {
                button = addVarButton(menuData[0]['children'][i].Title, 'CBStopcat', menuData[0]['children'][i].ID, i + 1);
            }
            var owndatabutton = addOwnDataButton('Own data: EnergyPerformance.csv');
        }
    }
    //xhr.open('GET', 'https://opendata.cbs.nl/ODataApi/odata/83487NED/DataProperties', true);
    xhr.open('GET', 'https://opendata.cbs.nl/ODataApi/odata/83220NED/DataProperties', true);
    xhr.send(null);
}

function get_CBS_data() {
    //Get data for items in cart
    var infoelements = document.getElementsByClassName('infopanel_element');
    for (var i = 0; i < infoelements.length; i++) {
        infoelements[i].setAttribute('visible', false);
    }
    querystring = cart.join();
    queryData = querystring.split(',');
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(JSON.parse(xhr.responseText));
            var data = JSON.parse(xhr.responseText);
            var max = Object.keys(data).reduce(function(m, k) {
                return data[k] > m ? data[k] : m
            }, -Infinity);
            barsSet = setBars(data.value, max);
        }
    }
    //xhr.open('GET', "https://opendata.cbs.nl/ODataApi/odata/83487NED/TypedDataSet?$filter=(substringof('WK0363',WijkenEnBuurten))&$select=WijkenEnBuurten," + querystring, true);
    xhr.open('GET', "https://opendata.cbs.nl/ODataApi/odata/83220NED/TypedDataSet?$filter=(substringof('BU0363',WijkenEnBuurten))&$select=WijkenEnBuurten," + querystring, true);
    xhr.send(null);
}


function onLocationUpdate(lat, long, width, height) {
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    // Load demo data from Amsterdam (based on CBS wijken en buurten kaart)
  /*  loadJSON('geojson/WK_GM0363.geojson', function(response) {
        response = {
            "type": "FeatureCollection",
            "features": JSON.parse(response)
        };*/
        loadJSON('geojson/BU_GM0363_2015.geojson', function(response) {
            response = JSON.parse(response);
        for (var i = 0; i < response['features'].length; i++) {
            var district = {};
            district.center = turf.center(response['features'][i]['geometry']);
            district.long = district.center['geometry']['coordinates'][0];
            district.lat = district.center['geometry']['coordinates'][1];
            //district.id = response['features'][i]['properties']['WK_CODE'];
            //district.name = response['features'][i]['properties']['WK_NAAM'];
            district.id = response['features'][i]['properties']['BU_CODE'];
            district.name = response['features'][i]['properties']['BU_NAAM'];
            district.marker = addMarker({
                x: 0,
                y: 0,
                z: 0
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
            setProperty(district.marker, 'position', position);
            extra_markers = create_extra_markers(position, district.id);
        });
        //load default data
        //loadJSON('data/default_data.json', function(response) {
        loadJSON('data/default_data_2015.json', function(response) {
            var data = JSON.parse(response);
            var max = Object.keys(data).reduce(function(m, k) {
                return data[k] > m ? data[k] : m
            }, -Infinity);
            barsSet = setBars(data.value, queryData, max);
        });
    });
}

function setBars(data, max) {
    var bars = document.getElementsByClassName('bar');
    for (var i = 0; i < bars.length; i++) {
        bars[i].setAttribute('visible', false);
    }
    dataLookup = {};
    console.log(queryData);
    for (var i = 0, len = data.length; i < len; i++) {
        var district = data[i]['WijkenEnBuurten'].trim();
        dataLookup[district] = data[i];
    }
    nrOfItems = Object.keys(data[0]).length;
    var barColors = chroma.scale('YlOrBr').colors(nrOfItems - 1);
    var vals = Object.keys(data).map(function(key) {
        return data[key];
    });
    var heights = [];
    var barData = [];
    for (var i = 0; i < data.length; i++) {
        var wk = vals[i]['WijkenEnBuurten'];
        for (var j = 1; j < nrOfItems; j++) {
            var barNr = j - 1;
            var val = vals[i][queryData[barNr]];
            var color = barColors[barNr];
            heights.push(val);
            barData.push({
                "district": wk.trim() + barNr,
                "value": val,
                'color': color
            });
        }
    }
    var maxBarValue = Math.max.apply(Math, heights);
    var allBars = document.getElementsByClassName('bar');
    for (var i = 0; i < barData.length; i++) {
        var bar = document.getElementById(barData[i]['district']);
        var height = barData[i]['value'];
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(bar.object3D.matrixWorld);
        bar.setAttribute('height', (height / maxBarValue) * 1);
        bar.setAttribute('color', barData[i]['color']);
        bar.setAttribute('visible', true);
    }
}

function create_extra_markers(position, id) {
    for (var i = 0; i < 6; i++) {
        var barNr = i + 1;
        var posx = position.x + 0.03 + i * 0.03;
        var posy = position.y;
        var posz = 0;
        var extra_markers = [];
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
        point.setAttribute('bar', id);
        point.setAttribute('id', id + barNr);
        point.setAttribute('visible', false);
        marker.appendChild(point);
        mapEl.appendChild(marker);
        extra_markers.push(marker);
    }
    return extra_markers;
}

function createInfoScreen(screenID, strheader, strsubheader) {
    var screen = document.getElementById(screenID);
    var screenwidth = screen.getAttribute('width');
    var screenheight = screen.getAttribute('height');
    var scale = screenwidth / 4;
    var header = document.createElement('a-entity');
    header.setAttribute('id', screenID + '_header');
    header.setAttribute('width', screenwidth);
    header.setAttribute('height', screenheight * 0.1);
    header.setAttribute('scale', scale + " " + scale + " " + scale)
    header.setAttribute('position', "-" + ((screenwidth / 2) - 0.1) + " " + (0.4 * screenheight) + " 0.01");
    var str = 'color:white'.concat('; text: ', strheader, ';');
    header.setAttribute('bmfont-text', str);
    screen.appendChild(header);
    var subheader = document.createElement('a-entity');
    subheader.setAttribute('id', screenID + '_subheader');
    subheader.setAttribute('width', screenwidth);
    subheader.setAttribute('height', screenheight * 0.1);
    subheader.setAttribute('scale', scale + " " + scale + " " + scale)
    subheader.setAttribute('position', "-" + ((screenwidth / 2) - 0.1) + " " + (0.3 * screenheight) + " 0.01");
    var substr = 'color:white'.concat('; text: ', strsubheader, ';');
    subheader.setAttribute('bmfont-text', substr);
    screen.appendChild(subheader);
    for (var i = 0; i < 7; i++) {
        var bullit = document.createElement('a-plane');
        bullit.setAttribute('id', screenID + '_bullit' + i);
        bullit.setAttribute('class', screenID + '_element');
        bullit.setAttribute('width', 0.05 * screenheight);
        bullit.setAttribute('height', 0.05 * screenheight);
        bullit.setAttribute('color', 'red');
        bullit.setAttribute('position', "-" + ((0.5 * screenwidth) - (0.1 * screenheight)) + " " + (((0.2 * screenheight) - i * 0.1 * screenheight) + (screenheight / 40)) + " 0.01");
        screen.appendChild(bullit);
        var firstColumn = document.createElement('a-entity');
        firstColumn.setAttribute('id', screenID + '_firstcolumn' + i);
        firstColumn.setAttribute('class', screenID + '_element');
        firstColumn.setAttribute('width', screenwidth / 2);
        firstColumn.setAttribute('height', screenheight * 0.1);
        firstColumn.setAttribute('scale', scale + " " + scale + " " + scale)
        firstColumn.setAttribute('position', "-" + (0.4 * screenwidth) + " " + ((0.2 * screenheight) - i * 0.1 * screenheight) + " 0.01");
        var linestr = 'color:white'.concat('; text: ', 'Amsterdam' + i, ';');
        firstColumn.setAttribute('bmfont-text', linestr);
        screen.appendChild(firstColumn);
        var secondColumn = document.createElement('a-entity');
        secondColumn.setAttribute('id', screenID + '_secondcolumn' + i);
        secondColumn.setAttribute('class', screenID + '_element');
        secondColumn.setAttribute('width', screenwidth / 2);
        secondColumn.setAttribute('height', screenheight * 0.1);
        secondColumn.setAttribute('scale', scale + " " + scale + " " + scale)
        secondColumn.setAttribute('position', (0.3 * screenwidth) + " " + ((0.2 * screenheight) - i * 0.1 * screenheight) + " 0.01");
        var secondstr = 'color:white'.concat('; align:right; width:150; text: ', '1500' + i, ';');
        secondColumn.setAttribute('bmfont-text', secondstr);
        screen.appendChild(secondColumn);
    }
    var elements = document.getElementsByClassName(screenID + '_element');
    for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('visible', false);
    }
}
/*
function addViveControls() {
    var scene = document.getElementById("scene");
    var leftcontrol = document.createElement('a-entity');
    var rightcontrol = document.createElement('a-entity');
    leftcontrol.setAttribute('vive-controls', "hand: left");
    rightcontrol.setAttribute('vive-controls', "hand: right");
    scene.appendChild(leftcontrol);
    scene.appendChild(rightcontrol);
    var cursor = document.getElementById('cursor');
    cursor.setAttribute('fuse', false);
}
*/
function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                lines = processData(allText);
            }
        }
    }
    rawFile.send(null);
}


function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    var worldpoints = [];
    var colors = [];
    var colorscale = chroma.scale(['green', 'red']);
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(';'));
    }
    var maxvalue = -Infinity;
    for (var i = 1; i < lines.length; i++) {
        if (lines[i][2] > maxvalue) {
            maxvalue = lines[i][2];
        }
    }
    for (var i = 1; i < lines.length; i++) {
        if (lines[i][0] != undefined && lines[i][1] != undefined) {
            var lnglat = mapEl.components.map.project(lines[i][0], lines[i][1]);
        }
        lnglat.z = parseFloat(lines[i][2]) / maxvalue;
        var color = colorscale(lnglat.z);
        color = chroma(color).gl();
        colors.push(color);
        lnglat.z = lnglat.z + 0.5;
        worldpoints.push(lnglat);
    }
    otherdata = worldpoints;
    createDataSetPoints(otherdata, colors);
    return worldpoints;
}

function createDataSetPoints(data, colors) {
    var el = document.getElementById('dataset');
    var count = data.length;
    var geometry = new THREE.InstancedBufferGeometry();
    geometry.copy(new THREE.SphereBufferGeometry(.006));
    var translateArray = new Float32Array(count * 3);
    var vectorArray = new Float32Array(count * 3);
    var colorArray = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
        translateArray[i * 3 + 0] = data[i].x;
        translateArray[i * 3 + 1] = data[i].y;
        translateArray[i * 3 + 2] = data[i].z;
    }
    for (var i = 0; i < count; i++) {
        colorArray[i * 3 + 0] = colors[i][0];
        colorArray[i * 3 + 1] = colors[i][1];
        colorArray[i * 3 + 2] = colors[i][2];
    }
    geometry.addAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3, 1));
    geometry.addAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3, 1));
    var material = new THREE.ShaderMaterial({
        uniforms: {
            time: {
                value: 0
            }
        },
        vertexShader: [
            'attribute vec3 translate;',
            'attribute vec3 color;',
            'uniform float time;',
            'varying vec3 vColor;',
            'void main() {',
            '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + translate, 1.0 );',
            '  vColor = color;',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vColor;',
            'void main() {',
            '  gl_FragColor = vec4( vColor, 1.0 );',
            '}'
        ].join('\n')
    });
    var mesh = new THREE.Mesh(geometry, material);
    el.setObject3D('mesh', mesh);
}

//------------START------------------------------------------------------------

var menu = get_CBS_varnames();
createInfoScreen('infopanel', 'CityViewR', 'Amsterdam');
createInfoScreen('selection_screen', 'Selected variables', 'CBS data');

// Once the map is loaded
mapEl.addEventListener('map-loaded', function() {
    mapEl.setAttribute('map', 'style', JSON.stringify(style));
    var geomData = mapEl.components.geometry.data;
    //Amsterdam VRBase (TODO: get centre and zoom from geojson data)
    var long = 4.918273;
    var lat = 52.372523;
    // center the map on that location
    setProperty(mapEl, 'map.center', long + ' ' + lat);
    // and zoom in: 20 is very zoomed in, 0 is really zoomed out
    setProperty(mapEl, 'map.zoom', '10');
    // Place the marker in the correct position
    setProperty(currentLocationEl, 'position', mapEl.components.map.project(long, lat));
    setProperty(currentLocationEl, 'visible', true);
    onLocationUpdate(lat, long, geomData.width, geomData.height);
    var otherdataholder = readTextFile('data/EnergyPerformance.csv');
});
