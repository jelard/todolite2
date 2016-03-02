/**
 * Created by jmacalino on 3/1/2016.
 */
(function (){
    'use strict';
    var app = angular.module('app', ['ngRoute']);

    app.config(function($routeProvider){
        $routeProvider.when("/", {
           templateUrl:"/todo/todoList.html",
           controller: "TodoListCtrl",
            controllerAs: "vm"
        });

        $routeProvider.otherwise({redirecTo:"/"});

    });

})();