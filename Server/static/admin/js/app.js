var app = angular.module('starter', ['ionic' , 'firebase' , 'chart.js']);
  app.config(function($stateProvider, $urlRouterProvider,$httpProvider ){
    
    
    $stateProvider
      .state("login", {
        url : "/login",
        templateUrl : "/admin/templates/login.html",
        controller  : "loginCtrl" 
      })
      .state("signup", {
        url : "/signup",
        templateUrl : "/admin/templates/signup.html",
        controller  : "signupCtrl" 
      })
      .state("signupSales", {
        url : "/signupsales",
        templateUrl : "/admin/templates/signupSales.html",
        controller  : "signupSalesCtrl" 
      })
      .state("home", {
        url : "/home",
        templateUrl : "/admin/templates/home.html",
        controller  : "homeCtrl",
       
        
      })
      .state("dashboard", {
        url : "/dashboard",
        templateUrl : "/admin/templates/dashboard.html",
        controller  : "dashboardCtrl",
        cache : false
        
      })
      .state("orders", {
        url : "/orders",
        templateUrl : "/admin/templates/orders.html",
        controller  : "ordersCtrl"
        
      })
      .state("addCompany", {
        url : "/addCompany",
        templateUrl : "/admin/templates/addCompany.html",
        controller  : "addCompanyCtrl"
        
      })
        .state("map", {
          url : "/map",
          templateUrl : "/admin/templates/map.html",
          controller  : "MapCtrl"

        });
      
      
      $urlRouterProvider.otherwise("/home");
      
      
      //$httpProvider.interceptors.push('httpInterceptor');
  });
//   app.run(function($rootScope, $state){
    
//     $rootScope.$on("$stateChangeStart", function(event, toState){
//       var firebaseLocalToken = localStorage.getItem("token");
        
//       if(toState.loginCompulsory && !firebaseLocalToken){ 
//         event.preventDefault();
//         $state.go("home");
//       }
        
//     });
    
//   });