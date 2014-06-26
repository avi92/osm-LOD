/**
 * @author Axel Virnich
 */


var temp = null;
var req = null;

// requests the phenomena available for the station selected
function getPhenomenaJSON(){
	$.getJSON('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena/?station=' + temp.getId(), function(data) {
    	var phenArr = [];			
		for(var i = 0; i < data.length; i++){
			phenArr.push(new Phenomenon(data[i].id, data[i].label));
		}
		temp.setPhenomena(phenArr);
		temp.showPopup();
		temp = null;
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

// requests all stations from the server and adds them to the server
// triggers the loadStations function
// during the loading process a loading animation is used
function getStationsJSON(param) {
	showLoadingAnimation();
	req = getXMLHttpRequest();
	if (req) {
		req.onreadystatechange = function() {
			if(req.readyState == 4){
				// console.log(req.responseText);
				// var json = JSON.parse(req.responseText);
				stations = JSON.parse(req.responseText);
				console.log(stations);
				loadStations();
				hideLoadingAnimation();
			}
		};
		req.open("POST", "php/ajax.php", true);
		req.setRequestHeader("Content-type", "x-www-form-urlencoded");
		req.send(param);
	}
}


