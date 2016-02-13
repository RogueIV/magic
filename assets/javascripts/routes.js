angular.module('magic').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // NOTE: make sure ALL routes end with a '/' forward slash:

    $urlRouterProvider.otherwise('/');
    $stateProvider.state('start', {
        url: '/',
        template: '<div class="header main"><img src="http://www.omggames.ca/wp-content/uploads/2015/04/Mtg-logo-700x560.png" width="100%"><h2>Game Counter</h2></div><div class="actions"><div class="btn" ui-sref="setup">Start Here!</div></div>'
      }).state('setup', {
        url: '/setup',
        template: '<game-setup></game-setup>'
      }).state('game', {
        url: '/game',
        template: '<game-board gameId="0"></game-board>'
      }).state('stats', {
        url: '/stats',
        template: '<game-stats></game-stats>'
      })
});
