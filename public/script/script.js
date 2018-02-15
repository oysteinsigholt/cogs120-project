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

function confirmModal(question, yesText, noText, yes, no) {
  const modal = $('<div id="confirm-modal" class="modal"></div>');
  const modalContent = $('<div class="modal-content"><p>' + question + '</p></div>');
  const modalFooter = $('<div class="modal-footer"></div>');
  const modalYesButton = $('<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">' + yesText + '</a>');
  const modalNoButton = $('<a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">'+ noText + '</a>');
  modalYesButton.click(function() {
    $('#confirm-modal').modal('close');
    $('#confirm-modal').remove();
    yes();
  });
  modalNoButton.click(function() {
    $('#confirm-modal').modal('close');
    $('#confirm-modal').remove();
    no();
  });
  modalFooter.append(modalNoButton);
  modalFooter.append(modalYesButton);
  modal.append(modalContent);
  modal.append(modalFooter);
  $('body').append(modal);
  $('.modal').modal();
  $('#confirm-modal').modal('open');
}

$(document).ready(() => {
  $('.confirm').on('click', function() {
    return confirm($(this).attr('data-confirmMessage'));
  });
  $('.back').on('click', function() {
    window.history.back();
  });
  $(".button-collapse").sideNav();
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
