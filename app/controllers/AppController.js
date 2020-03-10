AppController.$inject = ['$scope', 'authFactory'];

/**
 * Контроллер приложения
 * @param $scope
 * @param authFactory
 * @constructor
 */
function AppController($scope, authFactory) {
    let vm = this;

    vm.view = {
        username: '',
        userLogged: false
    };

    vm.ctrl = {
        logout: logout
    };

    //Подписка на изменение авторизации пользователя
    $scope.$on(authFactory.AUTH_CHANGE_EVENT_NAME, function () {
        vm.view.username = authFactory.getUsername();
        vm.view.userLogged = authFactory.isLogged();
    });

    //Выполнить выход из учетной записи пользователя
    function logout() {
        authFactory.logout();
    }
}