AuthController.$inject = ['$state', 'authFactory'];

function AuthController($state, authFactory) {
    const AUTH_MODE = 'AUTH_MODE';
    const REG_MODE = 'REG_MODE';
    let vm = this;

    vm.view = {
        AUTH_MODE: AUTH_MODE,
        REG_MODE: REG_MODE,
        viewMode: AUTH_MODE,
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

    function toRegisterMode() {
        vm.view.viewMode = REG_MODE;
    }

    function toAuthMode() {
        vm.view.viewMode = AUTH_MODE;
    }

    function register() {
        vm.view.regErrors = [];
        let username = vm.model.regUsername;
        let password = vm.model.regPassword;
        let userData = authFactory.prepareUserData(username, password);
        let validation = authFactory.validateUserData(userData);

        if (validation.valid === true) {
            authFactory.registerUser(userData).then(function () {
                $state.go('productList');
            }).catch(function (error) {
                vm.view.regErrors = [error.message];
            });
        } else {
            vm.view.regErrors = validation.errors;
        }
    }

    function auth() {
        vm.view.authErrors = [];
        let username = vm.model.authUsername;
        let password = vm.model.authPassword;
        let userData = authFactory.prepareUserData(username, password);

        let validation = authFactory.validateUserData(userData);

        if (validation.valid === true) {
            authFactory.authUser(userData).then(function () {
                $state.go('productList');
            }).catch(function (error) {
                vm.view.authErrors = [error.message];
            });
        } else {
            vm.view.authErrors = validation.errors;
        }
    }
}