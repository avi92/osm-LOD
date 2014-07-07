<?php
    
    // $json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations');
	// $obj = json_decode($json);
// 	
	// print_r($json);
	
	function getStations(){		
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations');
		return $json;
	}
	
	function getTimeseries($stationId, $phenId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/?phenomenon='.$phenId.'&station='.$stationId);
		return $json;
	}
	
	function getPhenomena($stationId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena/?station='.$stationId);
		return $json;
	}
	
	function getTimeseriesData($tsId){
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/timeseries/'.$tsId.'/getData?format=highcharts');
		return $json;
	}

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
	
    
?>