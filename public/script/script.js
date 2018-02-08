/* eslint-env browser */
/* eslint-env jquery */

$(document).ready(() => {
  $('.chips-autocomplete').material_chip({
    placeholder: 'Add a course ',
    secondaryPlaceholder: 'Add another course ',
    autocompleteOptions: {
      data: {
        'CSE 100: Advanced Data Structures': null,
        'CSE 101: Design and Analysis of Algorithms': null,
        'CSE 103: A Practical Introduction to Probability and Statistics': null,
        'CSE 105: Theory of Computability': null,
        'CSE 107: Introduction to Modern Cryptography': null,
        'CSE 110: Software Engineering': null,
        'CSE 170: Interaction Design': null,
        'COGS 100: Cyborgs Now and in the Future': null,
        'COGS 101A: Sensation and Perception': null,
        'COGS 101B: Learning, Memory, and Attention': null,
        'COGS 101C: Language': null,
        'COGS 102A: Distributed Cognition': null,
        'COGS 102B: Cognitive Ethnography': null,
        'COGS 102C: Cognitive Design Studio': null,
        'COGS 107A: Neuroanatomy and Physiology': null,
        'COGS 107B: Systems Neuroscience': null,
        'COGS 107C: Cognitive Neuroscience': null,
        'COGS 108: Data Science in Practice': null,
        'COGS 109: Modeling and Data Analysis': null,
        'COGS 110: The Developing Mind': null,
        'COGS 115: Neurological Development and Cognitive Change': null,
        'COGS 118A: Introduction to Machine Learning I': null,
        'COGS 118B: Introduction to Machine Learning II': null,
        'COGS 118C: Neural Signal Processing': null,
        'COGS 118D: Mathematical Statistics for Behavioral Data Analysis': null,
        'COGS 119: Programming for Experimental Research': null,
        'COGS 120: Interaction Design': null,
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
