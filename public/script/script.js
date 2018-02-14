/* eslint-env browser */
/* eslint-env jquery */

function loadCourses() {
  $.getJSON('/data/courses/W18.json', (data) => {
    $('.chips-autocomplete').material_chip({
      data: {},
      placeholder: 'Add a course ',
      secondaryPlaceholder: 'Add another course ',
      autocompleteOptions: {
        data: data.courses.reduce((map, obj) => {
          map[obj] = null;
          return map;
        }, {}),
        limit: 4,
        minLength: 1,
      },
    });
  });
}

$(document).ready(() => {
  $('#homepage-next').click(() => {
    $('.chips-autocomplete').material_chip('data').forEach((chip) => {
      $('<input />').attr('type', 'hidden')
        .attr('name', 'chip')
        .attr('value', chip.tag)
        .appendTo('form');
      return true;
    });
  });

  $('#skeleton-next').click((e) => {
    window.location.href = '/skeleton/section.html';
    e.preventDefault();
  });

  $('#nav-back').click((e) => {
    window.history.back();
    e.preventDefault();
  });
});
