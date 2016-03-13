var MemoryGame = {
  $spot: [],
  elements: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
  tries: 0,
  matches: 0,
  previousClick: {},
  playerName: '',

  // reset click method below

  reset: function() {
    this.fillAllSpots();
    this.tries = 0;
    this.matches = 0;
    this.previousClick = {};
    $("span.matches").text(this.matches);
    $("span.attempts").text(this.tries);
    for (var i = 0; i < this.$spot.length; i++) {
      this.$spot[i].removeClass('matched');
    }
    $('h2').html('Attempts: <span class="attempts">0</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Matches: <span class="matches">0</span>');
  },

  // click spot event menthods below

  savePlayerToFirebase: function(playerName, firebase) {
    firebase.push({
      'name': playerName,
      'attempts': this.tries
    });
  },


  win: function(firebase) {
    var winMessage = " You won in " + this.tries + " attempts."
    $('h2').text(winMessage);
    var player = document.getElementById('user').innerHTML;
    console.log(player);
    if (player === 'Guest') {
      swal("You Won, Guest!")
    } else {
      swal({
        title: "You won " + player,
        text: "saving to leaderboard...",
        timer: 2000,
        showConfirmButton: false
      });
      this.savePlayerToFirebase(player, firebase);
    }
  },

  clickSpot: function(currentSpot, firebase) {
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
        this.cheeringSound();
      }
      self.previousClick = currentSpot;

      if (self.matches === self.elements.length) {
        self.win(firebase);
      }
      $("span.attempts").text(self.tries);
      $("span.matches").text(self.matches);
    }
  },

  //on page ready methods below

  loadClickEvents: function(firebase) {
    self = this;
    $('.board li').on('click', function(event) {
      var currentSpot = this;
      self.clickSpot(currentSpot, firebase);
      self.clickSound();
    });

    $('#reset').on('click', function(event) {
      self.reset();
    });

    $('#play').on('click', function(event) {
      startsound = $("audio")[4];
      startsound.play();
    });
  },

  sortPlayersObjArr: function(arr) {
      var arrSorted = arr.sort(function(a, b) {
      return parseInt(a.attempts) - parseInt(b.attempts);
      });
      //var arrAlphabetical =arrSorted.sort(function(a, b) {
      //if (a.name < b.name) return -1;
      //else if (a.name > b.name)return 1;
      //else return 0;
    //});
    //var arrUnique = [];
    //for (var i = 1; i < arrAlphabetical.length; i++) {
      //console.log(arrAlphabetical[i].name);
      //if(arrAlphabetical[i].name  !== arrAlphabetical[i-1].name ){
        //  arrUnique.push(arrAlphabetical[i]);
      //}
    //};
    //var arrUniqueSorted = arrUnique.sort(function(a, b) {
      //return parseInt(a.attempts) - parseInt(b.attempts);
    //});
    return arrSorted;
  },

  setTopPlayers: function(playersObjArr) {
    var sortedPlayersObjArr = this.sortPlayersObjArr(playersObjArr);
    for (var i = 0; i < sortedPlayersObjArr.length; i++) {
      var attempt = sortedPlayersObjArr[i].attempts;
      var name = sortedPlayersObjArr[i].name;
      name = name.slice(0, 17);
      $(".sidebar ol").append("<li>" + name + ": (" + attempt + ")</li>");
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

  clickSound:function(){
    var click = $("audio")[2];
    click.play();
  },

  cheeringSound: function(){

    if(this.matches === this.elements.length){
       var cheer = $("audio")[1];
    }else{
       var cheer = $("audio")[0];
    }
     cheer.play();
},

gameSound:function(){

   console.log("here");
    var gamesound = $("audio")[3];
    gamesound.play();

    $('#music').on('click', function(event) {
      if($.trim($(this).text()) === 'Pause Music'){
         console.log("pause");
        gamesound.pause();
        $(this).text('Play Music');
      }else{
        gamesound.play();
        console.log("play");
        $(this).text('Pause Music');
      }

    });
},

  init: function() {
    var myFirebaseRef = new Firebase("https://ultimatememorygame.firebaseio.com/");
    this.gameSound();
    this.getAllSpots();
    this.fillAllSpots();
    this.getPlayerScore(myFirebaseRef);
    this.loadClickEvents(myFirebaseRef);
  }
};

$(document).ready(function() {
  $("#play").animatedModal({
    color: '#E7EBF2',
    animatedIn: 'bounceIn',
    animatedOut: 'bounceOutDown'
  });
  MemoryGame.init();
});
