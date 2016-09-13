$("#downloadID").click(function() {
  var key = $("#userKeyInput").val();
    $.ajax({
      url: '/key/' + key,
      type: 'GET',
      success: function(data) {
        console.log("Success");

	alert(data);
	var temp = JSON.parse(data);
	alert(temp);
        $("#returnedValue").append(JSON.stringify(temp, null, 4));
      },
	error: function(request, status, error) {
	alert("error");
		$("#returnedValue").append("Error has occurred.");
	}
    });
});
