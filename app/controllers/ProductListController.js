ProductListController.$inject = ['productFactory', '$state', '$timeout']

/**
 * Контроллер страницы товаров
 * @param productFactory
 * @param $state
 * @param $timeout
 * @constructor
 */
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

    //показываем loader с задержкой, чтобы избежать моргания в случае быстрой загрузки страницы
    let productLoaderTimer = $timeout(function () {
        vm.view.showLoader = true;
    }, 200);

    productFactory.getProducts().then(function (products) {
        $timeout.cancel(productLoaderTimer);
        vm.view.showLoader = false;
        vm.view.items = products;
    }).catch(function () { //в случае ошибки показываем предупреждение
        $timeout.cancel(productLoaderTimer);
        vm.view.showLoader = false;
        vm.view.showWarning = true;
    });

    //переход на страницу выбранного товара
    function selectProduct(productId) {
        $state.go('product', {productId: productId});
    }

}