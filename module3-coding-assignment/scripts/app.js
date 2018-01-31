(function () {
  'use strict';
  angular
      .module('NarrowItDownApp', [])
      .controller('NarrowItDownController', NarrowItDownController)
      .service('MySearchService', MySearchService)
      .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ["MySearchService"];
  function NarrowItDownController (MySearchService) {
      var nidc = this;
      nidc.searchTerm = "";
      nidc.narrowItDown = function () {
          var promise = MySearchService.getMatchedMenuItems(nidc.searchTerm);
          promise.then(function (response) {
              nidc.found = response;
          }, function (response) {
              nidc.found = [];
          });
      };
      nidc.removeItem = function (index) {
          nidc.found.splice(index, 1);
      };
      nidc.showNotFound = false;
  }

  MySearchService.$inject = ["$http", "$q"];
  function MySearchService ($http, $q) {
      var mss = this;

      mss.getMatchedMenuItems = function (searchTerm) {
          var deferred = $q.defer();
          if (searchTerm) {
              $http({
                  url: "https://davids-restaurant.herokuapp.com/menu_items.json",
                  method: "GET"
              }).then(
                  function (response) {
                      var menuItems = [];
                      if (response.data.hasOwnProperty("menu_items")) {
                          menuItems = response.data.menu_items;
                          searchTerm = searchTerm.toLowerCase();
                          var filteredItems = [];
                          for (var i = 0; i < menuItems.length; i++) {
                              if (menuItems[i].hasOwnProperty("description") &&
                                  menuItems[i].description.indexOf(searchTerm) > -1) {
                                  filteredItems.push(menuItems[i]);
                              }
                          }
                          deferred.resolve(filteredItems);
                      } else {
                          deferred.resolve(menuItems);
                      }
                  },
                  function (response) {
                      deferred.reject([]);
                  }
              );
          } else {
              deferred.reject([]);
          }
          return deferred.promise;
      };
  }

  function FoundItemsDirective () {
      return {
          templateUrl: "templates/found-items.html",
          scope: {
              found: "<",
              removeItem: "&",
          },
          restrict: "E",
          link: FoundItemsLink
      }
  }

  function FoundItemsLink(scope, element, attrs, controller) {
      scope.$watch(
          function () {
              if (scope.found) {
                  return scope.found.length < 1;
              }
          },
          function (newValue, oldValue) {
              if (newValue === true) {
                  element.find("h5#error").slideDown(1000);
              } else {
                  element.find("h5#error").slideUp(50);
                  element.find(".menu-item").slideDown(1000);
              }
          }
      );
  }
})();
