(function () {
  'use strict';
  angular.module('ShoppingListCheckOff', [])
      .controller('ToBuyController', ToBuyController)
      .controller('AlreadyBoughtController', AlreadyBoughtController)
      .service('ShoppingListCheckOffService', ShoppingListCheckOffService);

  function ShoppingListCheckOffService () {
      var service = this;
      var toBuylist = [
          {
              name: "bread",
              quantity: "5 loaves"
          },
          {
              name: "banana",
              quantity: "12 pieces"
          },
          {
              name: "apples",
              quantity: "8 pieces"
          },
          {
              name: "beef",
              quantity: "5 kilos"
          },
          {
              name: "eggs",
              quantity: "2 dozen"
          }
      ];
      var boughtList = [];
      service.getToBuyList = function () {
          return toBuylist;
      };
      service.getBoughtList = function () {
          return boughtList;
      };
      service.buyItem = function (index) {
          boughtList.push(toBuylist.splice(index, 1)[0]);
      }
  }


  ToBuyController.$inject = ['ShoppingListCheckOffService'];

  function ToBuyController (ShoppingListCheckOffService) {
    var buy = this;
    buy.list = ShoppingListCheckOffService.getToBuyList();
    buy.buyItem = function (index) {
      ShoppingListCheckOffService.buyItem(index);
    }
  }

  AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];

  function AlreadyBoughtController (ShoppingListCheckOffService) {
      var bought = this;
      bought.list = ShoppingListCheckOffService.getBoughtList();
  }
})();
