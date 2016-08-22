<script type="text/javascript">
  $("#downloadID").click(function() {
  var key = $("#userKeyInput").val();
    $.ajax({
      url: '/key/' + key,
      type: 'GET',
      success: function(data) {
        console.log("Success");
        $("#theValue").append(data);
      }
    });
  });
</script>
