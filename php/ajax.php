<?php
    
    // $json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations');
	// $obj = json_decode($json);
// 	
	// print_r($json);
	
	function getStations(){
		
		$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations');
		
		return $json;
	}
    
	
	echo getStations();
    
?>