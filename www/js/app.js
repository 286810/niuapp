// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'directives'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

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
      // login
      .state('login', {
        url: '/login',
        templateUrl: 'templates/public/login.html',
        controller: 'PublicCtrl'
      })
      // 注册
      .state('register', {
        url: '/register',
        templateUrl: 'templates/public/register.html',
        controller: 'PublicCtrl'
      })
      // 忘记密码
      .state('forgetPwd', {
        url: '/forgetPwd',
        templateUrl: 'templates/public/forgetPwd.html',
        controller: 'PublicCtrl'
      })
      // 重置密码
      .state('resetPwd', {
        url: '/resetPwd',
        templateUrl: 'templates/public/resetPwd.html',
        controller: 'PublicCtrl'
      })
      //个人信息
      .state('basicInfo',{
        url: '/basicInfo',
        templateUrl: 'templates/public/basicInfo.html',
        controller: 'PublicCtrl'
      })
      //个人标签
      .state('travelerTag',{
        url: '/travelerTag',
        templateUrl: 'templates/public/travelerTag.html',
        controller: 'PublicCtrl'
      })

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

      //目的地 destination-impress
      .state('tab.destination-country', {
        url: '/destination',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/tab-country.html',
            controller: 'DestinationCtrl'
          }
        }
      })
      .state('tab.destination-country-detail', {
        url: '/destination/:countryId',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/tab-country-detail.html',
            controller: 'DestinationDetailCtrl'
          }
        }
      })
      //印象
      .state('tab.destination-impress', {
        url: '/destination/:countryId/impress',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/destination-impress.html',
            controller: 'DestinationDetailCtrl'
          }
        }
      })
      .state('tab.destination-city', {
        url: '/destination/:countryId/city',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/destination-city.html',
            controller: 'DestinationCityCtrl'
          }
        }
      })
      .state('tab.destination-city-detail', {
        url: '/destination/:countryId/:cityId',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/destination-city-detail.html',
            controller: 'DestinationCityDetailCtrl'
          }
        }
      })
      .state('tab.city-scenery-detail', {
        url: '/destination/:countryId/:cityId/:sceneryId',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/city-scenery-detail.html',
            controller: 'DestinationCityDetailCtrl'
          }
        }
      })

      //发布
      .state('tab.publish', {
        url: '/publish',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/tab-publish.html',
            controller: 'PublishCtrl'
          }
        }
      })
      .state('tab.publish-country', {
        url: '/publish/:countryId',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/publish-country.html',
            controller: 'PublishCtrl'
          }
        }
      })
      .state('tab.publish-addCity', {
        url: '/publish/:countryId/addCity',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/publish-addCity.html',
            controller: 'PublishCtrl'
          }
        }
      })
      .state('tab.continue-addCity', {
        url: '/publish/:countryId/continue-addCity',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/continue-addCity.html',
            controller: 'AddCityCtrl'
          }
        }
      })
      .state('tab.plan-detail', {
        url: '/publish/:countryId/plan-detail',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/plan-detail.html',
            controller: 'PublishCtrl'
          }
        }
      })
      .state('tab.plan-other', {
        url: '/publish/:countryId/plan-other',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/plan-other.html',
            controller: 'PublishCtrl'
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

      //我的
      .state('tab.my-info', {
        url: '/my-info',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-info.html',
            controller: 'MyCtrl'
          }
        }
      })
      .state('tab.my-footprint', {
        url: '/my-footprint',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-trip.html',
            controller: 'MyCtrl'
          }
        }
      })
      .state('tab.my-trip', {
        url: '/my-trip',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-trip.html',
            controller: 'MyCtrl'
          }
        }
      })
      .state('tab.my-trip-wait', {
        url: '/my-trip-wait',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-trip-wait.html',
            controller: 'MyTripCtrl'
          }
        }
      })
      .state('tab.trip-wait-pay', {
        url: '/trip-wait-pay',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/trip-wait-pay.html',
            controller: 'MyTripCtrl'
          }
        }
      })
      .state('tab.trip-wait-comment', {
        url: '/trip-wait-comment',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/trip-wait-comment.html',
            controller: 'MyTripCtrl'
          }
        }
      })
      .state('tab.my-trip-detail', {
        url: '/my-trip-detail',
        views: {
          'tab-my': {
            templateUrl: 'templates/message/message-journey.html',
            controller: 'MyTripCtrl'
          }
        }
      })
      .state('tab.my-bill', {
        url: '/my-bill',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-bill.html',
            controller: 'MyCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/guider');

  });
