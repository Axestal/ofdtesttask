ProductController.$inject = ['$scope', '$q', '$state', '$stateParams', 'productFactory', 'reviewFactory', 'authFactory'];

/**
 * Контроллер страницы товара
 * @param $scope
 * @param $q
 * @param $state
 * @param $stateParams
 * @param productFactory
 * @param reviewFactory
 * @param authFactory
 * @constructor
 */
function ProductController($scope, $q, $state, $stateParams, productFactory, reviewFactory, authFactory) {
    let vm = this;
    const DEFAULT_RATING = "5"; //значение оценки отзыва по умолчанию

    vm.view = {
        item: null,
        reviews: [],
        reviewListError: false,
        reviewSendErrors: null,
        userLogged: false
    };

    vm.model = {
        reviewRate: DEFAULT_RATING,
        reviewText: ''
    };

    vm.ctrl = {
        sendReview: sendReview,
        updateReviews: updateReviews
    };

    let productId = Number($stateParams.productId);
    //получаем информацию о товаре
    productFactory.getProductById(productId).then(function (product) {
        vm.view.item = product;
        return product.id;
    }).catch(function () { //если информация о товаре не найдена, переходим в список товаров
        $state.go('productList', {}, {location: 'replace'});
        return $q.reject();
    }).then(function (productId) { //получаем список отзывов
        return reviewFactory.getProductReviews(productId);
    }).then(function (reviews) {
        vm.view.reviews = reviews.sort(function (a, b) {
            return b.id - a.id;
        });
    }).catch(function (error) { //если не удалось получить отзывы, выводим ошибку
        if (error instanceof ReviewApiError) {
            vm.view.reviewListError = true;
        }
    });

    vm.view.userLogged = authFactory.isLogged();

    //Подписка на изменение авторизации пользователя
    $scope.$on(authFactory.AUTH_CHANGE_EVENT_NAME, function () {
        vm.view.userLogged = authFactory.isLogged();
    });

    //отправка отзыва пользователя из формы
    function sendReview() {
        let rate = vm.model.reviewRate;
        let text = vm.model.reviewText;
        vm.view.reviewSendErrors = null;
        let reviewData = reviewFactory.prepareReviewData(rate, text);
        let validation = reviewFactory.validateReviewData(reviewData);

        if(validation.valid === false) {
            vm.view.reviewSendErrors = validation.errors.join(' ');
            return false;
        }

        reviewFactory.addProductReview(productId, reviewData).then(function () {
            resetReviewForm();
            updateReviews(productId);
        }).catch(function () {
            vm.view.reviewSendErrors = 'We are really sorry! Please, try again later';
        })
    }

    //очистка формы отзыва
    function resetReviewForm() {
        vm.model.reviewRate = DEFAULT_RATING;
        vm.model.reviewText = '';
    }

    //обновление списка отзывов
    function updateReviews(productId) {
        vm.view.reviewListError = false;
        reviewFactory.getProductReviews(productId).then(function (reviews) {
            vm.view.reviews = reviews.sort(function (a, b) {
                return b.id - a.id;
            });
        }).catch(function () {
            vm.view.reviewListError = true;
        });
    }
}