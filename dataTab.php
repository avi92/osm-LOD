<?php
$stationjson = '';
if (isset($_GET['stationId'])) {
	$stationjson = getStationById($_GET['stationId']);
}
function getStationById($stationId) {
	$json = file_get_contents('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/stations/' . $stationId);
	return $json;
}
?>

<!DOCTYPE html>
<html>
	<head>
		<title>avi92 | ifgi Münster</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8;" />
		<style type="text/css">
			html, body {
				width: 100%;
				margin: 0;
				z-index: 0;
			}
			#content {
				width: 99.9%;
				height: 700px;
				border: 1px solid black;
				margin: auto;
			}
			table.editablegrid {
				border-collapse: collapse;
				border: 1px solid #CCB;
				width: 800px;
			}
			table.editablegrid td, table.editablegrid th {
				padding: 5px;
				border: 1px solid #E0E0E0;
			}
			table.editablegrid th {
				background: #E5E5E5;
				text-align: center;
			}
			.rawJson {
				border: 1px inset black;
				width: 94%;
				margin: 10px;
			}

		</style>
		<link rel="stylesheet" type="text/css" href="style/dataViewer.css" />
		<link rel="stylesheet" type="text/css" href="style/lib/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" href="style/lib/editablegrid-2.0.1.css" />

		<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
		<script src="js/lib/jquery.js" type="text/javascript"></script>
		<script src="js/lib/highcharts.js" type="text/javascript"></script>
		<script src="js/map.js" type="text/javascript"></script>
		<script src="js/dataViewer.js" type="text/javascript"></script>
		<script src="js/chart.js" type="text/javascript"></script>
		<script src="js/SeriesHandler.js" type="text/javascript"></script>
		<script src="js/lib/jquery-ui.js" type="text/javascript"></script>
		<script src="js/lib/editablegrid-2.0.1.js" type="text/javascript"></script>
		<script src="js/table.js" type="text/javascript"></script>
		<script type="text/javascript">
			var table = new Table();
			$(document).ready(function() {
				initDvMap();
				$("#centerBoxTopSpinner").hide();
				$("#centerBoxMainTable").hide();
				$("#centerBoxMainRaw").hide();
				$("#centerBoxMainDatepick").hide();
			});

			$(function() {
				$(document).tooltip();
				$("#datepickStart").datepicker({
					changeMonth : true,
					onSelect : function(selectedDate) {
						$("#datepickEnd").datepicker("option", "minDate", selectedDate);
						var selDate = $("#datepickStart").datepicker("getDate");
						var today = new Date();
						selDate.setMonth(selDate.getMonth() + 1);
						if (selDate > today)
							$("#datepickEnd").datepicker("option", "maxDate", today);
						else
							$("#datepickEnd").datepicker("option", "maxDate", selDate);
					}
				});
				$("#datepickEnd").datepicker({
					changeMonth : true,
					onSelect : function(selectedDate) {
						$("#datepickStart").datepicker("option", "maxDate", selectedDate);
					}
				});
			});

<?php
if (sizeof($stationjson) > 0) {
	echo 'var json = \'' . $stationjson . '\';';
	echo 'var stationSelected = true;';
}
?>
	currentStation = null;
	currentPhenomenon = null; 
	if (stationSelected) {
		var json = JSON.parse(json);
		console.log("Station: " + json);
		currentStation = new Station(json.properties.id, json.properties.label, json.geometry.coordinates[0], json.geometry.coordinates[1], 0);
		getPhenomenaJSON(currentStation.getId());
	}

	var temp = null;
	var req = null;
	var table = null;

	// requests the phenomena available for the station selected
	function getPhenomenaJSON(stationId) {
		$.getJSON('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena/?station=' + stationId, function(data) {
			var phenArr = [];
			for (var i = 0; i < data.length; i++) {
				phenArr.push(new Phenomenon(data[i].id, data[i].label));
			}
			currentStation.setPhenomena(phenArr);
			currentPhenomenon = currentStation.phenomena[0];
			
			setMetaData();
			setMiniMap();
			setPhenomena();
			getTimeseriesJSON(currentPhenomenon.id, currentStation.getId());	
			
			chart = new LineChart();
			table = new Table();
			chart.initChart();
			chart.setTitle('Timeseries');	
			chart.clearSeries();
			seriesHandler = [];	
		});
	}
		</script>
	</head>
	<body>
		<div id="content">
			<!-- Top Navigation Bar -->
			<div id="topNav" >
				<nav>
					<ul>
						<li class = "cat2">
							<a href="#">View As</a>
							<ul>
								<li>
									<a onclick="setView('chart')" href="#">Chart</a>
								</li>
								<li>
									<a onclick="setView('table')" href="#">Table</a>
								</li>
								<li>
									<a onclick="setView('raw')" href="#">Raw (JSON)</a>
								</li>
							</ul>
						</li>
						<li class = "cat1">
							<a onclick="setView('datepick')" href="#">Set Timespan</a>
						</li>
						<li class="cat3" id="centerBoxTopSpinner">
							<a href="#"><span style="vertical-align: middle">Loading</span> <img src="pics/globeSpinner.GIF" style="height: 25px; vertical-align: middle;" /></a>
						</li>
					</ul>
				</nav>
			</div>
			<!-- Left Box(for Meta and MiniMap) -->
			<div id="leftBox" >
				<!-- Station Information -->
				<div id="leftBoxTop" class="infobox">
					<p class="boxHeader">
						Station Information
					</p>
					<table width="100%">
						<tr class="tableLabel">
							<td>ID</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationId"></td>
						</tr>
						<tr class="tableLabel">
							<td>Label</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationLabel"></td>
						</tr>
						<tr class="tableLabel">
							<td>X-Coordinate (EPSG: 900913)</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationX"></td>
						</tr>
						<tr class="tableLabel">
							<td>Y-Coordinate (EPSG: 900913)</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationY"></td>
						</tr>
					</table>
				</div>
				<!-- Mini-Map showing the Station location(not interactive) -->
				<div id="leftBoxBottom" class="infobox" style="width: 100%; height: 50%; overflow: auto;">

				</div>
			</div>

			<!-- Center Box(for Chart and Table) -->
			<div id="centerBox">
				<div id="centerBoxMain" style="width: 100%; height: 90%;">
					<div id="centerBoxMainChart">

					</div>
					<div id="centerBoxMainTable">
						<table id="dataTable" class="editablegrid" style="text-align: center;">
							<thead>
								<tr>
									<th>Date</th>
								</tr>
							</thead>
						</table>
					</div>
					<div id="centerBoxMainRaw"></div>
					<div id="centerBoxMainDatepick">
						<p class="boxHeader">
							Select a Timespan
						</p>
						<table style="margin:auto;" cellpadding="5">
							<tr style="font-size: larger;">
								<td>Start Date</td>
								<td></td>
								<td>End Date</td>
							</tr>
							<tr>
								<td><div id="datepickStart"></div></td>
								<td style="vertical-align: middle; font-size: larger;">to</td>
								<td><div id="datepickEnd"></div></td>
							</tr>
							<tr>
								<td>
								<input type="button" value="Cancel" >
								</td>
								<td></td>
								<td>
								<input type="button" value="Apply" onclick="applyTimespan()">
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>

			<!-- Right Box(for Phenomenon and Timeseries Selection) -->
			<div id="rightBox">
				<!-- List of Phenomenons available -->
				<div id="rightBoxTop" class="infobox">
					<p class="boxHeader">
						Phenomena
					</p>
					<ul id="phenomenaList">
						<form name="phenomenaRadios">

						</form>
					</ul>
				</div>
				<!-- List of available Timeseries -->
				<div id="rightBoxBottom" class="infobox">
					<p class="boxHeader">
						Timeseries
					</p>
					<ul id="timeseriesList">

					</ul>
				</div>
			</div>

		</div>
	</body>

</html>
