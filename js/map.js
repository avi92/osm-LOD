/**
 * @author Axel
 */

// clears map from all stations
function clearMap() {
	clusters.removeAllFeatures();
}

//adds stations from the stations array to the cluster layer
function loadStations(){
    for(var i = 0; i < stations.length; i++){
    	var temp = stations[i].geometry.coordinates + "";
		var coords = temp.split(",");
		stationsArr.push(new Station(stations[i].properties.id, stations[i].properties.label, coords[0], coords[1], i));
		features.push(stationsArr[i].getFeature());
    }
    
    clusters.addFeatures(features);
}


//	returns the Station that is closest to the point given
function getClosestStation(point) {
	var result = 0;
	var nearest = point.distanceTo(stationsArr[0].getPoint());
	for (var i = 1; i < stationsArr.length; i++) {
		var current = point.distanceTo(stationsArr[i].getPoint());
		if (current < nearest) {
			nearest = current;
			result = i;
		}
	}
	return stationsArr[result];
}

// opens the popup of the station selected
function clickEvent(point) {	
	var selected = getClosestStation(point);

	selected.loadPhenomena();
}

// 	Constructor for Station Object
function Station(id, label, x, y, number) {
	this.id = id;
	this.label = label;
	this.point = new OpenLayers.Geometry.Point(x, y).transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
	new OpenLayers.Projection("EPSG:900913"));
	// to Spherical Mercator Projection
	this.feature = new OpenLayers.Feature.Vector(this.point, {
		id : this.id,
		label : this.label
	});
	this.phenomena = null;
	this.timeseries = null;
	this.number = number;	// represents the number of the station in the station array
}

// Getter
Station.prototype.getId = function() {
	return this.id;
};
Station.prototype.getLabel = function() {
	return this.label;
};
Station.prototype.getPoint = function() {
	return this.point;
};
Station.prototype.getFeature = function() {
	return this.feature;
};
// Setter
Station.prototype.setId = function(id) {
	this.id = id;
};
Station.prototype.setLabel = function(label) {
	this.label = label;
};
Station.prototype.setPoint = function(point) {
	this.point = point;
};
Station.prototype.setPhenomena = function(data) {
	this.phenomena = data;
};

// returns the html code for the popup content
Station.prototype.buildPopup = function() {
	var phens = '<tr><th>Phenomena:</th>';
	for (var i = 0; i < this.phenomena.length; i++) {
		if (i == 0)
			phens += '<td><a href="#' + this.phenomena[i].id + '" onclick="frame.setDataViewer(\'' + this.id + '\',\'' + this.phenomena[i].id + '\')">' + this.phenomena[i].label + '</a></td></tr>';
		else
			phens += '<tr><td></td><td><a href="#' + this.phenomena[i].id + '" onclick="frame.setDataViewer(\'' + this.id + '\',\'' + this.phenomena[i].id + '\')">' + this.phenomena[i].label + '</a></td></tr>';
	}
	return '<table cellpadding="5"><tr><th colspan="2">Station Overview</th></tr><tr><td><b>Id:</b></td><td>' + this.id + '</td></tr><tr><td><b>Label:</b></td><td>' + this.label + '</td></tr>' + phens + '</table>';
};
Station.prototype.buildWaterLevelPopup = function(){
	
};
// shows the popup
Station.prototype.showPopup = function() {
	this.feature.popup = new OpenLayers.Popup.FramedCloud("Popup", this.feature.geometry.getBounds().getCenterLonLat(), null, this.buildPopup(), null, true, null);
	map.addPopup(this.feature.popup);
};

// loads the phenomena of the station(if called up for the first time) by triggering a json requests
Station.prototype.loadPhenomena = function() {
	if (this.phenomena == null) {
		temp = this;
		getPhenomenaJSON();
	} else {
		this.showPopup();
	}

};

// Constructor for Phenomenon Class
function Phenomenon(id, label) {
	this.id = id;
	this.label = label;
}

// shows the animation div at the center of the screen
function showLoadingAnimation() {
	var w = $("#basicMap").width();
	var h = $("#basicMap").height();

	$("#loadingAnimation").css('top', ((h / 2 ) - ($('#loadingAnimation').height() / 2 ) ));
	$("#loadingAnimation").css('left', ((w / 2 ) - ($('#loadingAnimation').width() / 2 ) ));
	$('#loadingAnimation').css('position', 'absolute');
	$('#loadingAnimation').css('z-index', '999');
	$('#basicMap').css('opacity', '0.5');

	$('#loadingAnimation').show();
}

// hides the animation div
function hideLoadingAnimation() {
	$('#loadingAnimation').hide();
	$('#basicMap').css('opacity', '1');
}

// shows the data.php as an iframe in the center of the screen with the data of the station selected
function showDataViewer() {
	var w = $("body").width();
	var h = $("body").height();

	frame.document.getElementById('linkToOpenTab').href = 'dataTab.php?stationId=' + frame.currentStation.getId();

	$("#dataViewer").css('width', (w * 0.9 ));
	$("#dataViewer").css('height', 553);
	$("#dataViewer").css('top', ((h / 2 ) - ($('#dataViewer').height() / 2 ) ));
	$("#dataViewer").css('left', ((w / 2 ) - ($('#dataViewer').width() / 2 ) ));
	$('#dataViewer').css('position', 'absolute');
	$('#dataViewer').css('z-index', '999');
	$('#basicMap').css('opacity', '0.5');

	$('#dataViewer').show();
}

// hides the animation div
function hideDataViewer() {
	$('#dataViewer').hide();
	$('#basicMap').css('opacity', '1');
}
