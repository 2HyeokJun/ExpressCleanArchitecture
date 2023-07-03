module.exports = class InternalServerError extends Error {
    constructor (paramName) {
        // super(`Missing param: ${paramName}`);
        this.name = 'InternalServerError';
    }
}