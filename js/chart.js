// -------------------
// - LineChart class -
// -------------------



// Constructor
function LineChart() {
	// default line chart options for time related data
	this.options = {
		chart : {
			renderTo : 'centerBoxMainChart',
			type : 'line',
			zoomType : 'xy',
			reflow: true,
			style :{
				fontFamily: 'serif'
			}
		},
		title : {
			style: {
				fontFamily: 'serif',
				fontSize: '22px'
			}
		},
		// subtitle : {
			// x : -20,
			// y : 30
		// },
		xAxis : {
			id : 'x-Axis',
			type: 'datetime'
		},
		yAxis : {
			id : 'y-Axis',
			min: 0
		},
		plotOptions : {
			series : {
				point : {
					events : {
						 click: function() {
                            // console.log(this.name);
                        }
					}
				}
			}
		},
		legend : {
			enabled : false,	// legend is replaced by timeseries info containers (bottom right)
			layout : 'vertical',
			align : 'left',
			floating: true,
			verticalAlign : 'top',
			borderWidth : 0
		}
	};
	this.chart = new Highcharts.Chart(this.options);
}

// Setting the variables
LineChart.prototype.chart;
LineChart.prototype.options;

// --- Getter and setter ---
LineChart.prototype.getChart = function() {
	return this.chart;
};
LineChart.prototype.setChart = function(chart) {
	this.chart = chart;
};
LineChart.prototype.setOptions = function(options) {
	this.options = options;
};
LineChart.prototype.getOptions = function() {
	return this.options;
};


// adds a point to an existing series
// point has to fit the current data scheme
LineChart.prototype.addPoint = function(series, point) {
	this.chart.series[series].addPoint(point);
};

// adds a new line to the chart - data array has to fit the current data scheme
// visible determnies whether the line should be displayed immediately
LineChart.prototype.addSeries = function(title, visible, id, data) {
	var options = {
		name : title,
		visible : visible,
		id : id,
		data : data,
		turboThreshold : 0
	};
	this.chart.addSeries(options);
};

// remove all series displayed
LineChart.prototype.clearSeries = function(){
	while(this.chart.series.length > 0){
 		this.chart.series[0].remove();	
	}
};

// removes the series with the name given
LineChart.prototype.removeSeries = function(name){
	for(var i = 0; i < this.chart.series.length; i++){
		if(this.chart.series[i].name){
			this.chart.series[i].remove();
			return;
		}
	}
};

// returns all the series of the chart as array
LineChart.prototype.getAllSeries = function() {
	return this.chart.series;
};

// returns the current options of the Chart Object
LineChart.prototype.getChartOptions = function(){
	return this.chart.options;
};

// returns the series with the name given
LineChart.prototype.getSeries = function(name) {
	return this.chart.series[name];
};

// renders the chart to the chart div
LineChart.prototype.initChart = function() {
	$(function() {
		this.chart;
	});
};

// redraws the chart - only necessary if data has been added!
LineChart.prototype.redraw = function() {
	this.chart.redraw();
};

// removes the chart and saves the latest chart options
LineChart.prototype.remove = function() {
	this.setOptions(this.getChartOptions());
	this.chart.destroy();
};

// set the categories of the axes
// axis = x or y, categories as array
LineChart.prototype.setAxisCategories = function(axis, categories) {
	if (axis == 'x') {
		this.chart.xAxis[0].setCategories(categories);
	} else if (axis == 'y') {
		this.chart.yAxis[0].setCategories(categories);
	}
};


// set Title of the axes
// axis = x or y
LineChart.prototype.setAxisTitle = function(axis, title) {
	if (axis == 'x') {
		this.chart.xAxis[0].setTitle({
			text : title
		});
	} else if (axis == 'y') {
		this.chart.yAxis[0].setTitle({
			text : title
		});
	}
};

// set Subtitle of the Chart
LineChart.prototype.setSubtitle = function(subtitle) {
	this.chart.setTitle(null, {
		text : subtitle
	});
};

// set Title of the Chart
LineChart.prototype.setTitle = function(title) {
	this.chart.setTitle({
		text : title
	});
};

// compare function used by sort method for sorting the data arrays by date
LineChart.prototype.compare = function(a,b) {
  if (a.x < b.x)
     return -1;
  if (a.x > b.x)
    return 1;
  return 0;
};

// --------------------------
// - End of LineChart class -
// --------------------------