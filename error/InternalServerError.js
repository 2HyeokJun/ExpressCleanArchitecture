module.exports = class InternalServerError extends Error {
    constructor (paramName) {
        super(`Internal Server Error`);
        this.name = 'InternalServerError';
    }
}