$(document).ready(function() {
  var elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  var $spot = [];

  $('.board li').each(function(i) {
    $spot.push($(this));
  });


  var randomise = function(elements) {
    var counter = 100;
    elements.sort(function () {
      return 0.5 - Math.random();
    });
    return elements;
  };

  var fillAllBoxes = function() {
    var randomElements = randomise(elements);
    var randomEmementsPair = randomElements.concat(randomElements);

    console.log(randomEmementsPair);
    for (var i = 0; i < $spot.length; i++) {
      $spot[i].text(randomEmementsPair[i]);
    }
  };


  var addClassToLi = function() {
    for (var i = 0; i < $spot.length; i++) {
      var liClass = "slot" + i;
      $spot[i].addClass(liClass);
    }
  };

  var init = function() {
    addClassToLi();
    fillAllBoxes();

  };

  init();

});
