/**
 * @author Axel
 */

var ajaxMemory = null;

function SeriesHandler(id) {
	this.timeseries = null;
	this.id = id + '';
	this.loaded = true;
	this.img = null;
	this.check = null;

	// sets the button and the image depending on the result of the timeseries data ajax request
	// status( 0 = data loaded, 1 = no data, 2 = error)
	this.setStatus = function(status) {
		this.setDOMVariables();
		switch(status) {
			case 0:
				this.img.parentElement.innerHTML = '<img src="pics/loaded.png" title="Data Request Succesful">Data loaded';
				this.check.parentElement.innerHTML = '<input type="button" onclick="reloadTimeseriesData()" value="Repeat Request" disable>';
				this.loaded = true;
				break;
			case 1:
				this.img.parentElement.innerHTML = '<img src="pics/noData.png" title="There is no data available for the current settings.">No Data available';
				this.check.parentElement.innerHTML = '<input type="button" onclick="reloadTimeseriesData()" value="Repeat Request" disable>';
				this.loaded = true;
				break;
			default:
				this.img.parentElement.innerHTML = '<img src="pics/error.png" title="The Server responded an error.">Error';
				this.check.parentElement.innerHTML = '<input type="button" onclick="reloadTimeseriesData()" value="Repeat Request" onclick="requestTimeseries(\'' + this.id + '\');">';
				this.loaded = false;
				break;
		}
	};

	// disables the button to load data
	this.disableCheckbox = function() {
		if(this.check == null){
			this.setDOMVariables();
		}	
		this.check.disabled = true;	
	};
	
	// enables the button to load data
	this.enableCheckbox = function(){
		if(this.check == null){
			this.setDOMVariables();
		}			
		if(!this.loaded)	this.check.disabled = false;
	};
	
	// starts ajax request to load the timeseries data
	this.requestTimeseries = function(){
		ajaxMemory = this;
		loadTimeseriesData();
		getTimeseriesDataJSON(this.id);	
	};
	
	// processes the timeseries data returned by the ajax request
	this.processData = function(){
		try{
			this.timeseries = JSON.parse(this.timeseries);
			if(this.timeseries.data.length > 0){
				this.setStatus(0);
				chart.addSeries(this.id, true, this.id, this.timeseries.data);
				if(requestQueue.length == 0) table.initTable();
				addRaw(this.id, this.timeseries);
				// document.getElementById("dataRaw").innerHTML = JSON.stringify(this.timeseries, null, "\t");
				document.getElementById("sh" + this.id).getElementsByTagName('th')[0].style.color = chart.chart.get(this.id).color;
			}
			else{
				this.setStatus(1);
			}
			this.disableCheckbox();
		}
		catch(e){
			console.log("Error: " + e);
			console.log(this.timeseries);
			if(typeof this.timeseries.userMessage != 'undefined'){
				alert(this.timeseries.userMessage + '');
			}
			this.setStatus(2);
		}
		enableTimeseriesCheckboxes();
		noloadTimeseriesData();		
	};
	
	// saves the position of the button and the image in the dom model
	this.setDOMVariables = function(){
		this.img = document.getElementById('sh' + this.id).getElementsByTagName('img')[0];
		this.check = document.getElementById('sh' + this.id).getElementsByTagName('input')[0];
	};
	
	// builds the html code for the timeseries represented
	this.buildHTML = function() {
		var img = '<img src="pics/noData.png" style="opacity: 0;">';
		var check = '<input type="button" style="display: none;" value="Request Data" onclick="requestTimeseries(\'' + this.id + '\');">';
		return '<div class="timeseriesData" id="sh' + this.id + '"><table><tr><th colspan="2">' + this.id + '</th></tr><tr><td>' + check + '</td><td>' + img + '</td></tr></table></div>';
	};

	this.html = this.buildHTML();
}	

// handler for the button
function requestTimeseries(id){
	for(var i = 0; i < seriesHandler.length; i++){
		if(seriesHandler[i].id == id){
			seriesHandler[i].requestTimeseries();
			return;
		}
	}
}
