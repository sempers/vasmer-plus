angular.module('myApp', [ ]).config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
    });

function AppCtrl($scope, $http, $location) {

    if ($location.path().length > 1){
        $scope.wordQuery = $location.path().replace("/","");
        $http.get("/search/" + encodeURIComponent($scope.wordQuery)).success(function(data){
            $scope.words = data;
        });
    }


    $scope.doSearch = function(){
        $http.get("/search/" + encodeURIComponent($scope.wordQuery)).success(function(data){
            $scope.words = data;
        });
        $location.path($scope.wordQuery);
    };
}