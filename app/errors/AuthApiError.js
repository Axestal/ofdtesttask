/**
 * Ошибка фабрики авторизации
 * @param message
 * @constructor
 */
function AuthApiError(message) {
    this.name = "AuthApiError";
    this.message = (message || "");
    this.stack = (new Error()).stack;
}

AuthApiError.prototype = Object.create(Error.prototype);