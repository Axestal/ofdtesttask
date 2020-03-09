function ProductApiError(message) {
    this.name = "ProductApiError";
    this.message = (message || "");
    this.stack = (new Error()).stack;
}

ProductApiError.prototype = Object.create(Error.prototype);