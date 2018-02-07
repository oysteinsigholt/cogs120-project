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
});
