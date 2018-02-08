/* eslint-env browser */
/* eslint-env jquery */

$(document).ready(() => {
  $('.chips-autocomplete').material_chip({
    placeholder: 'Add a course ',
    secondaryPlaceholder: 'Add another course ',
    autocompleteOptions: {
      data: {
        'CSE 170: Interaction Design': null,
        'CSE 100: Stuff': null,
        'COGS 1: The Basic Stuff': null,
      },
      limit: 4,
      minLength: 1,
    },
  });

  $('#homepage-next').click((e) => {
    window.location.href = '/section';
    e.preventDefault();
  });

  $('#skeleton-next').click((e) => {
    window.location.href = '/skeleton/section.html';
    e.preventDefault();
  });

  $('#section-next').click((e) => {
    window.location.href = '/skeleton/calendar.html';
    e.preventDefault();
  });

  $('#section-custom').click((e) => {
    window.location.href = '/skeleton/custom.html';
    e.preventDefault();
  });

  $('#nav-back').click((e) => {
    window.history.back();
    e.preventDefault();
  });
});
