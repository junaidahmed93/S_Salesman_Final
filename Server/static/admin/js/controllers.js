var companyName;
angular.module('starter')

    .factory("myfactory", function ($http, $q) {
        return {
            salesusers: function () {
                var q = $q.defer();
                $http.get('/api/salesman')
                    .success(function (response) {
                        console.log(response.userAll);
                        Allusers = response.userAll;
                        q.resolve(response);
                    })

                    .error(function (err) {
                        q.reject(err);
                    })
                return q.promise;
            }
        }
    })

    .controller("dashboardCtrl", function ($scope, myfactory) {
        console.log("dashboard");

        $scope.Alluser = [];
        $scope.displayCompanyName = companyName;


        myfactory.salesusers()
            .then(function (res) {
                $scope.Alluser = res.userAll;
            })

        console.log("hello yes");
        console.log($scope.Alluser);

    })
    .controller("DoughnutCtrl", function ($scope) {
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [30, 500, 100];
        //$scope.colours = ["Red" , "Yellow" , "Green"];
        Chart.defaults.global.colours = ["Yellow", "Red", "Green"];
    })

    .controller("loginCtrl", function ($scope, $state, $http, myfactory) {
        $scope.user = {};
        $scope.doLogin = function () {
            //$ionicLoading.show();
            $http.post("/api/login", { data: $scope.user })
                .success(function (response) {
                    if (response.token) {
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('company', response.company);
                        // console.log(response);
                        companyName = response.company;
                        console.log(companyName);
                        //  $ionicLoading.hide();
                        $state.go("dashboard");

                    }

                })
                .error(function (err) {
                    console.log(err);
                });
        };

    })

    .controller("signupCtrl", function ($scope, $state, $http) {
        $scope.user = {};
        $scope.signupUser = function () {
            $http.post('/api/signup', { data: $scope.user })
                .success(function (response) {
                    console.log(response);
                })

                .error(function (err) {
                    console.log(err);
                });
        };
    })





    .controller('signupSalesCtrl', function ($scope, $state, $http) {
        $scope.sales = {};
        console.log("I am sales Signup");
        // console.log(companyName);
        $scope.sales.Admin = localStorage.getItem("company");

        var ref = new Firebase("https://junaidapp.firebaseio.com/company");
    
        // Attach an asynchronous callback to read the data at our posts reference
        ref.on("value", function (snapshot) {
            console.log(snapshot.val());
            $scope.companies = snapshot.val();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

        $scope.showSelectValue = function (selectedCompany) {
            $scope.sales.company = selectedCompany;
        }

        $scope.signupSales = function () {
            // $scope.sales.Admin = companyName;
            $http.post('/api/signupsales', { data: $scope.sales })
                .success(function (response) {
                    console.log(response);

                    $state.go("dashboard");
                })

                .error(function (err) {
                    console.log(err);
                });
        };
    })
    .controller('homeCtrl', function ($scope) {
        console.log("run");
    })
    .controller("ordersCtrl", function ($http, $scope, $ionicLoading , $firebaseArray) {
        $ionicLoading.show();
        $scope.orders = [];
        var ref = new Firebase("https://junaidapp.firebaseio.com/tasks");
        ref.on('child_added', function(childSnapshot, prevChildKey) {
            alert("New order Added");
        });
        // Attach an asynchronous callback to read the data at our posts reference

        /*ref.on("value", function (snapshot) {
            console.log(snapshot.val());
            $scope.orders = snapshot.val();
            $ionicLoading.hide();
            console.log(Object.keys($scope.orders).length);

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });*/

        $scope.orders = $firebaseArray(ref);
        $ionicLoading.hide();
        $scope.completed = function (data) {
            $scope.orders.$remove(data);

        };

        // $http.get('/api/orders')
        //     .success(function (response) {
        //         console.log(response);
        //         $scope.orders = response;
        //         console.log("in get client");
        //     })

        //     .error(function (err) {
        //         console.log(err);
        //     });

    })
    .controller("addCompanyCtrl", function ($scope, $firebaseArray) {
        $scope.company = {};
        var ref = new Firebase("https://junaidapp.firebaseio.com/").child("/company");
        var syncedArr = $firebaseArray(ref);
        $scope.addCompany = function () {
            syncedArr.$add($scope.company);
            console.log("Company Added Successfully");
            $scope.company.name = "";
            $scope.company.type = "";
            $scope.company.address = "";

        }
    })

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
    function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

        $scope.map = map;
    }
    google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $scope.loading.hide();
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };

});
    