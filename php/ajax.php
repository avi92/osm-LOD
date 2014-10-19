<?php
	
	// request stations that provide water level measurements (according services are hardcoded)
	function getStations(){		
		$json1 = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations?service=srv_1a5bde0a6d702f193f7be463402ec12f&phenomenon=phe_9eb82ebc5a37b3c8e97f736e85c3032a');
		$json2 = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations?service=srv_738111ed219f738cfc85be0c8d87843c&phenomenon=phe_9eb82ebc5a37b3c8e97f736e85c3032a');
		$json1 = json_decode($json1);
		$json2 = json_decode($json2);
		$json = json_encode(array_merge($json1, $json2));
		return $json;
	}
	
	// request timeseries of a station and a phenomenon given
	function getTimeseries($stationId, $phenId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/?phenomenon='.$phenId.'&station='.$stationId);
		return $json;
	}
	
	// request all available phenomena of a station
	function getPhenomena($stationId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena/phe_9eb82ebc5a37b3c8e97f736e85c3032a?station='.$stationId);
		return $json;
	}
	
	// request metadata of a timeseries
	function getTimeseriesMeta($tsId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/'.$tsId);
	}
	
	// get the measurements of a timeseries
	function getTimeseriesData($tsId){
		$opts = array('http' => array('ignore_errors' => true));
		$context = stream_context_create($opts);
		$url = 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/'.$tsId.'/getData?format=highcharts';
		$json = file_get_contents($url, FALSE, $context);
		return $json;
	}
	
	// get the measurements of a timeseries with a timespan given
	function getTimeseriesDataTime($tsId, $timespan){
		$opts = array('http' => array('ignore_errors' => true));
		$context = stream_context_create($opts);
		$url = 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/'.$tsId.'/getData?format=highcharts&timespan='.$timespan;
		$json = file_get_contents($url, FALSE, $context);
		return $json;
	}

	// the function executed is determined by the url parameters
	if(isset($_POST['request']) && $_POST['request'] == 'stations'){
		echo getStations();	
	}
	else if(isset($_POST['request']) && $_POST['request'] == 'phen'){
		echo getPhenomena($_POST['stationId']);
	}
	else if(isset($_POST['request']) && $_POST['request'] == 'timeseries'){
		echo getTimeseries($_POST['stationId'], $_POST['phenId']);
	}
	else if(isset($_POST['request']) && $_POST['request'] == 'data'){
		echo getTimeseriesData($_POST['tsId']);
	}
	else if(isset($_POST['request']) && $_POST['request'] == 'dataTime'){
		echo getTimeseriesDataTime($_POST['tsId'], $_POST['timespan']);
	}
	else if(isset($_POST['request']) && $_POST['request'] == 'levelReference'){
		echo getTimeseriesMeta($_POST['tsId']);
	}
	
    
?>