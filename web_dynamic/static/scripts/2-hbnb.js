$(document).ready(function () {
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
  })
    .done(function (response) {
      console.log(response);
      if (response.status === "OK") {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    })
    .fail(function (xhr, status, error) {
      console.log("Error", error);
    });
});
