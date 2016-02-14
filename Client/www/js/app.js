// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'firebase' , 'ngCordova']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    })
});

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state("login", {
            url: "/login",
            templateUrl: "view/login.html",
            controller: "loginCtrl"
        })
        .state("home", {
            url: "/home",
            templateUrl: "view/home.html",
            controller: "homeCtrl"
        })
        .state("addRetailer", {
            url: "/addRetailer",
            templateUrl: "view/addRetailer.html",
            controller: "addRetailerCtrl"
        })
        .state("newOrder", {
            url: "/newOrder",
            templateUrl: "view/newOrder.html",
            controller: "newOrderCtrl"
        })
        .state("test", {
            url: "/test",
            templateUrl: "view/test.html",
            controller: "testCtrl"
        })
        .state("allRetailer", {
            url: "/allRetailer",
            templateUrl: "view/allRetailer.html",
            controller: "allRetailerCtrl"
        });
    $urlRouterProvider.otherwise("login");
});



app.controller("loginCtrl", function ($scope, $http, $state, $ionicLoading) {
    console.log("i am in login ctrl");
    $scope.user = {};
    $scope.doLogin = function () {
        $ionicLoading.show();
        $http.post("/api/login", { data: $scope.user })
            .success(function (response) {
                $ionicLoading.hide();
                if (response) {

                    $state.go("home");

                }

            })
            .error(function (err) {
                console.log(err);
            });
    };
});

app.controller("homeCtrl", function () {
    console.log("home");
});

app.controller("addRetailerCtrl", function ($firebaseArray, $scope) {
    $scope.retailers = {};
    var ref = new Firebase("https://junaidapp.firebaseio.com/").child("/registeredRetailer");
    var syncedArr = $firebaseArray(ref);
    $scope.addRetailerFunc = function () {
        console.log('add retailer function hit');
        syncedArr.$add($scope.retailers);
    }
});

app.controller("newOrderCtrl", function ($firebaseObject, $scope, $firebaseArray , $cordovaGeolocation) {
    $scope.newOrder = {};
    $scope.retailers = {};
  var lat, long;
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
       lat  = position.coords.latitude;
       long = position.coords.longitude;
      console.log(lat , long);

    }, function(err) {
      // error
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };
  /*
   var watch = $cordovaGeolocation.watchPosition(watchOptions);
   watch.then(
   null,
   function(err) {
   // error
   },
   function(position) {
   var lat  = position.coords.latitude
   var long = position.coords.longitude
   });


   watch.clearWatch();
   // OR
   $cordovaGeolocation.clearWatch(watch)
   .then(function(result) {
   // success
   }, function (error) {
   // error
   });
   */


    var ref = new Firebase("https://junaidapp.firebaseio.com/registeredRetailer");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        $scope.retailers = snapshot.val();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
    $scope.showSelectValue = function (mySelect) {
        console.log(mySelect);
        $scope.newOrder.shopName = mySelect;
    };

    var ref = new Firebase("https://junaidapp.firebaseio.com/").child("/tasks");
    var syncedArr = $firebaseArray(ref);
    this.allTasks = syncedArr;



    $scope.saveOrder = function () {
        console.log('inside');
      $scope.newOrder.locationLat = lat;
      $scope.newOrder.locationLong = long;
        console.log($scope.newOrder);
        syncedArr.$add($scope.newOrder);
    };
    // var syncedObj = $firebaseObject(ref);
    // this.savedUser = syncedObj.Orders;
    // $scope.saveOrder = function(){
    //     console.log($scope.newOrder);
    //     syncedObj.Orders = $scope.newOrder;
    //     syncedObj.$save();

    // };

});

app.controller("testCtrl", function ($scope) {
    var ref = new Firebase("https://junaidapp.firebaseio.com/");
    $scope.test = function () {
        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", function (snapshot) {
            console.log(snapshot.val());
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
});

app.controller("allRetailerCtrl", function ($scope, $ionicLoading) {
    $scope.allRetailers = {};
    $ionicLoading.show();
    var ref = new Firebase("https://junaidapp.firebaseio.com/registeredRetailer");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function (snapshot) {
        console.log(snapshot.val());
        $scope.allRetailers = snapshot.val();
        $ionicLoading.hide();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
