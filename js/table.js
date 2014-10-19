/**
 * @author Axel
 */



// constructor
// represents the table in the Data Frame
// the table values are stored in an d-dimensional matrix before the table is created
function Table() {
	this.id = 'dataTable';
	// id of the table
	this.titleArray = [];
	// array containing the colums titles
	this.dataArray = [];
	// n-dimensional array containing the data(n = number of active timeseries)
	this.sorter = 0;
	
	this.initTable = function() {
		this.resetTable();
		this.prepareData();
	};

	this.buildTable = function() {
		var table = document.createElement("table");
		var tHead = document.createElement("thead");
		var tBody = document.createElement("tbody");

		table.setAttribute("id", this.id);
		table.setAttribute("class", "editablegrid");

		var headrow = document.createElement("tr");

		for (var i = 0; i < this.titleArray.length; i++) {
			var tablehead = document.createElement("th");
			tablehead.setAttribute("id", this.titleArray[i]);		
			var tableheadTitle = document.createTextNode(this.titleArray[i]);
			tablehead.appendChild(tableheadTitle);
			headrow.appendChild(tablehead);
		}
		tHead.appendChild(headrow);

		for (var i = 0; i < this.dataArray.length; i++) {
			var tablerow = document.createElement("tr");
			if(i % 2 == 0)	tablerow.setAttribute("class", "dataTableEven");
			else 			tablerow.setAttribute("class", "dateTableOdd");
			for (var x = 0; x < this.titleArray.length; x++) {
				var rowElement = document.createElement("td");				
				if(x == 0)	var rowElementContent = document.createTextNode($.datepicker.formatDate('dd/mm/yy', new Date(this.dataArray[i][x])) + '');
				else{
							var rowElementContent = document.createTextNode(this.dataArray[i][x]);	
							rowElement.setAttribute("style", "color: " + chart.chart.get(this.titleArray[x]).color);	// gives the table values the same color value like the chart series
				} 		
				rowElement.appendChild(rowElementContent);
				tablerow.appendChild(rowElement);
			}
			tBody.appendChild(tablerow);
		}

		document.getElementById(this.id).appendChild(tHead);
		document.getElementById(this.id).appendChild(tBody);
		
		
		// editable grid functions
		editableGrid = new EditableGrid("Data Table"); 
		
		// add timeseries to editableGrid
		var metadata = [{ name: "date", datatype: "date", editable: false }];
		for(var i = 1; i < this.titleArray.length; i++){
			metadata.push({name: this.titleArray[i], datatype: "double(2)", editable: false});
		}
		
		// build and load the metadata in Javascript
		editableGrid.load({ metadata: metadata});

		// attach to the HTML table and render it
		editableGrid.attachToHTMLTable(this.id);
		editableGrid.renderGrid();		
	};

	// puts the data that has already been requested into an n-dimensional array
	// n = number of loaded data sets
	// which is later used to create the table
	this.prepareData = function() {
		this.titleArray = [];
		this.dataArray = [];
		this.titleArray.push("Date");

		if (seriesHandler.length == 0)
			return;

		// get timeseries that are active(= data is loaded already)
		var activeHandler = [];
		for (var x = 0; x < seriesHandler.length; x++) {
			if (seriesHandler[x].loaded && seriesHandler[x].timeseries.data.length > 0) {
				activeHandler.push(seriesHandler[x]);
			}
		}

		if (activeHandler.length > 0) {
			this.titleArray.push(activeHandler[0].id);
			this.dataArray = activeHandler[0].timeseries.data.slice();
		}

		if (activeHandler.length > 1) {
			for (var x = 1; x < activeHandler.length; x++) {
				this.titleArray.push(activeHandler[x].id);
				for (var i = 0; i < activeHandler[0].timeseries.data.length; i++) {
					this.dataArray[i][x+1] = activeHandler[x].timeseries.data[i][1];
				}
			}
		}
		this.resetTable();
		this.buildTable();
		//this.sortTable(this.sorter);
	};
	
	// sorts the table by one of the table header attributes
	this.sortTable = function(sorter){
		this.sorter = sorter;
		var i, j, temp1, temp2;
		
		// selection sort algorithm
		for(i = 0; i < this.dataArray.length - 1; i++){
			temp1 = i;
			for(j = i + 1; j < this.dataArray.length; j++){
				console.log(j);
				if(this.dataArray[j][this.sorter] < this.dataArray[temp1][this.sorter])
					temp1 = j;
			}
			this.switchRows(temp1, i);
		}
		// apply sort result to table
		this.resetTable();
		this.buildTable();
	};
	
	// switch rows (utility function to sortTable)
	this.switchRows = function(row1, row2){
		var temp;
		for(var i = 0; i < this.dataArray[0].length; i++){
			temp = this.dataArray[row1][i];
			this.dataArray[row1][i] = this.dataArray[row2][i];
			this.dataArray[row2][i] = temp;
		}
	};
	 // removes the table content
	this.resetTable = function() {
		if (document.getElementById(this.id) != null) {
			var tableD = document.getElementById(this.id);
			tableD.innerHTML = '';
		}
	};
}

