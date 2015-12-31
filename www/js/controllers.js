angular.module('starter.controllers', [])

  .controller('MainCtrl', ['$scope', '$state', '$location', '$ionicModal', '$ionicNavBarDelegate', '$ionicHistory', '$ionicLoading',
    '$ionicSideMenuDelegate', '$localStorage', '$ionicPopup', '$ionicPlatform', 'RootService', '$http', 'Host', 'Headers', 'Chats',
    '$timeout',
    function ($scope, $state, $location, $ionicModal, $ionicNavBarDelegate, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate,
              $localStorage, $ionicPopup, $ionicPlatform, RootService, $http, Host, Headers, Chats, $timeout) {

      //状态变量
      $scope.root = {};
      var host = 'www.ocdday.com';
      var BOSH_SERVICE = 'http://www.ocdday.com:7070/http-bind/';
      var login = $localStorage.get('uId');//登录ID
      var password = $localStorage.get('ps');//登录密码

      $scope.messageRev = function(msg,from) {
        console.log('before push'+msg );
        var timeStamp = new Date();
        //如果在后台提示有消息
        if($state.current.name == 'tab.chat-detail') {
          $scope.root.hadNewMsg = false;
        } else {
          $scope.root.hadNewMsg = true;
        }
        //如接到消息就弹出
        var pop = $ionicPopup.alert({
          title: "chat receive:"+msg,
          scope: $scope
        });
        $timeout(function () {
          pop.close();
        }, 5000);
        if(/\[TRIP\d{16}\]/.test(msg)) {
          //是系统通知
          RootService.chatData.push({
            'tripId': msg.match(/TRIP\d{16}/)[0],
            'content_push': msg,
            'pos': 'center',
            'time': timeStamp.getTime()
          });
        } else {
          RootService.chatData.push({
            'userId': from,
            'name': from,
            'face': './img/hotman-1.png',
            'pos': 'left',
            'content': msg.replace(/\[图片/g, './img/face/').replace(/\]/g, '.gif').split(' '),
            'time': timeStamp.getTime()
          });
        }

        console.log(RootService.chatData, $scope.root);
        var lastChatData = RootService.chatData[RootService.chatData.length-1];
        if(lastChatData && timeStamp.getTime() > lastChatData.time && timeStamp.getDate() > new Date(lastChatData.time).getDate()) {
          //只保留当天的聊天数据
          $localStorage.setObject(from.split('@')[0], []);
        } else {
          $localStorage.setObject(from.split('@')[0], RootService.chatData);
        }

        //聊天页不提示
        //window.plugins.jPushPlugin.clearAllNotification();
        //$ionicScrollDelegate.resize();
        //$ionicScrollDelegate.scrollBottom(true);
      };

      function onConnect(status) {
        if (status == Strophe.Status.CONNECTING) {
          console.log('Strophe is connecting.');
        } else if (status == Strophe.Status.CONNFAIL) {
          console.log('Strophe failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING) {
          console.log('Strophe is disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED) {
          console.log('Strophe is disconnected.');
        } else if (status == Strophe.Status.CONNECTED || status === Strophe.Status.ATTACHED) {
          console.log('Strophe is connected.');
          //connection.disconnect();
          console.log('ECHOBOT: Send a message to ' + RootService.opt.connection.jid + ' to talk to me.');

          RootService.opt.connection.addHandler(onMessage, null,    'message', null, null,  null);
          console.log('onMessage.');
          RootService.opt.connection.send($pres().tree());
          console.log('send.');
        }
      }

      function onMessage(msg) {
        console.log("-----------receive  message-------------"+  msg.getElementsByTagName('body')[0].innerHTML, msg);
        var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');
        //console.log(to, from, type, Strophe.getText(elems[0]));

        if (type == "chat" && elems.length > 0) {
          var body = elems[0];

          $scope.messageRev(Strophe.getText(body),from);
          console.log('messageRev ...' + '');
        }
        return true;
      }

      //启动推送服务
      function initJpush() {
        window.plugins.jPushPlugin.init();
        window.plugins.jPushPlugin.setAlias(login);
        //window.plugins.jPushPlugin.setDebugMode(true);

        //打开推送内容
        document.addEventListener("jpush.receiveNotification", function (e) {

          var alertContent;
          if(device.platform == "Android"){
            alertContent=window.plugins.jPushPlugin.receiveNotification;
          }else{
            alertContent   = e.aps;
          }
          var popup = $ionicPopup.alert({
            template: 'receiveNotification: ' + JSON.stringify(alertContent),
            scope: $scope
          });
          $timeout(function () {
            popup.close();
          }, 50000);

           /*if($state.current.name == 'tab.chat-detail') {
            //window.plugins.jPushPlugin.clearAllNotification();
          } else {

          }
          var extraInfo = alertContent.extras['cn.jpush.android.EXTRA'];
          if(extraInfo.type == 'syschat') {
            //是系统通知
            RootService.chatData.push({
              'tripId': alertContent.alert.match(/TRIP\d{16}/)[0],
              'content_push': alertContent.alert,
              'pos': 'center',
              'time': d
            });
          } else if(extraInfo.type == 'newchat') {
            RootService.chatData.push({
              'userId': extraInfo.from,
              'name': extraInfo.from,
              'face': './img/hotman-1.png',
              'pos': 'left',
              'content': alertContent.alert.replace(/\[图片/g, './img/face/').replace(/\]/g, '.gif').split(' '),
              'time': d
            });
          }*/

        }, false);

        document.addEventListener('jpush.openNotification', function (e) {

          if(device.platform == "Android"){
            $scope.pushContent=window.plugins.jPushPlugin.openNotification;
            $scope.alertContent=window.plugins.jPushPlugin.openNotification.alert;
          }else{
            $scope.pushContent   = e.aps;
            $scope.alertContent   = e.aps.alert;
          }

          if(extraInfo.type == 'syschat') {
            //得到行程单号
            RootService.data.pushTripId = $scope.alertContent.match(/TRIP\d{16}/)[0];
            var extraInfo = $scope.pushContent.extras['cn.jpush.android.EXTRA'];
            //行程推送
            var popup = $ionicPopup.alert({
              template: 'openNotification: <br>from-' + extraInfo.from +
              '<br>trip_status:' + extraInfo.trip_status +
              '<br>type:' + extraInfo.type,
              scope: $scope
            });
            $timeout(function () {
             popup.close();
             }, 12000);
            //是系统通知
            RootService.chatData.push({
              'tripId': RootService.data.pushTripId,
              'content_push': $scope.alertContent,
              'pos': 'center',
              'time': d
            });

            $localStorage.setObject(extraInfo.from, RootService.chatData);
            $http({
              method: 'GET',
              url: Host + '/user/' + extraInfo.from,
              headers: Headers
            }).success(function (data, status) {
              //添加新的果先生
              Chats.add({
                id: extraInfo.from,
                name: data.nickname || '',
                lastText: '范冰冰叫你回家吃饭',
                face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png',
                pos: 'left',
                time: new Date().getTime()
              });
              $localStorage.setObject('niuSir_' + extraInfo.from, data);
            }).error(function (data, status) {

            });

            //跳到聊天页
            $state.go('tab.chat-detail', {chatId: extraInfo.from});
            //判断行程状态
            /*$http({
              method: 'GET',
              url: Host + '/trips/' + RootService.data.pushTripId,
              headers: Headers
            }).success(function (data, status) {
              console.log(data, status);
            }).error(function (data, status) {
              console.log(data,status);
            });*/
          } else {
            //聊天推送
            var po = $ionicPopup.alert({
              title: 'openNotification: ' + $scope.alertContent,
              scope: $scope
            });
            $timeout(function () {
              po.close();
            }, 10000);

          }

          /*if($state.current.name == 'tab.chat-detail') {
            //window.plugins.jPushPlugin.clearAllNotification();

          } else {

          $scope.$apply();
          }*/
        }, false);
      }
      //判断登录初始化
      $ionicPlatform.ready(function () {
        if( $localStorage.get('uId') ) {
          initJpush();
        }
      });
      //启动openFire
      if( $localStorage.get('uId') ) {
        RootService.opt.connection = new Strophe.Connection(BOSH_SERVICE);
        RootService.opt.connection.connect(login+'@'+host,password, onConnect);
      }

      //接收子控制器事件
      $scope.$on('initJpush', function () {
        initJpush();
      });
      $scope.$on('initOpenFire', function () {
        //启动openFire
        RootService.opt.connection = new Strophe.Connection(BOSH_SERVICE);
        RootService.opt.connection.connect(login+'@'+host,password, onConnect);
      });

      $scope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        //是否登录
        if(toState.name == 'tab.publish' || toState.name == 'tab.message') {
          !$localStorage.get('uId') && $location.path('/login');
        }
        //隐藏tabs
        if (toState.name == 'tab.message-chat' || toState.name == 'tab.chat-detail' || toState.name == 'tab.message-service' || toState.name == 'tab.trip-wait-pay' ||
            toState.name == 'tab.destination-country-detail' || toState.name == 'tab.destination-impress' || toState.name == 'tab.destination-city' ||
            toState.name == 'tab.destination-city-detail' || toState.name == 'tab.city-scenery-detail' || toState.name == 'tab.publish-country'
            || toState.name == 'tab.publish-addCity'|| toState.name == 'tab.continue-addCity' || toState.name == 'tab.plan-detail' || toState.name == 'tab.plan-other'
            || toState.name == 'tab.journey-cost-detail' || toState.name == 'tab.trip-wait-comment' || toState.name == 'tab.my-trip-detail') {
          $scope.root.hideTabs = true;
        } else {
          $scope.root.hideTabs = false;
        }
        //隐藏消息提示点
        if(toState.name == 'tab.message') {
          $scope.root.hadNewMsg = false;
        }

      });
      $scope.$on('$locationChangeStart', function (e, prev, next) {
        //是否登录
        if($location.path() == '/tab/publish' || $location.path() == '/tab/message') {
          console.log( !$localStorage.get('uId'));
          !$localStorage.get('uId') && $location.path('/login');
        }

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
        if($localStorage.get('uId')) {
          $ionicSideMenuDelegate.toggleRight();

        } else {
          $state.go('login');
        }
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

      //初始化发布页面
      $scope.initPublishView = function () {
        $state.go('tab.publish');
        $ionicHistory.goToHistoryRoot($localStorage.get('publishId'));
      };

    }])

  .controller('PublicCtrl', ['$scope', '$ionicPopup', '$state', '$http', '$timeout', '$location', '$ionicHistory', '$localStorage',
    'Headers', 'Host',
    function ($scope, $ionicPopup, $state, $http, $timeout, $location, $ionicHistory, $localStorage, Headers, Host) {
      $scope.traveler = {};
      $scope.traveler.country_code = '0086';
      $scope.traveler.role = 0;
      $scope.traveler.tags = [];
      $scope.sex = [
        { name: '男', val: 'man' },
        { name: '女', val: 'woman' }
      ];
      $scope.traveler.sex = $scope.sex[0];

      //是否已经存在
      $scope.isExit = function (loginForm) {
        if (loginForm.phone.$valid) {
          $http({
            method: 'GET',
            url: Host + '/user/' + $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0/exists',
            headers: Headers
          }).success(function (data, status) {
            console.log(data, status);
            if (!data.data) {
              var loginPopup = $ionicPopup.show({
                title: '<div class="margin20-top">无效号码</div>',
                subTitle: '<div class="padding-bottom">该手机号没有被注册</div>',
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
            }
          }).error(function (data, status) {
            console.log(data, status);
          });
        }
        /**/
      };
      //获取验证码
      $scope.getVerify = function () {
        if ($scope.traveler.phone) {
          $http({
            method: 'GET',
            url: Host + '/common/verify/' + $scope.traveler.country_code + $scope.traveler.phone,
            headers: Headers
          }).success(function (data, status) {
            status == 200 && ($scope.traveler.user_verify_code = data.user_verify_code);
            console.log(data, $scope.traveler);
          }).error(function (data, status) {
            console.log(data, status);
          })
        }
      };
      //注册
      $scope.register = function (form) {
        console.log($scope.traveler);
        if ( $scope.traveler.captcha == $scope.traveler.user_verify_code ) {
          if( form.$valid ) {
            var data = {
              user_id: $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0',
              user_country_code: $scope.traveler.country_code ,
              user_phone: $scope.traveler.phone,
              user_role: '0',
              userPassword: $scope.traveler.password
            };

            $http({
              method: 'POST',
              url: Host + '/user',
              data: data,
              headers: Headers
            }).success(function (data, status, headers, config) {
              console.log(data, status);
              if (!data.errorcode && data.data == 'ok') {
                $ionicHistory.currentView($ionicHistory.backView());
                $state.go('basicInfo', {}, {location: 'replace'});

                $scope.$parent.$parent.root.uId = $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0';
                $localStorage.set('uId', $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0');
                $localStorage.set('ps', $scope.traveler.password);//hex_md5($scope.traveler.password)

                //通知父控制器开启推送服务
                $scope.$emit('initJpush');
              } else {
                var rPopup = $ionicPopup.show({
                  title: '<div class="padding brown">号码已存在</div>',
                  scope: $scope,
                  buttons: [ ]
                });

                rPopup.then(function (res) {
                });

                $timeout(function () {
                  rPopup.close();
                }, 1500);
              }
            }).error(function (data, status, headers, config) {
              console.log(data, status, headers, config);
              //if (data.message.indexOf('exists') != -1) {
              //
              //}
            });
          }
        } else {

          var vPopup = $ionicPopup.show({
            title: '<div class="padding brown">验证码错误</div>',
            scope: $scope,
            buttons: [ ]
          });
          $timeout(function () {
            vPopup.close();
          }, 1500);
        }
      };
      //登录
      $scope.login = function (loginForm) {
        console.log();
        if (loginForm.$valid) {
          var data = {
            user_id: $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0',
            userPassword: $scope.traveler.password
          };

          $http({
            method: 'POST',
            url: Host + '/user/auth',
            data: data,
            headers: Headers
          }).success(function (data, status, headers, config) {
            console.log(data, status);
            if (!data.errorcode) {
              $ionicHistory.currentView($ionicHistory.backView());
              $state.go('tab.traveler', {}, {location: 'replace'});

              $scope.$parent.$parent.root.uId = $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0';
              $localStorage.set('ps', $scope.traveler.password);
              $localStorage.set('uId', $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0');

              //通知父控制器开启推送服务
              $scope.$emit('initJpush');
            } else {
              //登录弹出框
              var lPopup = $ionicPopup.show({
                title: '<div class="padding brown">用户名或密码错误</div>',
                scope: $scope,
                buttons: [ ]
              });
              $timeout(function () {
                lPopup.close();
              }, 1500);

              lPopup.then(function (res) {
                console.log('tapped', res);
              });
            }
          }).error(function (data, status) {
            console.log(data, status);

          });
        } else {

        }
      };
      //忘记密码
      $scope.forgetPwd = function () {
        if ( $scope.traveler.forget_captcha == $scope.traveler.user_verify_code ) {
          if( $scope.traveler.password == $scope.traveler.confirm_password ) {
            console.log($scope.traveler.password , $scope.traveler.confirm_password);
            var data = {
              user_verify_code: $scope.traveler.user_verify_code,
              user_phone: $scope.traveler.country_code + $scope.traveler.phone,
              userPassword: $scope.traveler.password
            };

            $http({
              method: 'PUT',
              url: Host + '/user/' + $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0/resetpwd',
              data: data,
              headers: Headers
            }).success(function (data, status) {
              console.log(data, status);
            }).error(function (data, status) {
              console.log(data, status);
            })
          } else {
            var vPopup = $ionicPopup.show({
              title: '<div class="padding brown">密码不一致</div>',
              scope: $scope,
              buttons: []
            });

            $timeout(function () {
              vPopup.close();
            },1500);
          }
        } else {
          var fPopup = $ionicPopup.show({
            title: '<div class="padding brown">验证码错误</div>',
            scope: $scope,
            buttons: []
          });

          $timeout(function () {
            fPopup.close();
          },1500);
        }
      };

      //个人信息
      $scope.finishBasic = function (basicForm) {
        if ( basicForm.$valid ) {
          var birth = $scope.traveler.birthday;
          console.log($scope.$parent.$parent.root.uId, $localStorage.get('uId'));
          var data = {
            user_photo: $scope.traveler.header,
            user_nickname: $scope.traveler.nickname,
            user_sex: $scope.traveler.sex.name,
            user_city: $scope.traveler.city,
            user_birthday: birth.getTime()
          };

          $http({
            method: 'PUT',
            url: Host + '/user/' + $scope.$parent.$parent.root.uId,
            data: data,
            headers: Headers
          }).success(function (data, status) {
            if(!data.errorcode) {
              $state.go('travelerTag');
            }
          }).error(function (data, status) {
            console.log(data, status);
          });

          //存储昵称
          $localStorage.set('nickname', $scope.traveler.nickname);
        }
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
      ];
      $scope.changeTag = function (item) {
        if(item.checked) {
          $scope.traveler.tags.push(item.name);
        } else {
          for(var key=0; key < $scope.traveler.tags.length; key++) {
            if ($scope.traveler.tags[key] == item.name) {
              $scope.traveler.tags.splice(key,1);//console.log(key, $scope.traveler.tags);
              break;
            }
          }
        }
      };
      $scope.finishTag = function () {

        var data = {
          user_tag: $scope.traveler.tags.join('、')
        };

        $http({
          method: 'PUT',
          url: Host + '/user/' + $localStorage.get('uId'),
          data: data,
          headers: Headers
        }).success(function (data, status) {
          if(!data.errorcode) {
            $state.go('tab.traveler');
            $localStorage.set('isReg', true);
          }
        }).error(function (data, status) {
          console.log(data, status);
        });
      };


    }])


  .controller('TravelerCtrl', ['$scope', '$localStorage', '$state', '$http', 'Host', 'Headers',
    function ($scope, $localStorage, $state, $http, Host, Headers) {
      $scope.guiderOpt = {};
      //测试推送
      $scope.testJpush = function () {
        $http({
          method: 'GET',
          url: Host + '/common/testpush',
          headers: Headers
        }).success(function (data, status) {
          console.log(data, status);
        }).error(function (data, status) {
          console.log(data, status);
        });
      };
      //和果先生对话
      $scope.chatGuider = function () {
        if($localStorage.get('uId')) {

        } else {
          $state.go('login');
        }
      };


    }])

  //目的地
  .controller('DestinationCtrl', ['$scope', '$http', 'Host', 'Headers',
    function ($scope, $http, Host, Headers) {
      //目的地数据
      $http({
        method: 'POST',
        url: Host + '/common/dic/country_world',
        headers: Headers
      }).success(function (data, status) {
        console.log(data, status);
        $scope.destinationList = data;
      }).error(function (data, status) {
        console.log(data, status);
      });

  }])
  .controller('DestinationDetailCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {
    $scope.country = '日本';
      $scope.countryId = $stateParams.countryId;
    console.log('');

  }])
  .controller('DestinationCityCtrl', ['$scope', '$stateParams', '$http', 'Host', 'Headers', '$ionicModal',
    function ($scope, $stateParams, $http, Host, Headers, $ionicModal) {
      console.log($stateParams.countryId);
      $scope.country = JSON.parse($stateParams.countryId);
      //目的地城市数据
      $http({
        method: 'POST',
        url: Host + '/common/dic/' + $scope.country.dic_key,
        headers: Headers
      }).success(function (data, status) {
        console.log(data, status);
        $scope.destinationCityList = data;
      }).error(function (data, status) {
        console.log(data, status);
      });

      //查看攻略、心得
      $ionicModal.fromTemplateUrl('tips-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.tipsModal = modal;
        $scope.t = 'content';
      });
      $scope.openTips = function (id) {
        //攻略、心得数据
        /*$http({

         }).success(function (data, status) {

         }).error(function (data, status) {

         });*/

        $scope.tipsModal.show();
      };
      $scope.closeTips = function () {
        $scope.tipsModal.hide();
      };
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
  .controller('PublishCtrl', ['$scope', '$state', '$stateParams', '$location', '$ionicSideMenuDelegate', '$timeout', '$localStorage',
    '$ionicActionSheet', '$ionicPopup', '$ionicHistory', 'Headers', '$filter', '$http', 'Host', 'AddCityService',
    function ($scope, $state, $stateParams, $location, $ionicSideMenuDelegate, $timeout, $localStorage, $ionicActionSheet, $ionicPopup,
              $ionicHistory, Headers, $filter, $http, Host, AddCityService) {
      $localStorage.set('publishId', $ionicHistory.currentHistoryId());
      $scope.planOpt = {};
      $scope.plan = {};
      $scope.countryId = $scope.plan.country = $stateParams.countryId;
      $scope.plan.title = [];
      $scope.plan.img = [];

      //国家数据
      $http({
        method: 'POST',
        url: Host + '/common/dic/country_world',
        headers: Headers
      }).success(function (data, status) {
        angular.forEach(data, function (val, key) {
          val.dic_name = val.dic_key.split('_')[1];
        });
        console.log(data, status);
        $scope.destinationList = data;
      }).error(function (data, status) {
        console.log(data, status);
      });

      //接收城市数据
      $scope.$on('cityChange', function (e, city) {
        $scope.plan.city = city.name;console.log($scope.plan);
      });
      //主题数据
      $scope.$on('topicChange', function (e, topic) {
        if(topic.checked) {
          $scope.plan.title.push(topic.name);
        } else {
          angular.forEach($scope.plan.title, function (val, key) {
            if(val == topic.name){
              $scope.plan.title.splice(key,1);
              console.log(key, $scope.plan.title);
            }
          });
        }
        $scope.plan.title_str = $scope.plan.title.join('、');
      });
      //取消主题
      $scope.$on('cancelTopic', function (e) {
        // $scope.plan.title = [];
        $scope.plan.title_str = $scope.plan.title.join('、');
      });

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
        if (!!$scope.plan.title.length && $scope.plan.city && $scope.plan.daynum ) {
          $location.path('/tab/publish/' + $scope.countryId + '/continue-addCity');
          //$scope.tempPlan.push($scope.plan);
          $localStorage.setObject('plan', $scope.plan);
        }
      };

      //出发时间
      $scope.verifyStartDate = function () {
        $scope.planOpt.start_date_invalid = new Date($scope.plan.start_date).getTime() < new Date().getTime();
      };

      //出行方式
      $scope.wayToTravel = [
        { name: '公共交通', value: 0 },
        { name: '专车出行', value: 1 }
      ];
      $scope.plan.way_to_travel = $scope.wayToTravel[0];

      $scope.wayChange = function () {
        $localStorage.setObject('way_to_travel', $scope.plan.way_to_travel);
      };


      //发布计划
      $scope.publishPlan = function () {
        var plan_detail = $localStorage.getObject('plan_detail');
        console.log(AddCityService); //alert($scope.plan.note_img[0]);
        var data = {
          trips_baby: $localStorage.get('uId'),
          trips_leavetime: $filter('date')(plan_detail.start_date, 'yyyy-MM-dd'),
          trips_leavetype: $localStorage.getObject('way_to_travel').value || 0,
          trips_boy: plan_detail.people_boy,
          trips_girl: plan_detail.people_girl,
          trips_child: plan_detail.people_children,
          trips_child_chairnum: plan_detail.people_children_seat,
          trips_talk: $scope.plan.note || '',
          trips_imgs: $scope.plan.note_img || '',
          trips_dest: AddCityService.hadAddCity,
          message: '有新的订单了，快去果吧抢吧！'
        };

        $http({
          method: 'POST',
          url: Host + '/trips',
          data: data,
          headers: Headers
        }).success(function (data, status) {
          console.log(data, status);

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
        }).error(function (data, status) {
          console.log(data, status);
        });

        //清理行程数据
        AddCityService.hadAddCity = [];
        $localStorage.remove('plan');
        $localStorage.remove('plan_detail');
        $localStorage.remove('way_to_travel');
      };

  }])
  .controller('AddCityCtrl', ['$scope',  '$stateParams', '$localStorage', 'AddCityService',
    function($scope, $stateParams, $localStorage, AddCityService) {
      $scope.countryId = $stateParams.countryId;
      //$scope.hadAddCity = [];

      //获取所有添加过的城市数据
      $scope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
        fromState.name == 'tab.publish-addCity' && AddCityService.hadAddCity.push($localStorage.getObject('plan'));
        $scope.hadAddCity = AddCityService.hadAddCity;//AddCityService.data.city =
          console.log(AddCityService.hadAddCity);
      });
  }])

  .controller('MessageCtrl', ['$scope', 'Chats', '$ionicHistory', '$localStorage',
    function ($scope, Chats, $ionicHistory, $localStorage) {

    // when view are recreated or on app start, instead of every page change. To listen for when this page is active
    // (for example, to refresh data), listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e, data) {
      console.log(e, data);
    });

    // view id
    $localStorage.set('msgId', $ionicHistory.currentHistoryId());

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  }])

  .controller('ChatDetailCtrl', ['$scope', '$ionicScrollDelegate', '$state', '$stateParams', 'Chats', '$localStorage', '$timeout',
    '$ionicPopup', 'RootService', '$ionicHistory', '$location',
    function ($scope, $ionicScrollDelegate, $state, $stateParams, Chats, $localStorage, $timeout, $ionicPopup, RootService,
              $ionicHistory, $location) {
      console.log($stateParams.chatId);
      $scope.chatOpt = {};
      var host = 'www.ocdday.com';
      var BOSH_SERVICE = 'http://www.ocdday.com:7070/http-bind/';
      var login = $localStorage.get('uId');//登录ID
      var password = $localStorage.get('ps');//登录密码
      var toUser = $stateParams.chatId; //发送给谁

      //初始化发布页面
      $scope.initMsgView = function () {
        $state.go('tab.message');
        $ionicHistory.goToHistoryRoot($localStorage.get('msgId'));
      };

      //聊天页不提示
      //window.plugins.jPushPlugin.clearAllNotification();

      //对话数据
      var oChat = document.querySelector('#chat-div-input');
      $scope.contacts = Chats.get($stateParams.chatId);
      $scope.$on('$ionicView.enter', function () {
        var localChatData = $localStorage.getObject(toUser);
        console.log(!!localChatData.length);
        //console.log(JSON.stringify(RootService.chatData));
        if(!!localChatData.length) {
          //如果有本地数据
          $scope.chatData = RootService.chatData = localChatData;
          $scope.noLocalChatData = false;
          console.log($scope.chatData);
        } else {
          $scope.chatData = RootService.chatData;
          $scope.noLocalChatData = true;
          console.log($scope.chatData);
        }

        $scope.$apply();
        /*var popup = $ionicPopup.alert({
          template: 'RootService.chatData: ' + JSON.stringify(),
          scope: $scope
        });*/
      });


      $scope.sendMsg = function (type) {
        if (oChat.innerHTML) {
          $scope.aChatContent = oChat.innerHTML.replace(/(<div>|<\/div>|<br>|<img src="|">)/g, ' ').split(' ')
            .join(' ').replace(/\.\/img\/face\//g, '[图片').replace(/\.gif/g, ']');
          //console.log(RootService.opt);
          var to = toUser+'@'+host;
          var d = new Date();

          if($scope.aChatContent && to) {
            var reply = $msg({
              to: to,
              type: type,
              date: d
            }).cnode(Strophe.xmlElement('body', $scope.aChatContent)).up();

            RootService.opt.connection.send(reply);

            console.log('I sent ' + to + ': ' + $scope.aChatContent);
            $scope.chatData.push(
              {
                'name': '小花',
                'face': './img/hotman-2.jpg',
                'pos': 'right',
                'content': $scope.aChatContent.replace(/\[图片/g, './img/face/').replace(/\]/g, '.gif').split(' '),
                'time': d.getTime()
              }
            );

            $localStorage.setObject(toUser, $scope.chatData);
          }

          //清空输入框
          oChat.innerHTML = '';
          //}
        }

        //滚到底部
        $ionicScrollDelegate.scrollBottom(true);
      };

      var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

      $scope.inputUp = function () {
        console.log('inputUp');
        //if (isIOS) $scope.data.keyboardHeight = 200;
        $timeout(function () {
          $ionicScrollDelegate.scrollBottom(true);
        }, 300);

        //隐藏表情和选项
        $scope.$parent.root.showFace = false;
        $scope.$parent.root.showOption = false;
      };

      $scope.inputDown = function () {
        console.log('inputDown');
        //if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
      };

      $scope.closeKeyboard = function () {
        cordova.plugins.Keyboard.close();
      };

      //表情
      $scope.faceList = [];
      window.addEventListener('native.keyboardshow', function (e) {
        console.log(e);
      });
      for (var i=1; i<91; i++) {
        $scope.faceList.push({ name: i, img: './img/face/'+i+'.gif'});
      }

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        console.log('Keyboard height is: ' + e.keyboardHeight);
      }

      function placeCaret(el, atStart) {

        if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(atStart);

          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      $scope.showKeyboard = function () {
        $scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        console.log(oChat.innerHTML);

        oChat.focus();
        placeCaret(oChat, false);
      };

      $scope.showOpt = function (name) {
        if( name == 'face' ) {
          $scope.$parent.root.showOption = false;
          $scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        } else {
          $scope.$parent.root.showFace = false;
          $scope.$parent.root.showOption = !$scope.$parent.root.showOption;
        }
      };
      $scope.selectFace = function (face) {
        //oChat.innerHTML = ''

        //处理输入焦点问题
        //cordova.plugins.Keyboard.open();

        oChat.innerHTML += '<img src="' + face.img + '">';
        //$scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        console.log(oChat.innerHTML);
      };

      //查看行程
      $scope.lookJourney = function (tripId) {
        $location.path('/tab/message-journey/' + tripId);
      }
    }])

  .controller('MessageJourneyCtrl', ['$scope', '$ionicHistory', '$state', '$stateParams', 'Chats', '$http', 'Host', 'Headers',
    '$localStorage',
    function ($scope, $ionicHistory, $state, $stateParams, Chats, $http, Host, Headers, $localStorage) {

      $scope.tripId = $stateParams.tripId;
      //
      $scope.back = function () {
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e, data) {
        console.log(data.stateName);
        if(data.stateName == 'tab.message-journey') {

          //行程计划数据
          $http({
            method: 'GET',
            url: Host + '/trips/' + $stateParams.tripId,
            headers: Headers
          }).success(function (data, status) {
            console.log(data,status);
            $scope.trips_plan = data[0].trips_plan.content;
          }).error(function (data, status) {
            console.log(data,status);
          });
        } else if(data.stateName == "tab.journey-cost-detail") {
          //行程费用数据
          $http({
            method: 'GET',
            url: Host + '/trips/' + $stateParams.tripId + '/bill',
            headers: Headers
          }).success(function (data, status) {
            console.log(data,status);
            $scope.trips_bill = data[0];
            $localStorage.set('bill_total_' + $scope.tripId, data[0].bill_total);
          }).error(function (data, status) {
            console.log(data,status);
          });
        } else if(data.stateName == 'tab.journey-confirm') {
          //行程确认
          $http({
            method: 'PUT',
            url: Host + '/trips/' + $stateParams.tripId + '/confirmplan',
            headers: Headers,
            data: {
              userPassword: $localStorage.get('ps'),
              message: 'hi 大叔,你的行程我灰常满意,已经确认了哦!'
            }
          }).success(function (data, status) {
            console.log(data,status);
          }).error(function (data, status) {
            console.log(data,status);
          });
        }
      });


      //拒绝行程
      $scope.refuseTrip = function (tripId) {
        console.log(tripId);
        /*$http({
          method: 'PUT',
          url: Host + '/trips/' + $stateParams.tripId + '/refuse',
          headers: Headers
        }).success(function (data, status) {
          console.log(data,status);
        }).error(function (data, status) {
          console.log(data,status);
        });*/
      }
    }])

  .controller('MyCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$localStorage', '$state', '$http', 'Headers',
    '$timeout', 'Host',
    function ($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $localStorage, $state, $http, Headers, $timeout, Host) {


      //清除缓存
      $scope.clearCache = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: '<div class="padding popup-title margin20-top">确定清除缓存的图片数据吗？</div>',
          buttons: [
            { text: '取消' },
            {
              text: '<b>确认</b>'
            }
          ]
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('sure');
          } else {
            console.log('confused')
          }
        });
      };

      //退出登录
      $scope.exit = function () {
        window.plugins.jPushPlugin.stopPush();
        window.plugins.jPushPlugin.setAlias('');
        $localStorage.remove('uId');
        $state.go('login');
      }

    }])

  /*.controller('MyTripCtrl', ['$scope', '$ionicSideMenuDelegate', '$http', 'Host', 'Headers', '$localStorage', '$stateParams',
    function ($scope, $ionicSideMenuDelegate, $http, Host, Headers, $localStorage, $stateParams) {

      //行程账单
      //$http({
      //  method: 'PUT',
      //  url: Host + '/trips/' + $stateParams.trips_orderid + '/bill',
      //  headers: Headers
      //}).success(function (data, status) {
      //  console.log(data, status);
      //
      //  //$scope.tripsData = data.data;
      //}).error(function (data, status) {
      //  console.log(data, status);
      //});

  }])*/
  .controller('MyTripCtrl', ['$scope', '$ionicSideMenuDelegate', '$http', 'Host', 'Headers', '$localStorage', '$stateParams',
    function ($scope, $ionicSideMenuDelegate, $http, Host, Headers, $localStorage, $stateParams) {
      $scope.tripOpt = {};

      $scope.$on('$ionicView.enter', function (e, data) {
        //行程数据
        $http({
          method: 'POST',
          url: Host + '/trips/' + $localStorage.get('uId') + '/query',
          headers: {
            access_token: 'test123',
            currentpage: 1,
            pagesize: 10
          }
        }).success(function (data, status) {
          console.log(data, status);
          angular.forEach(data.data, function (val, key) {
            val.trips_leave_time = new Date(val.trips_leavetime).getTime();
            val.trips_end_time = val.trips_leave_time + val.trips_daynum * 24 * 60 * 60 * 1000;
          });
          $scope.tripsData = data.data;
        }).error(function (data, status) {
          console.log(data, status);
        });
      });

    }])
  .controller('TripWaitDetailCtrl', ['$scope', '$ionicSideMenuDelegate', '$http', 'Host', 'Headers', '$localStorage', '$stateParams',
    '$ionicPopup', '$state',
    function ($scope, $ionicSideMenuDelegate, $http, Host, Headers, $localStorage, $stateParams, $ionicPopup, $state) {
      $scope.tripWaitOpt = {};
      $scope.tripId = $stateParams.trips_orderid;

      //行程详情
      $http({
        method: 'GET',
        url: Host + '/trips/' + $stateParams.trips_orderid,
        headers: Headers
      }).success(function (data, status) {
        angular.forEach(data, function (val, key) {
          val.trips_leave_time = new Date(val.trips_leavetime).getTime();
          val.trips_end_time = val.trips_leave_time + val.trips_daynum * 24 * 60 * 60 * 1000;
          angular.forEach(val.trips_dest, function (val, key) {
            val.title = val.title.join('、');
          })
        });
        console.log(data, status);
        $scope.tripData = data[0];
        $scope.tripWaitOpt.trips_sir = data[0].trips_sir;
      }).error(function (data, status) {
        console.log(data, status);
      });

      //取消行程
      $scope.cancelTrip = function () {
        var tripCancelPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="tripWaitOpt.reason" >',
          title: '<div class="padding padding20-top">请输入取消的理由</div>',
          scope: $scope,
          buttons: [
            {text: '取消'},
            {
              text: '确定',
              type: 'button-brown',
              onTap: function (e) {
                if(!$scope.tripWaitOpt.reason) {
                  e.preventDefault();
                } else {
                  return $scope.tripWaitOpt.reason;
                }
              }
            }
          ]
        });


        tripCancelPopup.then(function (res) {
          if(res) {
            var data = {
              message: res,
              userPassword: $localStorage.get('ps')
            };

            $http({
              method: 'PUT',
              url: Host + '/trips/' + $stateParams.trips_orderid + '/cancel',
              headers: Headers,
              data: data
            }).success(function (data, status) {
              console.log(data, status);
              $state.go('tab.my-trip');
            }).error(function (data, status) {
              console.log(data, status);
            });
          }
        });

      };

      $scope.$on('$ionicView.enter', function (e, data) {
        if(data.stateName == 'tab.trip-wait-pay') {
          if($localStorage.get('bill_total_' + $stateParams.trips_orderid)) {
            $scope.bill_total = $localStorage.get('bill_total_' + $stateParams.trips_orderid);
          } else {
            //行程费用数据
            $http({
              method: 'GET',
              url: Host + '/trips/' + $stateParams.trips_orderid + '/bill',
              headers: Headers
            }).success(function (data, status) {
              console.log(data,status);
              $scope.bill_total = data[0].bill_total;
              $localStorage.set('bill_total_' + $stateParams.trips_orderid, data[0].bill_total);
            }).error(function (data, status) {
              console.log(data,status);
            });
          }
        } else if(data.stateName == 'tab.my-trip-detail') {
          //行程费用数据
          $http({
            method: 'GET',
            url: Host + '/trips/' + $stateParams.trips_orderid + '/bill',
            headers: Headers
          }).success(function (data, status) {
            console.log(data,status);
            $scope.trips_bill = data[0];
            $localStorage.set('bill_total_' + $scope.tripId, data[0].bill_total);
          }).error(function (data, status) {
            console.log(data,status);
          });
        }
      });
      //去付款
      $scope.toPay = function () {
        $http({
          method: 'PUT',
          url: Host + '/trips/' + $stateParams.trips_orderid + '/pay',
          headers: Headers,
          data: {
            "userPassword":"0000",
            "message":"hi 大叔,大洋已上缴牛果果,开始我们的旅程吧!"
          }
        }).success(function (data, status) {
          console.log(data,status);
          $state.go('tab.my-trip');
        }).error(function (data, status) {
          console.log(data,status);
        });
      };
      //评价星级
      $scope.setStar = function (n) {
        for(var i = 0; i < 6; i++) {
          if( i < n ) {
            $scope.tripWaitOpt['star_' + (i + 1)] = true;
          } else {
            $scope.tripWaitOpt['star_' + (i + 1)] = false;
          }
        }
        $scope.tripWaitOpt.starLevel = n;
      };

      //评价果先生
      $scope.commentSir = function () {
        if($scope.tripWaitOpt.starLevel){
          $http({
            method: 'PUT',
            url: Host + '/trips/' + $stateParams.trips_orderid + '/review',
            headers: Headers,
            data: {
              "user_id": $scope.tripWaitOpt.trips_sir,
              "val": $scope.tripWaitOpt.starLevel
            }
          }).success(function (data, status) {
            console.log(data,status);
            $state.go('tab.my-trip');
          }).error(function (data, status) {
            console.log(data,status);
          });
        }
      };

    }]);

//控制富文本编辑器
function inputUp() {
  console.log();

}
//异步加载文件
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
  //ignore IE
  script.onload = function () {
    !!callback && callback();
  }
}



