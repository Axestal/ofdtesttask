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

        //Список товаров
        let productListState = {
            name: 'productList',
            url: '/',
            templateUrl: '/app/views/productList.html',
            controller: ProductListController,
            controllerAs: 'products'
        };

        //страница товара
        let productState = {
            name: 'product',
            url: '/product/:productId',
            templateUrl: '/app/views/product.html',
            controller: ProductController,
            controllerAs: 'product'
        };

        //страница авторизации/регистрации
        let authState = {
            name: 'auth',
            url: '/auth',
            templateUrl: '/app/views/auth.html',
            controller: AuthController,
            controllerAs: 'auth'
        };

        //убираем символ ! из адреса роутига (для эстетики)
        $locationProvider.hashPrefix('');

        $stateProvider.state(productListState);
        $stateProvider.state(productState);
        $stateProvider.state(authState);
        //в случае неизвестного роутинга, возвращаемся на страницу товаров
        $urlRouterProvider.otherwise('/');

    }

    AppRun.$inject = ['$rootScope', '$state'];
    function AppRun($rootScope, $state) {

    }
})();