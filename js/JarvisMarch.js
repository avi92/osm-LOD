// Manhattan Distance
OpenLayers.Geometry.Point.prototype.mdist = function() {
	return Math.abs(this.x) + Math.abs(this.y);
};

OpenLayers.Geometry.Point.prototype.isFurther = function(point) {
	return this.mdist() > point.mdist();
};

// cross product of two vectors
OpenLayers.Geometry.Point.prototype.cross = function(point) {
	return this.x * point.y - this.y * point.x;
};

// sort first on x, then on y
OpenLayers.Geometry.Point.prototype.isLess = function(point) {
	var f = this.cross(point);
	return f > 0 || f == 0 && this.isFurther(point);
};

OpenLayers.Geometry.Point.prototype.relTo = function(point) {
	return new OpenLayers.Geometry.Point(this.x - point.x, this.y - point.y);
};


// used to calculate the convex hull of a collection of points
// JarvisMarch algorithm used follows the submission at (http://www.iti.fh-flensburg.de/lang/algorithmen/geo/jarvis.htm)
function JarvisMarch() {
	this.p = null;	// Input Points
	this.n = null;	// Amount of Input Points
	this.h = null;	// Amount of Result Points

	this.getHull = function() {
		var result = [];
		for (var i = 0; i < this.h - 1; i++) {
			result.push(this.p[i]);
		}
		return result;
	};

	this.computeHull = function(points) {
		this.p = points;
		this.n = points.length;
		this.h = 0;
		this.jarvisMarch();
		return this.getHull();
		// return h;
	};

	this.jarvisMarch = function() {
		var i = this.indexOfLowestPoint();
		do {
			this.exchange(this.h, i);
			i = this.indexOfRightmostPointFrom(this.p[this.h]);
			this.h++;
		} while(i > 0);
	};

	this.indexOfLowestPoint = function() {
		var i, min = 0;
		for ( i = 1; i < this.n; i++) {
			if (this.p[i].y < this.p[min].y || this.p[i].y == this.p[min].y && this.p[i].x < this.p[min].x) {
				min = i;
			}
		}
		return min;
	};

	this.indexOfRightmostPointFrom = function(point) {
		var i = 0, j;
		for ( j = 1; j < this.n; j++) {
			if (this.p[j].relTo(point).isLess(this.p[i].relTo(point))) {
				i = j;
			}
		}
		return i;
	};

	this.exchange = function(i, j) {
		var t = this.p[i];
		this.p[i] = this.p[j];
		this.p[j] = t;
	};

}

