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
    const amenities = Object.values(selectedAmenities).toString();
    $('div.amenities > h4').text(amenities);
  });
});
