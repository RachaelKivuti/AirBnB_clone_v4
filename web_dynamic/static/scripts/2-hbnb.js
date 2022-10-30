$(document).ready(function () {
  const selectedAmenities = {};
  const amenity = $('div.amenities input[type="checkbox"]');
  amenity.change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      selectedAmenities[id] = name;
    } else {
      delete selectedAmenities[id];
    }
    const amenities = Object.values(selectedAmenities);
    $('div.amenities > h4').text(amenities.join(', '));
  });
  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json'
  })
    .done(function (response) {
      console.log(response);
      if (response.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    })
    .fail(function (xhr, status, error) {
      console.log('Error', error);
    });
});
