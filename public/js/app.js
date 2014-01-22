angular.module('myApp', [
        'ngRoute',
        'myApp.services',
        'myApp.controllers'
    ]).
    config(function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
    });
