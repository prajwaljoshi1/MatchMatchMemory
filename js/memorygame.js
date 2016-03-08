$(document).ready(function() {
  var elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  var $spot = [];
  var tries = 0;
  var matches = 0;
  var previousClick = {};


  $('.board li').each(function(i) {
    $spot.push($(this));
  });


  var randomise = function(elements) {
    var counter = 100;
    elements.sort(function() {
      return 0.5 - Math.random();
    });
    return elements;
  };

  var fillAllBoxes = function() {
    var elementsPair = elements.concat(elements);
    var randomEmementsPair = randomise(elementsPair);

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



  $('.board li').on('click', function(event) {
    console.log($(this).attr('class'));
    console.log($(previousClick).attr('class'));
    if ($(this).attr('class') === $(previousClick).attr('class')) {
      alert("Already Clicked");
    } else {
      tries++;
      //console.log($(this).text());
      if ($(previousClick).text() === $(this).text()) {
        //console.log("MATCHED");
        console.log($(this));
        $(this).addClass('matched');
        $(previousClick).addClass('matched');
        matches++;
        //console.log($(this));
      }
      previousClick = this;

      if (matches === elements.length) {
        var winMessage = " You won in " + tries + " attempts."
        $('h2').text(winMessage);
      }

      $("span.attempts").text(tries);
      $("span.matches").text(matches);
    }

  });

  $('#reset').on('click', function(event) {
        reset();
  });

  var reset = function (){
    tries = 0;
    matches = 0;
    previousClick = {};
    $("span.matches").text(matches);
    $("span.attempts").text(tries);

    for (var i = 0; i < $spot.length; i++) {
      $spot[i].removeClass('matched');
     }

  }
});
