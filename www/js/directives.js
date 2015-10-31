var directives = angular.module( 'directives', []);

directives.directive( 'sendMsg', [ '$ionicScrollDelegate', function ( $ionicScrollDelegate ) {

  return function (scope, elem, attr) {


  }
}]);

//计数器
directives.directive( 'counterPlus', [ '$ionicGesture', function ( $ionicGesture ) {

  return function (scope, elem, attr) {
    scope.$parent.plan[attr['model']]= 0;

    $ionicGesture.on('tap', function () {
      //console.log(scope.$parent.plan);
      scope.$parent.plan[attr['model']]++;
      scope.$apply();
    }, elem);
  }
}]);
directives.directive( 'counterMinus', [ '$ionicGesture', function ( $ionicGesture ) {

  return function (scope, elem, attr) {

    $ionicGesture.on('tap', function () {

      if (scope.$parent.plan[attr['model']] > 0) {
        --scope.$parent.plan[attr['model']] ;
      } else {
        scope.$parent.plan[attr['model']] = 0;
      }
      scope.$apply();
    }, elem);
  }
}]);
