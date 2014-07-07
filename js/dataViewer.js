/**
 * @author Axel
 */

var dvMap, dvMarkerLayer, dvIcon, currentStation, currentPhenomenon;	// gloabl map variables
var chartArray = [];

function initDvMap(){
	dvMap = new OpenLayers.Map("leftBoxBottom", {controls: []});
	var dvMapnik = new OpenLayers.Layer.OSM();
	dvMap.addLayer(dvMapnik);
	dvMap.setCenter(new OpenLayers.LonLat(13.41, 52.52)// Center of the map
	.transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
	new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
	), 1 // Zoom level
	);
	
	dvMarkerLayer = new OpenLayers.Layer.Markers("Stations");
	dvMap.addLayer(dvMarkerLayer);
	
	var size = new OpenLayers.Size(21, 25);
	var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	dvIcon = new OpenLayers.Icon('pics/marker.GIF', size, offset);
	
	dvMap.events.register('click', dvMap, function(evt) {
		//console.log("Someone clicked on the map!");
		var lonlat = map.getLonLatFromViewPortPx(evt.xy);
		console.log("Longitude: " + lonlat.lon + " Latitude: " + lonlat.lat);
		dvMarkerLayer.addMarker(new OpenLayers.Marker(lonlat, dvIcon.clone()));
	});
}

// sets the meta data of the station selected
function setMetaData(){
	document.getElementById('leftBoxTopStationId').innerHTML = currentStation.getId();
	document.getElementById('leftBoxTopStationLabel').innerHTML = currentStation.getLabel();
	document.getElementById('leftBoxTopStationX').innerHTML = currentStation.getPoint().x;
	document.getElementById('leftBoxTopStationY').innerHTML = currentStation.getPoint().y;
}

// sets the Marker on the MiniMap to the position of the station selected
// and sets the center of the map to this marker
function setMiniMap(){
	dvMarkerLayer.clearMarkers();
	var lonlat = new OpenLayers.LonLat(currentStation.getPoint().x, currentStation.getPoint().y);
	dvMarkerLayer.addMarker(new OpenLayers.Marker(lonlat, dvIcon.clone()));
	dvMap.setCenter(lonlat);
}

// display the phenomena available
function setPhenomena(){
	var content = '';
	for(var i = 0; i < currentStation.phenomena.length; i++){
		if(currentStation.phenomena[i] == currentPhenomenon)	content += '<li><input type="radio" name="phenomena" class="phenomena" onclick="getSelectedPhenomenon()" value="' + currentStation.phenomena[i].id + '" checked>' + currentStation.phenomena[i].label + '</li>';
		else 	content += '<li><input type="radio" name="phenomena" class="phenomena" onclick="getSelectedPhenomenon()" value="' + currentStation.phenomena[i].id + '">' + currentStation.phenomena[i].label + '</li>';
	}
	document.getElementById('phenomenaList').innerHTML = content;
}

// handler for the phenomena list
function getSelectedPhenomenon(){
	var radios = document.getElementsByClassName('phenomena');
	var result = currentPhenomenon.id;
	for(var i = 0; i < radios.length; i++){
		if(radios[i].checked){
			if(result == radios[i].value)	return; 
			else{
				result = radios[i].value;
				chart.clearSeries();	
			} 							
		}	
	}
	currentPhenomenon = getCurrentPhenById(result);
	parent.getTimeseriesJSON(result, currentStation.getId());
}


// displays all the timeseries available for the phenomenon selected
function setTimeseries(){
	var content = '';
	for(var i = 0; i < currentPhenomenon.timeSeries.length; i++){
		content += '<li><input type="checkbox" onclick="setChart(' + i + ')" class="timeseries" name="timeseries" value="' + currentPhenomenon.timeSeries[i].id + '">' + currentPhenomenon.timeSeries[i].id + '</li>';
	}
	document.getElementById('timeseriesList').innerHTML = content;
}


// handler for the timeseries checkbox selection
function setChart(tsNumber){
	var element = document.getElementsByClassName('timeseries')[tsNumber];
	if(element.checked){
		if(typeof currentPhenomenon.timeSeries[tsNumber].data != 'undefined'){
			chart.addSeries(currentPhenomenon.timeSeries[tsNumber].data.name, true, currentPhenomenon.timeSeries[tsNumber].data.name, currentPhenomenon.timeSeries[tsNumber].data.data);		}
		else{
			parent.getTimeseriesDataJSON(tsNumber);	
		}
	}
	else{
		chart.removeSeries(element.value);
	}
	
}

function setDataViewer(stationId, phenId){	
	chart.clearSeries();	
	currentStation = getCurrentStationById(stationId);	// get station selected

	currentPhenomenon = getCurrentPhenById(phenId);		// get phenomenon clicked
	
	parent.showDataViewer();				// show the data viewer
	
	setMetaData();
	setMiniMap();
	setPhenomena();
	getTimeseriesJSON(currentPhenomenon.id, currentStation.getId());
}


// returns the station from stationsArr with the id given
function getCurrentStationById(stationId){
	for(var i = 0; i < parent.stationsArr.length; i++){
		if(parent.stationsArr[i].getId() == stationId)	return parent.stationsArr[i];
	}
}

// returns the phenomenon from the currentStation with the id given
function getCurrentPhenById(phenId){
	for(var i = 0; i < currentStation.phenomena.length; i++){
		if(currentStation.phenomena[i].id == phenId){
			return currentStation.phenomena[i];
		}
	}
}

// requests all timeseries available for a phenomenon of one station
function getTimeseriesJSON(phenId, stationId) {
	loadTimeseries();
	req = parent.getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4){
				var timeseries = JSON.parse(req.responseText);
				currentPhenomenon.timeSeries = timeseries;
				setTimeseries();
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send('request=timeseries&stationId=' + stationId + '&phenId=' + phenId);
	}
}

function loadTimeseriesData(){
	$("input[name='timeseries']").attr("disabled", "disabled");	// disable checkboxes as long as data is being loaded
}

// sets a loading animation as long as the timeseries are requested and processed
function loadTimeseries(){
	document.getElementById('timeseriesList').innerHTML = '<img style="margin: auto;" width="64" src="pics/globeSpinner.GIF">';	
}
