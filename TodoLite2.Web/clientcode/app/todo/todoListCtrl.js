/**
 * Created by jmacalino on 3/1/2016.
 */

(function (){
    'use strict';
    angular.module('app')
        .controller("TodoListCtrl", TodoListCtrl);

    TodoListCtrl.$inject = [];

    function TodoListCtrl(){
        var vm  = this;
        vm.title = 'Hi There';
    };

})();
