/**
 * @author Axel
 */

// global map variables
var dvMap = null;	// mini map (bottom left container)
var dvMarkerLayer = new OpenLayers.Layer.Markers("Stations"); // marker layer for the mini map (contains only one marker indicating the station's position)

// variables used for the marker icon
var size = new OpenLayers.Size(21, 25);
var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
var dvIcon = new OpenLayers.Icon('pics/marker.GIF', size, offset);

// global variables of the Data Frame
var currentStation, currentPhenomenon;	// station and phenomenon selected 
var requestQueue = [];					// used whenever the timespan is changed, requests are  queued up and executed one by one
var seriesHandler = [];					// object that represents one timeseries
var chart = null;						// global chart variable, is instantiated each time the chart is rebuilt
// map settings used when the map is created
var mapSettings = {
	"map" : dvMap,
	"markerLayer" : dvMarkerLayer,
	"icon" : dvIcon
};
// time settings (only used if the timeseries is changed manually)
var timeSettings = {
	"timespan" : false,
	"start" : null,
	"end" : null
};

// initiate the mini map
function initDvMap() {
	mapSettings["map"] = new OpenLayers.Map("leftBoxBottom", {
		controls : []
	});
	var dvMapnik = new OpenLayers.Layer.OSM();
	mapSettings["map"].addLayer(dvMapnik);
	mapSettings["map"].setCenter(new OpenLayers.LonLat(13.41, 52.52)// Center of the map
	.transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
	new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
	), 3 // Zoom level
	);

	mapSettings["map"].addLayer(dvMarkerLayer);
}

// sets the meta data of the station selected
function setMetaData() {
	document.getElementById('leftBoxTopStationId').innerHTML = currentStation.getId();
	document.getElementById('leftBoxTopStationLabel').innerHTML = currentStation.getLabel();
	document.getElementById('leftBoxTopStationX').innerHTML = currentStation.getPoint().x;
	document.getElementById('leftBoxTopStationY').innerHTML = currentStation.getPoint().y;
}

// sets the Marker on the MiniMap to the position of the station selected
// and sets the center of the map to this marker
function setMiniMap() {
	mapSettings["markerLayer"].clearMarkers();
	var lonlat = new OpenLayers.LonLat(currentStation.getPoint().x, currentStation.getPoint().y);
	mapSettings["markerLayer"].addMarker(new OpenLayers.Marker(lonlat, mapSettings["icon"].clone()));
	mapSettings["map"].setCenter(lonlat);
}

// display the phenomena available (currently limited to water level measurements)
function setPhenomena() {
	var content = '';
	for (var i = 0; i < currentStation.phenomena.length; i++) {
		if (currentStation.phenomena[i] == currentPhenomenon)
			content += '<li><input type="radio" name="phenomena" class="phenomena" onclick="getSelectedPhenomenon()" value="' + currentStation.phenomena[i].id + '" checked>' + currentStation.phenomena[i].label + '</li>';
		else
			content += '<li><input type="radio" name="phenomena" class="phenomena" onclick="getSelectedPhenomenon()" value="' + currentStation.phenomena[i].id + '">' + currentStation.phenomena[i].label + '</li>';
	}
	document.getElementById('phenomenaList').innerHTML = content;
}

// handler for the phenomena list
function getSelectedPhenomenon() {
	var radios = document.getElementsByClassName('phenomena');
	var result = currentPhenomenon.id;
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			if (result == radios[i].value)
				return;
			else {
				result = radios[i].value;
				chart.clearSeries();
				table.resetTable();
				resetRaw();
				seriesHandler = [];
			}
		}
	}
	currentPhenomenon = getCurrentPhenById(result);
	parent.getTimeseriesJSON(result, currentStation.getId());
}

// displays all the timeseries available for the phenomenon selected
function setTimeseries() {
	seriesHandler = [];
	var content = '';
	for (var i = 0; i < currentPhenomenon.timeSeries.length; i++) {
		seriesHandler.push(new SeriesHandler(currentPhenomenon.timeSeries[i].id));
		content += seriesHandler[i].html;
	}
	document.getElementById('timeseriesList').innerHTML = content;

	reloadTimeseriesData();
}

// handler for the timeseries checkbox selection
function setChart(tsNumber) {
	var element = document.getElementsByClassName('timeseries')[tsNumber];
	if (element.checked) {
		if ( typeof currentPhenomenon.timeSeries[tsNumber].data != 'undefined') {
			chart.addSeries(currentPhenomenon.timeSeries[tsNumber].data.name, true, currentPhenomenon.timeSeries[tsNumber].data.name, currentPhenomenon.timeSeries[tsNumber].data.data);
		} else {
			parent.getTimeseriesDataJSON(tsNumber);
		}
	} else {
		chart.removeSeries(element.value);
	}

}


// executed whenever a new station is selected
// blends in the Data Frame and resets GUI elements
function setDataViewer(stationId, phenId) {
	chart = new LineChart();
	chart.initChart();
	chart.setTitle('Timeseries');
	chart.clearSeries();
	table.resetTable();
	resetRaw();
	seriesHandler = [];
	currentStation = getCurrentStationById(stationId);
	// get station selected

	currentPhenomenon = getCurrentPhenById(phenId);
	// get phenomenon clicked

	parent.showDataViewer();
	// show the data viewer

	setMetaData();
	setMiniMap();
	setPhenomena();
	getTimeseriesJSON(currentPhenomenon.id, currentStation.getId());
}

// returns the station from stationsArr with the id given
function getCurrentStationById(stationId) {
	for (var i = 0; i < parent.stationsArr.length; i++) {
		if (parent.stationsArr[i].getId() == stationId)
			return parent.stationsArr[i];
	}
}

// returns the phenomenon from the currentStation with the id given
function getCurrentPhenById(phenId) {
	for (var i = 0; i < currentStation.phenomena.length; i++) {
		if (currentStation.phenomena[i].id == phenId) {
			return currentStation.phenomena[i];
		}
	}
}

// requests all timeseries available for a phenomenon of one station
function getTimeseriesJSON(phenId, stationId) {
	loadTimeseries();
	// display loading spinner
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
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

// returns the XMLHTTPRequest, considering the browser used
function getXMLHttpRequest() {
	var httpReq = null;
	if (window.XMLHttpRequest) {
		httpReq = new XMLHttpRequest();
	} else if ( typeof ActiveXObject != "undefined") {
		httpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return httpReq;
}

// applies the changes from the timespan selection and triggers a reload of the data
function applyTimespan() {
	var startDate = $.datepicker.formatDate("yy-mm-dd", $("#datepickStart").datepicker("getDate"));
	var endDate = $.datepicker.formatDate("yy-mm-dd", $("#datepickEnd").datepicker("getDate"));

	timeSettings['start'] = startDate;
	timeSettings['end'] = endDate;
	timeSettings['timespan'] = true;

	reloadTimeseriesData();
	setView('chart');
}


// starts the requests for new timeseries data whenever the timespan is changed
function reloadTimeseriesData() {
	loadTimeseriesData();

	// reset the chart
	chart.clearSeries();

	// start new requests
	for (var i = 0; i < seriesHandler.length; i++) {
		if (seriesHandler[i].loaded)
			requestQueue.push(seriesHandler[i]);
	}

	getTimeseriesDataJsonFromQueue();
}

//	requests the timeseries data for the timeseries with the id given
function getTimeseriesDataJSON(id) {
	disableTimeseriesCheckboxes();
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
				try {
					ajaxMemory.timeseries = req.responseText;
					ajaxMemory.processData();
				} catch(e) {
					console.log(req.responseText);
					ajaxMemory.processData();
				}

			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if (timeSettings['timespan']) {
			var time = timeSettings['start'] + 'TZ/' + timeSettings['end'] + 'TZ';
			console.log('request=dataTime&timespan=' + time + '&ts=' + id);
			req.send('request=dataTime&timespan=' + time + '&tsId=' + id);
		} else {
			var currentDate = new Date();
			req.send('request=dataTime&tsId=' + id + '&timespan=PT24H/' + ISODateString(currentDate));
		}
	}
}

//	requests the timeseries data for all the timeseries that are saved in the requestQueue one by one
function getTimeseriesDataJsonFromQueue() {
	if (requestQueue.length == 0)
		return;
	ajaxMemory = requestQueue[0];
	var id = ajaxMemory.id;
	requestQueue.splice(0, 1);
	disableTimeseriesCheckboxes();
	req = parent.getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if (req.readyState == 4) {
				try {
					ajaxMemory.timeseries = req.responseText;
					ajaxMemory.processData();
				} catch(e) {
					console.log(req.responseText);
					ajaxMemory.processData();
				}
				getTimeseriesDataJsonFromQueue();
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if (timeSettings['timespan']) {
			var time = timeSettings['start'] + 'TZ/' + timeSettings['end'] + 'TZ';
			req.send('request=dataTime&timespan=' + time + '&tsId=' + id);
		} else {
			var currentDate = new Date();
			req.send('request=dataTime&tsId=' + id + '&timespan=PT24H/' + ISODateString(currentDate));
		}
	}
}

// converts a date into ISO format
function ISODateString(d) {
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}

	return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
}

// disable the timeseries' request buttons
function disableTimeseriesCheckboxes() {
	for (var i = 0; i < seriesHandler.length; i++) {
		seriesHandler[i].disableCheckbox();
	}
}

// enable the timeserie's request buttons
function enableTimeseriesCheckboxes() {
	for (var i = 0; i < seriesHandler.length; i++) {
		seriesHandler[i].enableCheckbox();
	}
}

// sets a loading animation as long as the timeseries are requested and processed
function loadTimeseries() {
	document.getElementById('timeseriesList').innerHTML = '<img style="margin: auto;" width="64" src="pics/globeSpinner.GIF">';
}

// show loading spinner
function loadTimeseriesData() {
	$("#centerBoxTopSpinner").show();
}

// hide loading spinner
function noloadTimeseriesData() {
	$("#centerBoxTopSpinner").hide();
}

// sets the view that is set by the dropdown menus
function setView(param) {
	if ($("#centerBoxMainChart").is(":visible"))
		$("#centerBoxMainChart").hide();
	if ($("#centerBoxMainTable").is(":visible"))
		$("#centerBoxMainTable").hide();
	if ($("#centerBoxMainRaw").is(":visible"))
		$("#centerBoxMainRaw").hide();
	if ($("#centerBoxMainDatepick").is(":visible"))
		$("#centerBoxMainDatepick").hide();
	if (param == 'chart') {
		$("#centerBoxMainChart").show();
	}
	if (param == 'table')
		$("#centerBoxMainTable").show();
	if (param == 'raw')
		$("#centerBoxMainRaw").show();
	if (param == 'datepick')
		$("#centerBoxMainDatepick").show();
}

// cleans the container with the raw json
function resetRaw() {
	document.getElementById("centerBoxMainRaw").innerHTML = '';
}

// adds the raw json view for a timeseries
function addRaw(id, json) {
	var container = document.createElement('div');
	container.setAttribute("style", "color: " + chart.chart.get(id).color + ";");
	container.setAttribute("class", "rawJson");
	container.setAttribute("id", "rawJson" + id);

	var link = document.createElement("a");
	var data = "application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
	link.setAttribute("class", "rawJsonDownloadLink");
	link.setAttribute("title", "Download As Json");
	link.setAttribute("href", "data:" + data);
	link.setAttribute("download:", id + ".json");
	link.setAttribute("target", "_blank");
	link.appendChild(document.createTextNode("Download"));

	var paragraph = document.createElement('p');
	paragraph.setAttribute("style", "white-space: pre; margin: auto; padding: 5px; text-align: left;");
	paragraph.appendChild(document.createTextNode(JSON.stringify(json, null, "\t")));

	container.appendChild(link);
	container.appendChild(paragraph);

	document.getElementById('centerBoxMainRaw').appendChild(container);
}