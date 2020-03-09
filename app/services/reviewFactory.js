reviewFactory.$inject = ['API_POINT', '$http', '$httpParamSerializerJQLike', '$q', 'authFactory'];

function reviewFactory(API_POINT, $http, $httpParamSerializerJQLike, $q, authFactory) {
    return {
        getProductReviews: getProductReviews,
        addProductReview: addProductReview,
        prepareReviewData: prepareReviewData,
        validateReviewData: validateReviewData
    };

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

    function addProductReview(productId, reviewData) {
        let url = API_POINT + '/api/reviews/' + productId;
        let token = authFactory.getToken();

        if (token === null) {
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

    function prepareReviewData(rate, text) {
        return {
            rate: Number(rate),
            text: String(text).trim()
        }
    }

    function validateReviewData(reviewData) {
        let errors = [];
        if (reviewData.text.length <= 3) {
            errors.push('Please, write something so we can know your opinion.')
        }

        return {
            valid: errors.length === 0,
            errors: errors
        }
    }
}