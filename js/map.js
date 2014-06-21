/**
 * @author Axel
 */

// returns the number(in the station array) of the station selected
function getClosestStation(point) {
	var result = 0;
	var nearest = point.distanceTo(stationPoints[0]);
	for (var i = 1; i < stationPoints.length; i++) {
		var current = point.distanceTo(stationPoints[i]);
		if (current < nearest) {
			nearest = current;
			result = i;
		}
	}
	return result;
}


// sets a marker on the station selected
function clickEvent(point) {
	var selected = getClosestStation(point);

	markers.removeMarker(markers.markers[0]);
	var coordsTemp = stations[selected].geometry.coordinates + "";
	var coords = coordsTemp.split(",");
	markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(coords[0], coords[1])
		.transform(new OpenLayers.Projection("EPSG:4326"), 	// transform from WGS 1984
		new OpenLayers.Projection("EPSG:900913"))			// to Spherical Mercator Projection
		, icon.clone()));
}
