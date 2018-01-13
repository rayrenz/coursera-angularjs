(function () {
  'use strict';
  angular.module('LunchCheck', [])
      .controller('LunchCheckController', LunchCheckController);

  LunchCheckController.$inject = ['$scope'];

  function LunchCheckController($scope) {
    $scope.lunch = "";
    $scope.message = "";
    $scope.check = function () {
      var items = $scope.lunch.split(",");
      $scope.count = 0;
      for (var i=0; i < items.length; i++) {
        if (items[i].trim() !== "") {
          $scope.count += 1;
        }
      }
      if ($scope.count > 3) {
        $scope.message = "Too much!";
      } else if ($scope.count > 0) {
        $scope.message = "Enjoy!";
      } else {
        $scope.message = "Please enter data first";
      }
    };
  }
})();
