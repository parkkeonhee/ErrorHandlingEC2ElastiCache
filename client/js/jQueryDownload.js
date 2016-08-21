<script type="text/javascript">
  $("#downloadID").click(function() {
  var key = $("#keyInput").val();
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
