angular.module('magic').directive('gameBoard', function(playerService) {
  return {
    restrict: "E",
    templateUrl: "game-board/game-board-directive-template.html",
    link: function($scope, element, attrs) {
      $scope.playerService = playerService;
    }
  }
});
