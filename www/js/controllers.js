angular.module('starter.controllers', [])

  .controller('MainCtrl', ['$scope', '$state', '$location', '$ionicModal', '$ionicNavBarDelegate', '$ionicHistory', '$ionicLoading', '$ionicSideMenuDelegate',
    function ($scope, $state, $location, $ionicModal, $ionicNavBarDelegate, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate) {
      //hide back-button
      //$ionicNavBarDelegate.showBackButton(false);
      //状态变量
      $scope.root = {};


      $scope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        //隐藏tabs
        if (toState.name == 'tab.message-chat' || toState.name == 'tab.message-service' || toState.name == 'tab.trip-wait-pay' ||
            toState.name == 'tab.destination-country-detail' || toState.name == 'tab.destination-impress' || toState.name == 'tab.destination-city' ||
            toState.name == 'tab.destination-city-detail' || toState.name == 'tab.city-scenery-detail' || toState.name == 'tab.publish-country'
            || toState.name == 'tab.publish-addCity'|| toState.name == 'tab.continue-addCity' || toState.name == 'tab.plan-detail' || toState.name == 'tab.plan-other'
            ) {
          $scope.root.hideTabs = true;
        } else {
          $scope.root.hideTabs = false;
        }
      });
      $scope.$on('$locationChangeStart', function (e, prev, next) {

        //广播选择的医院等数据
        'temp_publish_hospital' in $scope.root && $scope.$broadcast('publish_hospital', $scope.root.temp_publish_hospital);
        'temp_publish_department' in $scope.root && $scope.$broadcast('publish_department', $scope.root.temp_publish_department);
      });
      //选择医院时的 state
      $scope.$on('whoToHospital', function (e, params) {
        //console.log( params );
        $scope.root.temp_hospital_back_state = params.name;
      });

      //右侧栏
      $scope.toggleRight = function () {
        $ionicSideMenuDelegate.toggleRight();
      };

      $scope.goto = function (state) {
        $state.go(state);
        $ionicSideMenuDelegate.toggleRight();
      };


      //城市数据
      $scope.cityList = [
        {name:'北海道'},
        {name:'大阪'},
        {name:'东京'}
        /*{
          anchor:'D',
          data:[
            {name:'大阪'},
            {name:'东京'}
          ]
        }*/
      ];
      //主题数据
      $scope.topicList = [
        {
          name: '购物',
          img: './img/japan.jpg',
          checked: false
        },
        {
          name: '拍照',
          img: './img/beihaidao.jpg',
          checked: false
        },
        {
          name: '参观',
          img: './img/mingguwu.jpg',
          checked: false
        },
        {
          name: '体验',
          img: './img/mingguwu.jpg',
          checked: false
        },
        {
          name: '随处走走',
          img: './img/mingguwu.jpg',
          checked: false
        }
      ];
      //打开左侧列表
      $scope.$on('toggleSide', function (e,name) {
        if (name == 'city') {
          $scope.root.side_city = true;
          $scope.root.side_topic = false;
        } else {
          $scope.root.side_topic = true;
          $scope.root.side_city = false;
        }
      });

      //选择城市
      $scope.cityChange = function (item) {
        $scope.$broadcast('cityChange', item);
        $ionicSideMenuDelegate.toggleLeft();
      };
      //选择主题
      $scope.topicChange = function (topic) {
        $scope.$broadcast('topicChange', topic);
      };
      $scope.closeTopic = function () {
        $ionicSideMenuDelegate.toggleLeft();
      };
      $scope.cancelTopic = function () {
        $scope.$broadcast('cancelTopic');
        $ionicSideMenuDelegate.toggleLeft();
      };

    }])

  .controller('PublicCtrl', ['$scope', '$ionicPopup', '$state',
    function ($scope, $ionicPopup, $state) {
      $scope.traveler = {};

      //登录
      $scope.login = function (loginForm) {
        console.log($scope);
        if (loginForm.$valid && $scope.traveler.phone == 18899990000) {
          $state.go('basicInfo');
        } else {

          //登录弹出框
          var loginPopup = $ionicPopup.show({
            title: '无效号码',
            subTitle: '该手机号没有被注册',
            scope: $scope,
            buttons: [
              {
                text: '取消',
                type: 'button-clear button-green'
              },
              {
                text: '注册',
                type: 'button-clear button-green',
                onTap: function (e) {
                  //可以返回数据
                  $state.go("register");
                }
              }
            ]
          });

          loginPopup.then(function (res) {
            console.log('tapped', res);
          })
        }
      };
      //注册
      $scope.register = function (form) {
        if ( form.$valid ) {
          $state.go('basicInfo');
        }
      };

      //个人信息
      $scope.finishBasic = function (basicForm) {
        //if ( basicForm.$valid ) {
          $state.go('travelerTag');
        //}
      };
      //标签
      $scope.tagList = [
        {
          name: '学生', checked: false
        },
        {
          name: '吃货', checked: false
        },
        {
          name: '旅游', checked: false
        },
        {
          name: '游泳', checked: false
        },
        {
          name: '爬山', checked: false
        }
      ]
    }])


  .controller('GuiderCtrl', ['$scope', function ($scope) {
    console.log('');
    $scope.guiderOpt = {};

  }])

  //目的地
  .controller('DestinationCtrl', ['$scope', function ($scope) {
    console.log('');
    $scope.destinationList = [
      {
        id: 'japan', name: '日本', text: '春观夜樱、夏看碧海、秋见红叶、冬踏落雪', img: './img/japan.jpg'
      },
      {
        id: 'france', name: '法国', text: '在花都巴黎感受万种风情', img: './img/france.jpg'
      },
      {
        id: 'spain', name: '西班牙', text: '气候温和，山青水秀，阳光明媚，风景绮丽', img: './img/spain.jpg'
      }
    ];

  }])
  .controller('DestinationDetailCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
    $scope.country = '日本';
      $scope.countryId = $stateParams.countryId;
    console.log('');

  }])
  .controller('DestinationCityCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.country = '日本';
      $scope.countryId = $stateParams.countryId;
    console.log($stateParams);
    $scope.destinationCityList = [
      {
        id: 'dongjing', name: '东京', vistedNum: '9', img: './img/dongjing.jpg'
      },
      {
        id: 'daban', name: '大阪', vistedNum: '22', img: './img/daban.jpg'
      },
      {
        id: 'beihaidao', name: '北海道', vistedNum: '5', img: './img/beihaidao.jpg'
      }
    ];

  }])
  .controller('DestinationCityDetailCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
      $scope.city = '东京';
      $scope.countryId = $stateParams.countryId;
      $scope.countryId = $stateParams.cityId;
      console.log($stateParams);
      /*$scope.destinationCityList = [
        {
          id: 'dongjing', name: '东京', vistedNum: '9', img: './img/dongjing.jpg'
        },
        {
          id: 'daban', name: '大阪', vistedNum: '22', img: './img/daban.jpg'
        },
        {
          id: 'beihaidao', name: '北海道', vistedNum: '5', img: './img/beihaidao.jpg'
        }
      ];*/

    }])

  // publish
  .controller('PublishCtrl', ['$scope', '$state', '$stateParams', '$location', '$ionicSideMenuDelegate', '$timeout', 'PlanService',
    '$ionicActionSheet', '$ionicPopup', '$ionicHistory',
    function ($scope, $state, $stateParams, $location, $ionicSideMenuDelegate, $timeout, PlanService, $ionicActionSheet, $ionicPopup,
              $ionicHistory) {
      //var oldPlan, newPlan;

      $scope.countryId = $stateParams.countryId;
      $scope.plan = {};
      $scope.plan.topic = [];
      $scope.plan.img = [];

      //接收城市数据
      $scope.$on('cityChange', function (e, city) {
        $scope.plan.city = city.name;console.log($scope.plan);
      });
      //主题数据
      $scope.$on('topicChange', function (e, topic) {
        topic.checked && $scope.plan.topic.push(topic.name);
        $scope.plan.topic_str = $scope.plan.topic.join('、');
      });
      //取消主题
      $scope.$on('cancelTopic', function (e) {
        $scope.plan.topic.pop();
        $scope.plan.topic_str = $scope.plan.topic.join('、');
      });


      $scope.destinationList = [
        {
          id: 'japan', name: '日本', text: '春观夜樱、夏看碧海、秋见红叶、冬踏落雪', img: './img/japan.jpg'
        },
        {
          id: 'france', name: '法国', text: '在花都巴黎感受万种风情', img: './img/france.jpg'
        },
        {
          id: 'spain', name: '西班牙', text: '气候温和，山青水秀，阳光明媚，风景绮丽', img: './img/spain.jpg'
        }
      ];

      //跳到添加城市页
      $scope.addCity = function () {
        $location.path('/tab/publish/' + $stateParams.countryId + '/addCity');
      };
      //跳到城市列表页
      $scope.toCityList = function () {
        $scope.$emit('toggleSide', 'city');
        $timeout(function () {
          $ionicSideMenuDelegate.toggleLeft();
        }, 30);
      };

      //到主题列表
      $scope.toTopicList = function () {
        $scope.$emit('toggleSide', 'topic');
        $timeout(function () {
          $ionicSideMenuDelegate.toggleLeft();
        }, 30);
      };

      //取消
      $scope.back = function () {
        $ionicHistory.goBack();
      };

      //继续添加城市
      $scope.continueAddCity = function () {
        if (!!$scope.plan.topic.length && $scope.plan.city && $scope.plan.day_num ) {
          $location.path('/tab/publish/' + $scope.countryId + '/continue-addCity');

          PlanService.data().push($scope.plan);
           /*if(!oldPlan.length) {
          } else {
            //PlanService.dataCache(newPlan);
          }
          console.log(oldPlan, newPlan);*/
        }
      };

      //出行方式
      $scope.wayToTravel = [
        { name: '专车出行', value: '专车出行' },
        { name: '公共交通', value: '公共交通' }
      ];
      $scope.plan.way_to_travel = $scope.wayToTravel[0];

      //上传图片
      $scope.addPlanImg = function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '直接拍照'},
            {text: '从相册中选'}
          ],
          buttonClicked: function (index) {
            function onSuccess(imageData) {
              //var image = document.querySelector('#myImg');
              //image.src = "data:image/jpeg;base64," + imageData;
              $scope.plan.img.push(imageData);
            }

            function onFail(message) {
              alert('Failed because: ' + message);
            }

            if (index == 0) {
              console.log('camera');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 400,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            } else if (index == 1) {
              console.log('photo');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 400,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            }
            return true;
          }
        });
      };

      //发布计划
      $scope.publishPlan = function () {
        var alertPopup = $ionicPopup.alert({
          title: '<div class="list">' +
          ' <div class="item item-avatar popup-item">' +
          '   <img src="./img/pig-header.png">' +
          '   <div class="green text-left">探险计划发布成功</div>' +
          '   <div class="ft-12 text-left gray">等待游侠为您制定行程</div>' +
          ' </div>' +/*
          ' <div class="item">' +
          '   <button class="button  button-clear button-brown">OK</button>' +
          ' </div>' +*/
          '</div>'
        });
        alertPopup.then(function (res) {
          if(res) {
            $state.go('tab.my-trip');
          }
        });
      }

  }])
  .controller('AddCityCtrl', ['$scope', 'PlanService', '$stateParams',
    function($scope, PlanService, $stateParams) {
      $scope.countryId = $stateParams.countryId;
      console.log(PlanService.data());
      $scope.hadAddCity = PlanService.data();
      //获取所有添加过的城市数据
      /*$scope.$on('$locationChangeStart', function (e, toState, toParams, fromState, fromParams) {console.log(PlanService.data);
        !!PlanService.data && ($scope.hadAddCity = PlanService.data);
        //$scope.$apply();
      });*/

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

  .controller('ChatDetailCtrl', ['$scope', '$ionicScrollDelegate', '$state', '$stateParams', 'Chats',
    function ($scope, $ionicScrollDelegate, $state, $stateParams, Chats) {
      //隐藏tabs
      $scope.$parent.root.hideTabs = true;

      //对话数据
      $scope.contacts = Chats.get($stateParams.chatId);
      $scope.chatData = [];

      $scope.sendMsg = function () {
        var chatContent = document.querySelector('#chat-div-input').innerHTML;
        console.log();
        if (chatContent) {
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

      $scope.inputUp = function () {
        console.log('inputUp');
        if (isIOS) $scope.data.keyboardHeight = 216;
        $timeout(function () {
          $ionicScrollDelegate.scrollBottom(true);
        }, 300);

      };

      $scope.inputDown = function () {
        console.log('inputDown');
        if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
      };

      $scope.closeKeyboard = function () {
        cordova.plugins.Keyboard.close();
      };

      //查看行程
      $scope.lookJourney = function () {
        $state.go('tab.message-journey');
      }
    }])

  .controller('MessageJourneyCtrl', ['$scope', '$ionicHistory', '$state', '$stateParams', 'Chats',
    function ($scope, $ionicHistory, $state, $stateParams, Chats) {
      //隐藏tabs
      $scope.$parent.root.hideTabs = true;
      $scope.$on('$stateChangeStart', function (e, fromState, fromParam, toState, toParam) {
        $scope.$parent.root.hideTabs = true;
      });

      $scope.back = function () {
        $ionicHistory.goBack();
      };

    }])

  .controller('MyCtrl', ['$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {

    $scope.settings = {
      enableFriends: true
    };

  }])
  .controller('MyTripCtrl', ['$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {
    //隐藏tabs
    $scope.$parent.root.hideTabs = true;

  }]);

//控制富文本编辑器
function inputUp() {
  console.log();

}
