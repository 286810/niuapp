// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.text(" ");
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.views.transition("ios");
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.navBar.positionPrimaryButtons('left');
    $ionicConfigProvider.navBar.positionSecondaryButtons('right');
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/public/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.guider', {
    url: '/guider',
    views: {
      'tab-guider': {
        templateUrl: 'templates/guider/tab-guider.html',
        controller: 'GuiderCtrl'
      }
    }
  })

  .state('tab.destination', {
      url: '/destination',
      views: {
        'tab-destination': {
          templateUrl: 'templates/my/tab-my.html',
          controller: 'ChatsCtrl'
        }
      }
    })

  .state('tab.publish', {
    url: '/publish',
    views: {
      'tab-publish': {
        templateUrl: 'templates/my/tab-my.html',
        controller: 'AccountCtrl'
      }
    }
  })

    .state('tab.message', {
      url: '/message',
      views: {
        'tab-message': {
          templateUrl: 'templates/message/tab-chats.html',
          controller: 'MessageCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-message': {
          templateUrl: 'templates/message/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.message-journey', {
      url: '/message-journey',
      views: {
        'tab-message': {
          templateUrl: 'templates/message/message-journey.html',
          controller: 'MessageJourneyCtrl'
        }
      }
    })
      .state('tab.journey-cost-detail', {
        url: '/journey-cost-detail',
        views: {
          'tab-message': {
            templateUrl: 'templates/message/journey-cost-detail.html',
            controller: 'MessageJourneyCtrl'
          }
        }
      })
    .state('tab.journey-confirm', {
      url: '/journey-confirm',
      views: {
        'tab-message': {
          templateUrl: 'templates/message/journey-confirm.html',
          controller: 'MessageJourneyCtrl'
        }
      }
    })

    .state('tab.my', {
      url: '/my',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/tab-my.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/guider');

});
