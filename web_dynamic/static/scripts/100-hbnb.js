$(document).ready(function () {
  const listOfIds = {
    amenities: [],
    cities: [],
    states: [],
  }
  const listOfNames = {
    amenities: [],
    cities: [],
    states: [],
  }
  const amenitiesText = $('.amenities h4')
  const stateCityText = $('.locations h4')

  $('.amenities input').change(function () {
    const that = this
    listenerOnInput(listOfIds.amenities, listOfNames.amenities, that)
    amenitiesText.text(listOfNames.amenities.join(', '))
  })
  $('input.state').change(function () {
    if ($(this).is(':checked')) {
      listOfIds.states.push($(this).parent().parent().data('id'))
      listOfNames.states.push($(this).parent().parent().data('name'))
      stateCityText.text(listOfNames.states.join(', '))
    } else {
      const indexId = listOfIds.states.indexOf(
        $(this).parent().parent().data('id')
      )
      listOfIds.states.splice(indexId, 1)
      const indexName = listOfNames.states.indexOf(
        $(this).parent().data('name')
      )
      listOfNames.states.splice(indexName, 1)
      stateCityText.text(listOfNames.states.join(', '))
    }
  })

  $('input.city').change(function () {
    const that = this
    listenerOnInput(listOfIds.cities, listOfNames.cities, that)
    stateCityText.text(listOfNames.cities.join(', '))
  })

  $.get('http://127.0.0.1:5001/api/v1/status/', function (data) {
    if (data.status) {
      $('#api_status').addClass('available')
    } else {
      $('#api_status').removeClass('available')
    }
  })

  fetchPlaces()

  $('button').click(function () {
    fetchPlaces(listOfIds)
  })

  function listenerOnInput(ids, names, nameThis) {
    if ($(nameThis).is(':checked')) {
      ids.push($(nameThis).parent().data('id'))
      names.push($(nameThis).parent().data('name'))
    } else {
      const indexId = ids.indexOf($(nameThis).parent().data('id'))
      ids.splice(indexId, 1)
      const indexName = names.indexOf($(nameThis).parent().data('name'))
      names.splice(indexName, 1)
    }
  }
  function fetchPlaces(listOfIds = {}) {
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search/',
      data: JSON.stringify(listOfIds),
      contentType: 'application/json',
      success: function (data) {
        $('section.places').empty()
        data.sort((a, b) => a.name.localeCompare(b.name))
        for (const place of data) {
          const article = `
										<article>
											<div class="title_box">
													<h2>${place.name}</h2>
												<div class="price_by_night">${place.price_by_night} $</div>
											</div>
											<div class="information">
												<div class="max_guest">
													${place.max_guest} Guest
												</div>
												<div class="number_rooms">
													${place.number_rooms} Bedroom
												</div>
												<div class="number_bathrooms">
													${place.number_bathrooms} Bathroom
												</div>
											</div>
											<div class="description">${place.description}</div>
										</article>`
          $('section.places').append(article)
        }
      },
    })
  }
})
