<!DOCTYPE html>
<html>
	<head>
		<title>OSM LOD INDEX</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8;" />
		<style type="text/css">
			html, body {
				width: 100%;
				margin: 0;
				z-index: 0;
			}
			#content {
				width: 99.9%;
				height: 550px;	
				border: 1px solid black;
				margin: auto;
			}
		</style>
		<link rel="stylesheet" type="text/css" href="style/dataViewer.css" />
		<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
		<script src="js/lib/jquery.js" type="text/javascript"></script>
		<script src="js/lib/highcharts.js" type="text/javascript"></script>
		<script src="js/dataViewer.js" type="text/javascript"></script>
		<script src="js/chart.js" type="text/javascript"></script>
		<script type="text/javascript">
			var popup = true;
			function initData(){
				initDvMap();	
			}
		</script>
	</head>
	<body onload="initData();">
		<div id="content">
			<!-- Top Navigation Bar -->
			<div id="topNav" >
				<button id="closeButton" title="Close" onclick="parent.hideDataViewer();">
					X
				</button>	
			</div>
			<!-- Left Box(for Meta and MiniMap) -->
			<div id="leftBox" >
				<!-- Station Information -->
				<div id="leftBoxTop" class="infobox">
					<p class="boxHeader">Station Information</p>
					<table width="100%">						
						<tr class="tableLabel">
							<td>ID</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationId">sta_aade671064600d2a8c951b5234a68924</td>
						</tr>
						<tr class="tableLabel">
							<td>Label</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationLabel">http://kli.uni-muenster.de/stations/hbs</td>
						</tr>
						<tr class="tableLabel">
							<td>X-Coordinate (EPSG: 900913)</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationX">845565.0408294755</td>
						</tr>
						<tr class="tableLabel">
							<td>Y-Coordinate (EPSG: 900913)</td>
						</tr>
						<tr>
							<td class="tableData" id="leftBoxTopStationY">6794543.5167190675</td>
						</tr>
					</table>	
				</div>
				<!-- Mini-Map showing the Station location(not interactive) -->
				<div id="leftBoxBottom" class="infobox" style="overflow: auto;">
					
				</div>
			</div>	
			
			<!-- Center Box(for Chart and Table) -->
			<div id="centerBox">
				
			</div>
			
			<script type="text/javascript">
				var chart = new LineChart();
				chart.initChart();
				chart.setTitle('Timeseries');
			</script>
			
			<!-- Right Box(for Phenomenon and Timeseries Selection) -->
			<div id="rightBox">
				<!-- List of Phenomenons available -->
				<div id="rightBoxTop" class="infobox">
					<p class="boxHeader">Phenomena</p>	
					<ul id="phenomenaList">
						<form name="phenomenaRadios">
						
						</form>
					</ul>	
				</div>
				<!-- List of available Timeseries -->
				<div id="rightBoxBottom" class="infobox">
					<p class="boxHeader">Timeseries</p>	
					<ul id="timeseriesList">
						
					</ul>
				</div>	
			</div>
			
		</div>
	</body>

</html>