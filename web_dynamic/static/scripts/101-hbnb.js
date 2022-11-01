$(document).ready(function () {
  const hostname = window.location.hostname + ':5001';
  const state = $('li.state input[type="checkbox"]');
  const city = $('li.city input[type="checkbox"]');
  const amenity = $('div.amenities input[type="checkbox"]');
  const selectedCities = {};
  const selectedStates = {};
  const selectedAmenities = {};

  const statusUrl = 'http://' + hostname + '/api/v1/status/';
  $.ajax({
    url: statusUrl,
    type: 'GET',
    dataType: 'json'
  })
    .done(function (response) {
      if (response.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    })
    .fail(function (xhr, status, error) {
      console.log('Error', error);
    });

  displayPlaces();

  city.change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      selectedCities[id] = name;
    } else {
      delete selectedCities[id];
    }
    const values = Object.values(selectedCities);
    $('div.locations > h4').text(values.join(', '));
  });

  state.change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      selectedStates[id] = name;
    } else {
      delete selectedStates[id];
    }
    const values = Object.values(selectedStates);
    $('div.locations > h4').text(values.join(', '));
  });

  amenity.change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if ($(this).is(':checked')) {
      selectedAmenities[id] = name;
    } else {
      delete selectedAmenities[id];
    }
    const values = Object.values(selectedAmenities);
    $('div.amenities > h4').text(values.join(', '));
  });

  $('button').on('click', function () {
    const req = {
      cities: Object.keys(selectedCities),
      states: Object.keys(selectedStates),
      amenities: Object.keys(selectedAmenities)
    };
    displayPlaces(req);
  });

  $(document).on('click', 'span.span', function () {
    const $input = $(this);
    if ($input.text() === 'show') {
      $input.text('hide');
      $.ajax({
        url: 'http://' + hostname + '/api/v1/places/' + $input.data('id') + '/reviews',
        type: 'GET',
        dataType: 'json',
        ContentType: 'application/json'
      })
        .done(function (reviews) {
          const ul = $('<ul></ul>');
          for (const review of reviews) {
            const li = $('<li></li>');
            const getUser = $.ajax({
              url: 'http://' + hostname + '/api/v1/users/' + review.user_id,
              type: 'GET',
              dataType: 'json',
              ContentType: 'application/json'
            });
            getUser.done(function (user) {
              li.append($('<h3></h3>').text('From ' + user.first_name + ' ' + user.last_name));
              li.append($('<p></p>').html(review.text));
              ul.append(li);
              $input.parents('div.reviews').append(ul);
            });
          }
        });
    } else {
      $input.text('show');
      $input.parents('div.reviews').children('ul').remove();
    }
  });

  function displayPlaces (req = {}) {
    const searchUrl = 'http://' + hostname + '/api/v1/places_search';
    const post = $.ajax({
      url: searchUrl,
      data: JSON.stringify(req),
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
        article.append(populateReviews(place));
        $('section.places').append(article);
      }
    });
  }

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
    const userUrl = 'http://' + hostname + '/api/v1/users/' + userId;
    const divUser = $('<div></div>').addClass('user');
    divUser.append($('<b></b>').text('Owner: '));
    const getUser = $.ajax({
      url: userUrl,
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

  function populateReviews (place) {
    const divReviews = $('<div></div>').addClass('reviews');
    const getReviews = $.ajax({
      url: 'http://' + hostname + '/api/v1/places/' + place.id + '/reviews',
      type: 'GET',
      dataType: 'json',
      ContentType: 'application/json'
    });
    getReviews.done(function (reviews) {
      const h2 = $('<h2></h2>');
      const span = $('<span></span>').addClass('span').attr('data-id', place.id).text('show');
      if (reviews.length > 1) {
        h2.text(reviews.length + ' Reviews');
        h2.append(span);
      } else {
        h2.text(reviews.length + ' Review');
        if (reviews.length > 0) {
          h2.append(span);
        }
      }
      divReviews.append(h2);
    });
    return divReviews;
  }
});
