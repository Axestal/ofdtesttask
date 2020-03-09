ProductListController.$inject = ['productFactory', '$state', '$timeout']

function ProductListController(productFactory, $state, $timeout) {
    let vm = this;

    vm.view = {
        items: [],
        showLoader: false,
        showWarning: false
    };

    vm.ctrl = {
        selectProduct: selectProduct
    };

    let productLoaderTimer = $timeout(function () {
        vm.view.showLoader = true;
    }, 200);

    productFactory.getProducts().then(function (products) {
        $timeout.cancel(productLoaderTimer);
        vm.view.showLoader = false;
        vm.view.items = products;
    }).catch(function () {
        $timeout.cancel(productLoaderTimer);
        vm.view.showLoader = false;
        vm.view.showWarning = true;
    });

    function selectProduct(productId) {
        $state.go('product', {productId: productId});
    }

}