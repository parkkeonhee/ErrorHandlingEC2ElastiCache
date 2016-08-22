console.log("About to do jQuery download click function");
  $("#downloadID").click(function() {
  console.log("Inside jQuery download click function");
  var key = $("#userKeyInput").val();
    $.ajax({
      url: '/key/' + key,
      type: 'GET',
      success: function(data) {
        console.log("Success");
        $("#returnedValue").append(data);
      }
    });
  });
