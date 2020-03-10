AuthController.$inject = ['$state', 'authFactory'];

/**
 * Контроллер страницы авторизации/регистрации
 * @param $state
 * @param authFactory
 * @constructor
 */
function AuthController($state, authFactory) {
    const AUTH_MODE = 'AUTH_MODE'; //режим представления - авторизация
    const REG_MODE = 'REG_MODE'; //режим представления - регистрация
    let vm = this;

    vm.view = {
        AUTH_MODE: AUTH_MODE,
        REG_MODE: REG_MODE,
        viewMode: AUTH_MODE, //текущий режим представления
        regErrors: [],
        authErrors: []
    };

    vm.model = {
        authUsername: '',
        authPassword: '',
        regUsername: '',
        regPassword: ''
    };

    vm.ctrl = {
        toRegisterMode: toRegisterMode,
        toAuthMode: toAuthMode,
        register: register,
        auth: auth
    };

    //Переключение представление на форму регистрации
    function toRegisterMode() {
        vm.view.viewMode = REG_MODE;
    }

    //Переключить представление на форму авторизации
    function toAuthMode() {
        vm.view.viewMode = AUTH_MODE;
    }

    //зарегистрировать пользователя по данным из формы
    function register() {
        vm.view.regErrors = [];
        let username = vm.model.regUsername;
        let password = vm.model.regPassword;
        let userData = authFactory.prepareUserData(username, password);
        let validation = authFactory.validateUserData(userData);

        if (validation.valid === true) {
            authFactory.registerUser(userData).then(function () {
                $state.go('productList'); //в случае успеха переходим к списку товаров
            }).catch(function (error) {
                vm.view.regErrors = [error.message];
            });
        } else {
            vm.view.regErrors = validation.errors;
        }
    }

    //авторизовать пользователя по данным из формы
    function auth() {
        vm.view.authErrors = [];
        let username = vm.model.authUsername;
        let password = vm.model.authPassword;
        let userData = authFactory.prepareUserData(username, password);

        let validation = authFactory.validateUserData(userData);

        if (validation.valid === true) {
            authFactory.authUser(userData).then(function () {
                $state.go('productList'); //в случае успеха переходим к списку товаров
            }).catch(function (error) {
                vm.view.authErrors = [error.message];
            });
        } else {
            vm.view.authErrors = validation.errors;
        }
    }
}