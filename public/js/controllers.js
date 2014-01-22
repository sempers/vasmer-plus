angular.module('myApp.controllers', [])
    .controller('AppCtrl', function ($scope, $http, $location) {

    if ($location.path().length > 0){
        $scope.wordQuery = $location.path().replace("/","");
        $http.get("/search/" + encodeURIComponent($scope.wordQuery)).success(function(data){
            $scope.results = data;
        });
    }


    $scope.doSearch = function(){
        $location.path("/" + $scope.wordQuery);
    }



}).controller('LoaderCtrl', function($scope, socket){
        socket.on('rec_counted', function(count){
            $scope.recCount = count;
        });

        socket.on('rec_loaded', function(rec){
            $scope.lastRecord = rec[0];
            $scope.recCount += 1;
        });

        socket.emit('rec_count');
        socket.emit('start_loading');


    });
