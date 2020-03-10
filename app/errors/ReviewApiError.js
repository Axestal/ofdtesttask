/**
 * Ошибка фабрики отзывов
 * @param message
 * @constructor
 */
function ReviewApiError(message) {
    this.name = "ReviewApiError";
    this.message = (message || "");
    this.stack = (new Error()).stack;
}

ReviewApiError.prototype = Object.create(Error.prototype);