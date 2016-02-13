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
