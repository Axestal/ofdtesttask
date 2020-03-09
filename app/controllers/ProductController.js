ProductController.$inject = ['$scope', '$q', '$state', '$stateParams', 'productFactory', 'reviewFactory', 'authFactory'];

function ProductController($scope, $q, $state, $stateParams, productFactory, reviewFactory, authFactory) {
    let vm = this;
    const DEFAULT_RATING = "5";

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
    productFactory.getProductById(productId).then(function (product) {
        vm.view.item = product;
        return product.id;
    }).catch(function () {
        $state.go('productList', {}, {location: 'replace'});
        return $q.reject();
    }).then(function (productId) {
        return reviewFactory.getProductReviews(productId);
    }).then(function (reviews) {
        vm.view.reviews = reviews.sort(function (a, b) {
            return b.id - a.id;
        });
    }).catch(function (error) {
        if (error instanceof ReviewApiError) {
            vm.view.reviewListError = true;
        }
    });

    vm.view.userLogged = authFactory.isLogged();

    $scope.$on(authFactory.AUTH_CHANGE_EVENT_NAME, function () {
        vm.view.userLogged = authFactory.isLogged();
    });

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

    function resetReviewForm() {
        vm.model.reviewRate = DEFAULT_RATING;
        vm.model.reviewText = '';
    }

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