reviewFactory.$inject = ['API_POINT', '$http', '$httpParamSerializerJQLike', '$q', 'authFactory'];

/**
 * Фабрика работы с отзывами
 * @param API_POINT - хост API приложения
 * @param $http
 * @param $httpParamSerializerJQLike
 * @param $q
 * @param authFactory
 * @returns
 */
function reviewFactory(API_POINT, $http, $httpParamSerializerJQLike, $q, authFactory) {
    return {
        getProductReviews: getProductReviews,
        addProductReview: addProductReview,
        prepareReviewData: prepareReviewData,
        validateReviewData: validateReviewData
    };

    /**
     * Получить список отзывов товара
     * @param productId - id товара
     * @returns Promise
     */
    function getProductReviews(productId) {
        let url = API_POINT + '/api/reviews/' + productId;
        return $http({
            method: 'GET',
            url: url
        }).then(function (response) {
            return response.data;
        }).catch(function () {
            throw new ReviewApiError("Unable to get reviews");
        })
    }

    /**
     * Добавление отзыва пользователем
     * @param productId - id товара
     * @param reviewData - результат метода prepareReviewData
     * @returns Promise
     */
    function addProductReview(productId, reviewData) {
        let url = API_POINT + '/api/reviews/' + productId;
        let token = authFactory.getToken();

        if (token === null) { //гости не могут оставлять отзывы
            return $q.reject(new AuthApiError('User not authorized'));
        }

        return $http({
            method: 'POST',
            url: url,
            data: $httpParamSerializerJQLike(reviewData),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + token
            }
        }).then(function (response) {
            let result = response.data;
            if (result.success === true) {
                return result;
            } else {
                throw new ReviewApiError("Unable to save review");
            }
        }).catch(function () {
            throw new ReviewApiError("Unable to save review");
        });
    }

    /**
     * Форматирование данных из формы отзыва
     * @param rate
     * @param text
     * @returns {{rate: number, text: string}}
     * P.S. лучше создать класс Review и поместить форматирование в конструктор
     */
    function prepareReviewData(rate, text) {
        return {
            rate: Number(rate),
            text: String(text).trim()
        }
    }

    /**
     * Валидация данных отзыва
     * @param reviewData
     * @returns {{valid: boolean, errors: []}}
     */
    function validateReviewData(reviewData) {
        let errors = [];

        if(reviewData.rate < 1 || reviewData.rate > 5) {
            errors.push('You somehow manage to input incorrect rate value.')
        }

        if (reviewData.text.length <= 3) {
            errors.push('Please, write something so we can know your opinion.')
        }

        return {
            valid: errors.length === 0,
            errors: errors
        }
    }
}