productFactory.$inject = ['API_POINT', '$http'];

function productFactory(API_POINT, $http) {

    return {
        getProducts: getProducts,
        getProductById: getProductById
    };

    function getProducts() {
        let url = API_POINT + '/api/products';
        return $http({
            method: 'GET',
            url: url,
            cache: true
        }).then(function (response) {
            return response.data;
        }).catch(function () {
            throw new ProductApiError("Unable to get products");
        });
    }

    function getProductById(productId) {
        return getProducts().then(function (products) {
            for (let i = 0, productsLength = products.length; i < productsLength; i++) {
                if (products[i].id === productId) {
                    return products[i];
                }
            }

            throw new ProductApiError('Product not found');
        });
    }
}