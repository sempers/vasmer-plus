angular.module('myApp.controllers', [])
    .controller('AppCtrl', function ($scope, $http) {
    $scope.wordQuery = "";
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
