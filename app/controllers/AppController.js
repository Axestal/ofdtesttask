AppController.$inject = ['$scope', 'authFactory'];

function AppController($scope, authFactory) {
    let vm = this;

    vm.view = {
        username: '',
        userLogged: false
    };

    vm.ctrl = {
        logout: logout
    };

    $scope.$on(authFactory.AUTH_CHANGE_EVENT_NAME, function () {
        vm.view.username = authFactory.getUsername();
        vm.view.userLogged = authFactory.isLogged();
    });

    function logout() {
        authFactory.logout();
    }
}