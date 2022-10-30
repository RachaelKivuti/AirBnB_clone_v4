$(document).ready(function () {
  const url = 'http://0.0.0.0:5001/api/v1/places_search';
  const post = $.ajax({
    url: url,
    data: JSON.stringify({}),
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    processData: false
  });
  post.done(function (data) {
    $('section.places').empty();
    for (const place of data) {
      const article = $('<article></article>');
      article.append(populateTitle(place));
      article.append(populateInfomation(place));
      article.append(populateUser(place));
      article.append(populateDescription(place));
      $('section.places').append(article);
    }
  });
});

function populateTitle (place) {
  const divTitle = $('<div></div>').addClass('title_box');
  const h2 = $('<h2></h2>').text(place.name);
  const divPriceByNight = $('<div></div>').addClass('price_by_night').text('$' + place.price_by_night);
  divTitle.append(h2, divPriceByNight);
  return divTitle;
}

function populateInfomation (place) {
  const divInfo = $('<div></div>').addClass('information');
  const divMaxGuest = $('<div></div>').addClass('max_guest');
  const divRooms = $('<div></div>').addClass('number_rooms');
  const divBathrooms = $('<div></div>').addClass('number_bathrooms');
  if (place.max_guest > 1) {
    divMaxGuest.text(place.max_guest + ' Guests');
  } else {
    divMaxGuest.text(place.max_guest + ' Guest');
  }
  if (place.number_rooms > 1) {
    divRooms.text(place.number_rooms + ' Bedrooms');
  } else {
    divRooms.text(place.number_rooms + ' Bedroom');
  }
  if (place.number_bathrooms > 1) {
    divBathrooms.text(place.number_bathrooms + ' Bathrooms');
  } else {
    divBathrooms.text(place.number_bathrooms + ' Bathroom');
  }
  divInfo.append(divMaxGuest, divRooms, divBathrooms);
  return divInfo;
}

function populateUser (place) {
  const userId = place.user_id;
  const url = 'http://0.0.0.0:5001/api/v1/users/' + userId;
  const divUser = $('<div></div>').addClass('user');
  divUser.append($('<b></b>').text('Owner: '));
  const getUser = $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    ContentType: 'application/json'
  });
  getUser.done(function (user) {
    divUser.append(user.first_name + ' ' + user.last_name);
  });
  return divUser;
}

function populateDescription (place) {
  const divDescription = $('<div></div>').addClass('description').html(place.description);
  return divDescription;
}
