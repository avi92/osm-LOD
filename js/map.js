/**
 * @author Axel
 */

// returns the Station that is closest to the point given
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


// sets a marker on the station selected
function clickEvent(point) {
	var selected = getClosestStation(point);

	// markers.removeMarker(markers.markers[0]);
	// markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(selected.getPoint().x, selected.getPoint().y), icon.clone()));
	selected.showPopup();
}

// 	Constructor for Station Object
function Station(id, label, x, y){
	this.id 		= id;
	this.label 		= label;
	this.point		= new OpenLayers.Geometry.Point(x,y)
						.transform(new OpenLayers.Projection("EPSG:4326"),  // transform from WGS 1984
						new OpenLayers.Projection("EPSG:900913"));			// to Spherical Mercator Projection
	this.feature 	= new OpenLayers.Feature.Vector(this.point, {id: this.id, label: this.label});
}
	
// Getter
Station.prototype.getId 	= function()	{	return this.id;	};
Station.prototype.getLabel	= function()	{	return this.label;};
Station.prototype.getPoint	= function()	{	return this.point;};
Station.prototype.getFeature= function()	{	return this.feature;};
// Setter
Station.prototype.setId		= function(id)		{	this.id = id;};
Station.prototype.setLabel	= function(label)	{	this.label = label;};
Station.prototype.setPoint	= function(point)	{	this.point = point;};	
// returns the html code for the popup content
Station.prototype.buildPopup= function(){
	return '<table><tr><th colspan="2">Station Overview</th></tr><tr><td>Id</td><td>' + this.id + '</td></tr><tr><td>Label</td><td>' + this.label + '</td></tr></table>';
};
// shows the popup
Station.prototype.showPopup	= function(){
	this.feature.popup = new OpenLayers.Popup.FramedCloud("Popup", this.feature.geometry.getBounds().getCenterLonLat(), null, this.buildPopup(), null, true, null);
	map.addPopup(this.feature.popup);	
};



