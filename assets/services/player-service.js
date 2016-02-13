angular.module('magic').factory('playerService', function() {
  var players = [];

  return {
    players: players,

    add: function() {
      players.push({
        name: '',
        colors: [],
        score: 20
      })
    },

    delete: function(index) {
      if(players && index > -1) {
        players.splice(index, 1);
      }
    }
  }
});
