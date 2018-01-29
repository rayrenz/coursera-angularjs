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
      nidc.found = [];
      nidc.searchTerm = "";
      nidc.narrowItDown = function () {
          var promise = MySearchService.getMatchedMenuItems(nidc.searchTerm);
          promise.then(function (response) {
              nidc.found = response;
              showOrHideMessage();
          });
      };
      nidc.removeItem = function (index) {
          console.log(nidc.found.splice(index, 1));
          showOrHideMessage();
      };
      nidc.showNotFound = false;
      function showOrHideMessage () {
          nidc.showNotFound = nidc.found.length < 1;
      }
  }

  MySearchService.$inject = ["$http"];
  function MySearchService ($http) {
      var mss = this;

      mss.getMatchedMenuItems = function (searchTerm) {
          return $http({
              url: "https://davids-restaurant.herokuapp.com/menu_items.json",
              method: "GET"
          }).then(
              function (response) {
                  var menuItems = [];
                  if (response.data.hasOwnProperty("menu_items") && searchTerm) {
                      menuItems = response.data.menu_items;
                      searchTerm = searchTerm.toLowerCase();
                      var filteredItems = [];
                      for (var i = 0; i < menuItems.length; i++) {
                          if (menuItems[i].hasOwnProperty("description") &&
                              menuItems[i].description.indexOf(searchTerm) > -1) {
                              filteredItems.push(menuItems[i]);
                          }
                      }
                      return filteredItems;
                  } else {
                      return menuItems;
                  }
              }
          );
      };
  }

  function FoundItemsDirective () {
      return {
          templateUrl: "templates/found-items.html",
          scope: {
              found: "<",
              removeItem: "&"
          },
          restrict: "E"
      }
  }
})();
