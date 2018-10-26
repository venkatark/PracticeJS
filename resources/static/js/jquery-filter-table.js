$(document).ready(function() {
	
	// DO GET
	$.ajax({
		type : "GET",
		url : "api/urls/all",
		success: function(result){
			$.each(result, function(i, dataObj){
				
				var customerRow = '<tr>' +
									'<td>' + dataObj.uri + '</td>' +
									'<td>' + dataObj.modjk + '</td>' +
									'<td>' + dataObj.modproxy + '</td>' +
									'<td>' + dataObj.https + '</td>' +
								  '</tr>';
				
				$('#customerTable tbody').append(customerRow);
				
	        });
			
			$( "#customerTable tbody tr:odd" ).addClass("info");
			$( "#customerTable tbody tr:even" ).addClass("success");
		},
		error : function(e) {
			alert("ERROR: ", e);
			console.log("ERROR: ", e);
		}
	});
	
	// do Filter on View
	$("#inputFilter").on("keyup", function() {
	    var inputValue = $(this).val().toLowerCase();
	    $("#customerTable tr").filter(function() {
	    	$(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
	    });
	});
})