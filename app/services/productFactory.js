productFactory.$inject = ['API_POINT', '$http'];

/**
 * Фабрика получения данных товаров
 * @param API_POINT - хост API приложения
 * @param $http
 * @returns
 */
function productFactory(API_POINT, $http) {

    return {
        getProducts: getProducts,
        getProductById: getProductById
    };

    /**
     * Получение списка товаров
     * @returns Promise
     * P.S. От себя: решил закешировать этот запрос для быстродействия
     */
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

    /**
     * Получение товара по id
     * @param productId
     * @returns Promise
     */
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