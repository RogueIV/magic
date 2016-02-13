angular.module('magic').directive('gameBoard', function(playerService) {
  return {
    restrict: "E",
    templateUrl: "game-board/game-board-directive-template.html",
    link: function($scope, element, attrs) {
      $scope.playerService = playerService;
    }
  }
});

angular.module('magic').directive('gameMenu', function() {
  return {
    restrict: "E",
    link: function(scope, element, attrs) {},
    templateUrl: "game-menu/game-menu-directive-template.html"
  }
});

angular.module('magic').directive('gameSetup', function(playerService) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'game-setup/game-setup-directive-template.html',
    link: function($scope, element, attrs) {
      $scope.playerService = playerService;
      $scope.addPlayers = function() {
        $scope.playerService.add();
      };
      $scope.deletePlayer = function(index) {
        $scope.playerService.delete(index);
      };
      $scope.canAddPlayer = function() {
        return players.length < 8;
      };
      $scope.hasValidPlayers = function() {
        return players && players.length > 1 && players[players.length-1].name.legnth > 0;
      };
    }
  }
});

angular.module('magic').directive('player', function(playerService) {
  return {
    restrict: "E",
    scope: {
      data: '=',
      edit: '@?'
    },
    templateUrl: 'player/player-directive-template.html',
    link: function($scope, element, attrs) {
      $scope.hasColor = function(color) {
        return $scope.data.colors.indexOf(color) > -1;
      };

      $scope.toggleColor = function(color) {
        if($scope.hasColor(color)) {
          $scope.data.colors.pop(color);
        } else {
          $scope.data.colors.push(color);
        }
      };

      $scope.updateScore = function(change) {
        $scope.data.score += change;
        if($scope.data.score < 0) { $scope.data.score = 0; }
      };
    }
  }
});

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
