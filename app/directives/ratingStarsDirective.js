function ratingStars() {
    return {
        restrict: 'A',
        scope: {
            rating: '='
        },
        template: '<div class="star-rating">' +
                '<span ng-repeat="rate in [1,2,3,4,5]" class="star-rating-item" ng-class="{active: rate <= rating}">&#9733;</span>'+
            '</div>'
    };
}