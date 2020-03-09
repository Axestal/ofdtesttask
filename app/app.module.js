(function () {
    angular.
        module('TestApp', ['ui.router']).
        constant('API_POINT', 'https://smktesting.herokuapp.com').
        factory('productFactory', productFactory).
        factory('authFactory', authFactory).
        factory('reviewFactory', reviewFactory).
        directive('ratingStars', ratingStars).
        controller('AppController', AppController).
        config(AppConfig).
        run(AppRun);

    AppConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function AppConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        let productListState = {
            name: 'productList',
            url: '/',
            templateUrl: '/app/views/productList.html',
            controller: ProductListController,
            controllerAs: 'products'
        };

        let productState = {
            name: 'product',
            url: '/product/:productId',
            templateUrl: '/app/views/product.html',
            controller: ProductController,
            controllerAs: 'product'
        };

        let authState = {
            name: 'auth',
            url: '/auth',
            templateUrl: '/app/views/auth.html',
            controller: AuthController,
            controllerAs: 'auth'
        };

        $locationProvider.hashPrefix('');

        $stateProvider.state(productListState);
        $stateProvider.state(productState);
        $stateProvider.state(authState);
        $urlRouterProvider.otherwise('/');

    }

    AppRun.$inject = ['$rootScope', '$state'];
    function AppRun($rootScope, $state) {

    }
})();