var MemoryGame = {
  $spot: [],
  elements: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
  tries: 0,
  matches: 0,
  previousClick: {},
  playerName: '',

  // reset click method below

  reset: function() {
    this.fillAllBoxes();
    tries = 0;
    matches = 0;
    this.previousClick = {};
    $("span.matches").text(matches);
    $("span.attempts").text(tries);
    for (var i = 0; i < $spot.length; i++) {
      $spot[i].removeClass('matched');
    }
    $('h2').html('Attempts: <span class="attempts">0</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Matches: <span class="matches">0</span>');
  },

  // click spot event menthods below

  savePlayerToFirebase: function(playerName) {
    myFirebaseRef.push({
      'name': playerName,
      'attempts': tries
    });
  },


  win: function() {
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
      this.savePlayerToFirebase(inputValue);
    })
  },

  clickSpot: function(currentSpot) {
    var self = this;
    if ($(currentSpot).attr('class') === $(self.previousClick).attr('class')) {
      swal("Already Selected!");
    } else {
      self.tries++;
      //console.log($(self.previousClick).text());
      //console.log($(currentSpot).text());
      if ($(self.previousClick).text() === $(currentSpot).text()) {
        $(currentSpot).addClass('matched');
        $(self.previousClick).addClass('matched');
        self.matches++;
      }
      self.previousClick = currentSpot;

      if (self.matches === self.elements.length) {
        self.win();
      }
      $("span.attempts").text(self.tries);
      $("span.matches").text(self.matches);
    }
  },

  //on page ready methods below

  loadClickEvents: function() {
    self = this;
    $('.board li').on('click', function(event) {
      var currentSpot = this;
      self.clickSpot(currentSpot);
    });

    $('#reset').on('click', function(event) {
      self.reset();
    });
  },

  sortPlayersObjArr: function(arr) {
    arr.sort(function(a, b) {
      return parseInt(a.attempts) - parseInt(b.attempts);
    });
    return arr;
  },

  setTopPlayers: function(playersObjArr) {
    var sortedPlayersObjArr = this.sortPlayersObjArr(playersObjArr);
    for (var i = 0; i < sortedPlayersObjArr.length; i++) {
      var attempt = sortedPlayersObjArr[i].attempts;
      var name = sortedPlayersObjArr[i].name;
      name = name.slice(0,17);
      $(".sidebar ol").append("<li>" + name + ": ("+ attempt+")</li>");
    }
  },

  getPlayerScore: function(myFirebaseRef) {
    var self = this;
    playersObjArr = [];
    myFirebaseRef.orderByValue().on("value", function(snapshot) {
      snapshot.forEach(function(data) {
        playersObjArr.push(data.val());
      });
      self.setTopPlayers(playersObjArr);
    });
  },

  randomise: function(elements) {
    var counter = 100;
    elements.sort(function() {
      return 0.5 - Math.random();
    });
    return elements;
  },

  fillAllSpots: function() {
    var elementsPair = this.elements.concat(this.elements);
    var randomEmementsPair = this.randomise(elementsPair);

    for (var i = 0; i < this.$spot.length; i++) {
      this.$spot[i].text(randomEmementsPair[i]);
    }
  },

  getAllSpots: function() {
    self = this;
    $('.board li').each(function(i) {
      self.$spot.push($(this));
    });

    for (var i = 0; i < this.$spot.length; i++) {
      var liClass = "slot" + i;
      this.$spot[i].addClass(liClass);
    }
  },

  init: function() {
    var myFirebaseRef = new Firebase("https://ultimatememorygame.firebaseio.com/");
    this.getAllSpots();
    this.fillAllSpots();
    this.getPlayerScore(myFirebaseRef);
    this.loadClickEvents();
  }
};

$(document).ready(function() {
  MemoryGame.init();
});
