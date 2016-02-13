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
