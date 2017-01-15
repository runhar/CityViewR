

var mapEl = document.querySelector('a-map');
      var currentLocationEl = document.querySelector('#current-location');
      var setProperty = window.AFRAME.utils.entity.setComponentProperty;
      
	  var show_menu_info = function() {
		  var id = this.getAttribute('id');
		  //console.log(id);
	  }

      // Creating an inverted cone and adding it to the scene as a place marker
      function addMarker(position, isFirst) {

        var marker = document.createElement('a-entity');
        var point = document.createElement('a-box');

        point.setAttribute('height', 0.3);
        point.setAttribute('width', 0.03);
		point.setAttribute('depth', 0.03);
        point.setAttribute('rotation', {x: 90, y: 0, z: 0});
        point.setAttribute('position', position);
        point.setAttribute('color', 'lime');
		point.setAttribute('class', 'bar');
		point.setAttribute('bar', 'wijkid');
		point.setAttribute('isFirst', true);
		//point.addEventListener('click', show_bar_info, false);

        marker.appendChild(point);

        mapEl.appendChild(marker);

        return marker;

      }
	  
	  function addVarButton(vartext, classname, id, count) {
		//var s = 'circleMenu'+count.toString();
		//var menuPanel = document.getElementById('menupanel0');
		var scene = document.getElementById('scene');
        var button = document.createElement('a-entity');
		var str = 'color:white'.concat('; text: ', vartext, ';');
        button.setAttribute('bmfont-text', str);
        button.setAttribute('class', classname);
		button.setAttribute('id', classname + id);
		button.setAttribute('scale', "1 1 1");
		button.setAttribute('width', "20");
		button.setAttribute('visible', true);
		var posx = -3;
		var cnt = count;
		console.log(cnt);
		if (classname == 'CBScatvar' && count < 10){
			posx = 0;
			button.setAttribute('visible', false);
		} else if (classname == 'CBScatvar' && count < 20){
			posx = 2;
			cnt = count - (Math.floor(count/10)*10);
			button.setAttribute('visible', false);
		} else if (classname == 'CBScatvar'){
			posx = 4;
			cnt = count - (Math.floor(count/10)*10);
			button.setAttribute('visible', false);
		} 
		var posy = 4 - (cnt/4);
		var position = posx + " " + posy + " -3.9";
		button.setAttribute('position', position);
		var menuPanel = document.createElement('a-plane');
		if (classname == 'CBStopcat'){
			var panelclass = 'topmenupanel';
		} else {
			var panelclass = 'submenupanel';
		}
		menuPanel.setAttribute('class', panelclass);
		menuPanel.setAttribute('id', panelclass + id);
		menuPanel.setAttribute('width', '3');
		menuPanel.setAttribute('height', '0.2');
		menuPanel.setAttribute('color', 'gray');
		menuPanel.setAttribute('position', "1.4 0.08 -0.01");
		menuPanel.setAttribute('submenu', id);
		//menuPanel.setAttribute('transparent', true);
		//menuPanel.setAttribute('opacity', 0.6);
		//menuPanel.setAttribute('cursor-listener');
		button.appendChild(menuPanel);
		scene.appendChild(button);
		return button;

      }

	  
function get_CBS_varnames (){
		//Get data from CBS Open Data
		//It's a long list, so we first get the categories
		//and fill them with variables.
		//Then add each cat with vars in CBSvarCache
	var count = 0;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			console.log(JSON.parse(xhr.responseText));
			variables = JSON.parse(xhr.responseText).value;
			//get the toplevel categories with ParentID is null
			for (var v = 0; v < variables.length; v++){
				if (variables[v]['ParentID'] == null){ 
					if (variables[v]['Title'] != 'Wijken en buurten' && variables[v]['Title'] != 'Regioaanduiding'){
						if (count > 12){
							count = 0;
						}
						CBSvar = {};
						CBSvar.id = variables[v]['ID'];
						CBSvar.text = variables[v]['Title'];
						CBSvar.button = addVarButton(CBSvar.text, 'CBStopcat', CBSvar.id, count);
						IsSelected[CBSvar.id] = false;
					//	CBSvarCache[CBSvar.id] = CBSvar;
						//choice.innerHTML += '<input type="checkbox" name="variable[]" value="' + variables[v]['Key'] + '"/> ' + variables[v]['Title']  + '<br/>';
						count++;
					}
				}
			}
			var panelNr = 1;
			var ypos = 0;
			//console.log(CBSvarCache);
			Object.keys(CBSvarCache).forEach(CBSvar => {
				/*
				var CBSvar = CBSvarCache[CBSvar];
				var panelstr = 'menuPanel'+panelNr.toString();
				console.log(panelstr);
				var panel = document.getElementById(panelstr);
				console.log(panel);
				var position = new THREE.Vector3();
				position.setFromMatrixPosition(panel.object3D.matrixWorld);
				console.log(position);
				//var rotation = new THREE.Vector3();
				//rotation.setFromMatrixRotation(panel.object3D.matrixWorld);
				//console.log(rotation);

				//var position = panel.position;
				if (ypos > 5) {
					ypos = 0;
					panelNr++;
				}
				//ypos = ypos - 0.2;
				ypos++;
				var x = position['z'].toString();
				//var y = ypos;
				var y = position['x'].toString();
				var z = position['y'].toString();
				var positionstring = x + ' ' + y + ' ' + z;
				//setProperty(CBSvar.button, 'id', CBSvar.id);
				setProperty(CBSvar.button, 'position', positionstring);
				//setProperty(CBSvar.button, 'rotation', rotation);
				
				setProperty(CBSvar.button, 'visible', true);
			  //console.log('button added');
			  */
            });
		}
	}
    

xhr.open('GET', 'http://opendata.cbs.nl/ODataApi/odata/83487NED/DataProperties', true);
xhr.send(null);
	//return variables;
	}
	
      // Whenever we have a new location, add new markers,
      // and update all markers positions.
      // If a marker is off the map, hide it


function get_CBS_varnames_local (){
		//This is just for development: read dataproperties from local json file
		//instead of calling cbs again and again
	var count = 0;
	loadJSON('dataproperties2015.json', function(response) {
			console.log(JSON.parse(response));
			variables = JSON.parse(response).value;
			//get the toplevel categories with ParentID is null
			for (var v = 0; v < variables.length; v++){
				if (variables[v]['ParentID'] == null){ 
					if (variables[v]['Title'] != 'Wijken en buurten' && variables[v]['Title'] != 'Regioaanduiding'){
						if (count > 12){
							count = 0;
						}
						CBSvar = {};
						CBSvar.id = variables[v]['ID'];
						CBSvar.text = variables[v]['Title'];
						CBSvar.button = addVarButton(CBSvar.text, 'CBStopcat', CBSvar.id, count);
						IsSelected[CBSvar.id] = false;
					//	CBSvarCache[CBSvar.id] = CBSvar;
						//choice.innerHTML += '<input type="checkbox" name="variable[]" value="' + variables[v]['Key'] + '"/> ' + variables[v]['Title']  + '<br/>';
						count++;
					}
				}
			}
			//var panelNr = 1;
			//var ypos = 0;
	});
	
	//build buttons for menuselection of submenus
	//which will be populated from parent menu
	for (var i = 0; i < 30; i++){
		btn = addVarButton('placeholder', 'CBScatvar', i, i);
	}
}	
	  
function onLocationUpdate(lat, long, width, height) {

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        // foursquare's free venues API
        loadJSON('geojson/WK_GM0363.geojson', function(response) {
        response = {"type" : "FeatureCollection", "features" : JSON.parse(response)};
		
		for (var i = 0; i < response['features'].length; i++){
			var district = {};
			district.center = turf.center(response['features'][i]['geometry']);
			district.long = district.center['geometry']['coordinates'][0];
			district.lat = district.center['geometry']['coordinates'][1];
			district.id = response['features'][i]['properties']['WK_CODE'];
			district.marker = addMarker({x: 0, y: 0, z: 0.15},true);
			districtCache[district.id] = district;
			}
				  //console.log(districtCache);
	  Object.keys(districtCache).forEach(markerId => {
              var district = districtCache[markerId];
              var position = mapEl.components.map.project(district.long, district.lat);
				//console.log(position);
              if (
                position.x > halfWidth
                || position.x < -halfWidth
                || position.y > halfHeight
                || position.y < -halfHeight
              ) {
                setProperty(district.marker, 'visible', false);
              } else {
                setProperty(district.marker, 'visible', true);
              }
				//setProperty(district.marker, 'class', 'bar');
				setProperty(district.marker, 'id', district.id);
              setProperty(district.marker, 'position', position);
			  extra_markers = create_extra_markers(position);
			  //console.log('hoera');
            });
      });
		var menuitems = document.getElementsByClassName('main_menu');
		//console.log(menuitems);
		for (var i = 0; i < menuitems.length; i++) {
			menuitems[i].addEventListener('click', show_menu_info, false);
		}
      }
	  
	  function create_extra_markers(position){
		 for (var i = 0; i<3; i++){
			var posx = position.x + 0.03 + i*0.03;
			var posy = position.y;
			var posz = 0.1;
			var extra_markers = [];
			console.log(position.x);
			var marker = document.createElement('a-entity');
			var point = document.createElement('a-box');

			point.setAttribute('height', 0.2);
			point.setAttribute('width', 0.03);
			point.setAttribute('depth', 0.03);
			point.setAttribute('rotation', {x: 90, y: 0, z: 0});
			point.setAttribute('position', {x: posx, y: posy, z: posz});
			point.setAttribute('color', 'fuchsia');
			point.setAttribute('class', 'bar');
			point.setAttribute('bar', 'wijkid');
			point.setAttribute('isFirst', false);
		//point.addEventListener('click', show_bar_info, false);

			marker.appendChild(point);

			mapEl.appendChild(marker);
			extra_markers.push(marker);
		 }
		  return extra_markers;
	  }
	  
      function onSelectionUpdate(lat, long, width, height) {

        var halfWidth = width / 2;
        var halfHeight = height / 2;

        // foursquare's free venues API
        fetch(`https://api.foursquare.com/v2/venues/explore?client_id=MWVIR52CTGVY0GZGFJB53UEUJRGJETB3SQI4KY1JWAEA1GIO&client_secret=TME3XHDYNTXQX0MMF3AME2TYW1F4KY5QUOI4RL5AP1P0GGXR&v=20161018&m=foursquare&ll=${lat},${long}&section=topPicks&time=any&day=any`)
          .then(res => res.json())
          .then(res => {
            res.response.groups[0].items.map(({venue}) => ({
              id: venue.id,
              lat: venue.location.lat,
              long: venue.location.lng,
            }))
            .filter(({id}) => !venueCache[id])
            .forEach(venue => {
              venue.marker = addMarker();
              venueCache[venue.id] = venue;
            });

            Object.keys(venueCache).forEach(markerId => {
              var venue = venueCache[markerId];
              var position = mapEl.components.map.project(venue.long, venue.lat);

              if (
                position.x > halfWidth
                || position.x < -halfWidth
                || position.y > halfHeight
                || position.y < -halfHeight
              ) {
                setProperty(venue.marker, 'visible', false);
              } else {
                setProperty(venue.marker, 'visible', true);
              }

              setProperty(venue.marker, 'position', position);
            });
          });
      }
	  
	  
function createMenuPanels(){
		//create menupanels to catch clicks and to color background menuitems
		var count = 0;
		
		for (var i = 0; i<52; i++){
			if (count > 12){
				count = 0;
			}
			var s = 'circleMenu'+count.toString();
			var circleMenu = document.getElementById(s);
			console.log(s);
			var menuPanel = document.createElement('a-plane');
			menuPanel.setAttribute('class', 'menuPanel');
			menuPanel.setAttribute('id', 'menuPanel' + count);
			menuPanel.setAttribute('width', '1');
			menuPanel.setAttribute('height', '0.5');
			menuPanel.setAttribute('color', 'lightblue');
			menuPanel.setAttribute('position', '0 0.1 0');
			menuPanel.setAttribute('rotation', '0 90 0');
			circleMenu.appendChild(menuPanel);
			count++;
		}

	}		
	  
	
	//get_CBS_varnames();
	get_CBS_varnames_local();
	
	
	//createMenuPanels();
	
      // Once the map is loaded
      mapEl.addEventListener('map-loaded', function() {
		mapEl.setAttribute('map', 'style', JSON.stringify(style));
        var geomData = mapEl.components.geometry.data;

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

	  