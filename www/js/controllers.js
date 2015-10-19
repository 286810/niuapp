angular.module('starter.controllers', [])

  .controller( 'MainCtrl', ['$scope', '$location', '$ionicModal', '$ionicNavBarDelegate', '$ionicHistory', '$ionicLoading', '$ionicSideMenuDelegate',
    function ( $scope, $location, $ionicModal, $ionicNavBarDelegate, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate ) {
      //hide back-button
      //$ionicNavBarDelegate.showBackButton(false);
      //状态变量
      $scope.root = {};


      $scope.$on( '$stateChangeStart' , function ( e, toState, toParams, fromState, fromParams ) {

        if ( toState.name == 'tab.message-chat' || toState.name == 'tab.message-service' ) {
          $scope.root.hideTabs = true;
        } else {
          $scope.root.hideTabs = false;
        }
      });
      $scope.$on( '$locationChangeStart' , function ( e, prev, next ) {

        //广播选择的医院等数据
        'temp_publish_hospital' in $scope.root && $scope.$broadcast( 'publish_hospital', $scope.root.temp_publish_hospital );
        'temp_publish_department' in $scope.root && $scope.$broadcast( 'publish_department', $scope.root.temp_publish_department );
      });
      //选择医院时的 state
      $scope.$on( 'whoToHospital', function (e, params) {
        //console.log( params );
        $scope.root.temp_hospital_back_state = params.name;
      });

      //右侧栏
      $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
      };

    }])

  .controller('GuiderCtrl', ['$scope', function ($scope) {
    console.log('');
    $scope.guiderOpt = {};

  }])

  .controller('MessageCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', [ '$scope', '$ionicScrollDelegate', '$state', '$stateParams', 'Chats',
    function ( $scope, $ionicScrollDelegate, $state, $stateParams, Chats ) {
      //隐藏tabs
      $scope.$parent.root.hideTabs = true;

      //对话数据
      $scope.contacts = Chats.get($stateParams.chatId);
      $scope.chatData = [];

      $scope.sendMsg = function() {
        var chatContent = document.querySelector('#chat-div-input').innerHTML;
        console.log();
        if ( chatContent ) {
          //if ( !!$scope.chat.content ) {
            $scope.chatData.push(
              {
                'name': '小花',
                'face': './img/hotman-2.jpg',
                'pos': 'right',
                'content': chatContent
              },
              {
                'name': '小红',
                'face': './img/hotman-1.png',
                'pos': 'left',
                'content': '哎哟，我们又见面了哦！'
              }
            );

            //清空输入框
          document.querySelector('#chat-div-input').innerHTML = '';
          //}
        }

        //滚到底部
        $ionicScrollDelegate.scrollBottom(true);
      };

      var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

      $scope.inputUp = function() {
        console.log('inputUp');
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function() {
          $ionicScrollDelegate.scrollBottom(true);
        }, 300);

      };

      $scope.inputDown = function() {
        console.log('inputDown');
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
      };

      $scope.closeKeyboard = function() {
        cordova.plugins.Keyboard.close();
      };

      //查看行程
      $scope.lookJourney = function () {
        $state.go('tab.message-journey');
      }
    }])

  .controller('MessageJourneyCtrl', [ '$scope', '$ionicHistory', '$state', '$stateParams', 'Chats',
    function ( $scope, $ionicHistory, $state, $stateParams, Chats ) {
      //隐藏tabs
      $scope.$parent.root.hideTabs = true;
      $scope.$on('$stateChangeStart', function (e, fromState, fromParam, toState, toParam) {
        $scope.$parent.root.hideTabs = true;
      });

      $scope.back = function () {
        $ionicHistory.goBack();
      };

    }])

  .controller('AccountCtrl', [ '$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {
    $scope.settings = {
      enableFriends: true
    };

  }]);

//控制富文本编辑器
function inputUp () {
  console.log(  );

}
