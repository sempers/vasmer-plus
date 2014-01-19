angular.module('myApp', [
        'myApp.services',
        'myApp.controllers'
    ]).
    config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
    });
