/* eslint-env browser */
/* eslint-env jquery */

function truncate(text, n) {
  /* Based on https://stackoverflow.com/questions/1199352/smart-way-to-shorten-long-strings-with-javascript
    by https://stackoverflow.com/users/58186/kooiinc */
  return (text.length > n) ? text.substr(0, n-1) + '&hellip;' : text;
};

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
        limit: Math.floor(Math.max(0, $(document).height() - 300) / 60) + 1,
        minLength: 1,
      },
    });

    $('.chips-autocomplete').on('chip.add', function(e, chip){
      $(e.target).find('.chip:not(.shortened)').each(function() {
        const $close = $(this).find('.close');
        $(this).html(truncate($(this).text().slice(0, -5), 30));
        $(this).append($close);
        $(this).addClass('shortened');
      });
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
  $('.chips-autocomplete').on('keyup change keydown', function (e) {
    if (e.which == 13) {
      return false;
    }
  });

  $('.confirm').on('click', function() {
    return confirm($(this).attr('data-confirmMessage'));
  });

  $('.back').on('click', function() {
    window.history.back();

    setTimeout(() => {
      window.location.href = $(this).attr('href');
    }, 500);

    return false;
  });

  $('.button-collapse').sideNav();

  $('#homepage-next').click(function() {
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

  $('.submit').click(function(e) {
    $('form').submit();
    e.preventDefault();
  });
});
