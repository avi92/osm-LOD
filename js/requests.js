/**
 * @author Axel Virnich
 */


var temp = null;
var req = null;

// requests the phenomena available for the station selected
function getPhenomenaJSON(){
	$.getJSON('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena?phenomenon=phe_9eb82ebc5a37b3c8e97f736e85c3032a&station=' + temp.getId(), function(data) {
    	var phenArr = [];			
		for(var i = 0; i < data.length; i++){
			phenArr.push(new Phenomenon(data[i].id, data[i].label));
		}
		temp.setPhenomena(phenArr);
		setTimeout(function(){
			temp.showPopup();
		}, 100);
	});
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

// requests all stations from the server and adds them to the stations array
// triggers the loadStations function
// during the loading process a loading animation is used
function getStationsJSON() {
	showLoadingAnimation();
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4){
				stations = JSON.parse(req.responseText);
				loadStations();
				hideLoadingAnimation();
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send('request=stations');
	}
}

// requests all timeseries available for a phenomenon of one station
function getTimeseriesJSON(phenId, stationId) {
	frame.loadTimeseries();
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4){
				var timeseries = JSON.parse(req.responseText);
				frame.currentPhenomenon.timeSeries = timeseries;
				frame.setTimeseries();
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		req.send('request=timeseries&stationId=' + stationId + '&phenId=' + phenId);
	}
}

//	requests the timeseries data for the chart
function getTimeseriesDataJSON(id){
	frame.disableTimeseriesCheckboxes();
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4){
				try{
					frame.ajaxMemory.timeseries = req.responseText;
					frame.ajaxMemory.processData();	
				}
				catch(e){
					console.log(req.responseText);
					frame.ajaxMemory.processData();
				}
				
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		if(frame.timeSettings['timespan']){
			var time = frame.timeSettings['start'] + 'TZ/' + frame.timeSettings['end'] + 'TZ';
			console.log('request=dataTime&timespan=' + time + '&ts=' + id);
			req.send('request=dataTime&timespan=' + time + '&tsId=' + id);	
		}		
		else	req.send('request=data&tsId=' + id);
	}	
}