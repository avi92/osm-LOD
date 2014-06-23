/**
 * @author Axel Virnich
 */


var temp = null;

function getPhenomenaJSON(){
	$.getJSON('http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/phenomena/?station=' + temp.getId(), function(data) {
    	var phenArr = [];			
		for(var i = 0; i < data.length; i++){
			phenArr.push(new Phenomenon(data[i].id, data[i].label));
		}
		temp.setPhenomena(phenArr);
		temp.showPopup();
	});
}
