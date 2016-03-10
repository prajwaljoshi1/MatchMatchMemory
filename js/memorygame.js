//for  page transition later move to css
$("body").css("display", "none");
$("body").fadeIn(500);

$(document).ready(function() {
  // for firebase
  var myFirebaseRef = new Firebase("https://ultimatememorygame.firebaseio.com/");

  var getSetTopPlayers = function() {
    playersObjArr = [];
    myFirebaseRef.orderByValue().on("value", function(snapshot) {
      snapshot.forEach(function(data) {
        var attempt = data.val().attempts;
        var name = data.val().name;
        //playersObjArr.push (data.val());
        setAllPlayers(name, attempt);

      });
    });
    //setTopPlayers(playersObjArr);
  };

 var setTopPlayers = function (playersObjArr){
   console.log(playersObjArr.length);
    for (var i = 0; i < playersObjArr.length; i++) {
       var attempt = playersObjArr[i].attempts;
       var name = playersObjArr[i].name;
         $(".sidebar ol").append("<li>" + name + ": ( " + attempt + " ) </li>");
    }
 }
  var setAllPlayers = function(name, attempt) {
    $(".sidebar ol").append("<li>" + name + ": ( " + attempt + " ) </li>");
  };

  var elements = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
  var $spot = [];
  var tries = 0;
  var matches = 0;
  var previousClick = {};
  var playerName = "";


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
    getSetTopPlayers();



  };

  init();

  var savePlayerToFirebase = function(playerName) {
    myFirebaseRef.push({
      'name': playerName,
      'attempts': tries
    });
  };

  var win = function() {
    var winMessage = " You won in " + tries + " attempts."
    $('h2').text(winMessage);
    //sweet alert
    swal({
      title: "You Won!",
      text: "Enter Your Name:",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "your name"
    }, function(inputValue) {
      if (inputValue === false) return false;
      if (inputValue === "") {
        swal.showInputError("You need to write something!");
        return false
      }
      swal("Congratulations!", "Well Played", "success");
      savePlayerToFirebase(inputValue);
    });

  };



  $('.board li').on('click', function(event) {
    if ($(this).attr('class') === $(previousClick).attr('class')) {
    swal("Already Selected!");
    } else {
      tries++;
      if ($(previousClick).text() === $(this).text()) {
        $(this).addClass('matched');
        $(previousClick).addClass('matched');
        matches++;
      }
      previousClick = this;

      if (matches === elements.length) {
        win();
      }

      $("span.attempts").text(tries);
      $("span.matches").text(matches);
    }
  });

  $('#reset').on('click', function(event) {
    reset();
  });

  var reset = function() {
    fillAllBoxes();
    tries = 0;
    matches = 0;
    previousClick = {};
    $("span.matches").text(matches);
    $("span.attempts").text(tries);

    for (var i = 0; i < $spot.length; i++) {
      $spot[i].removeClass('matched');
    }
    $('h2').html('Attempts: <span class="attempts">0</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Matches: <span class="matches">0</span>');
  }
});
