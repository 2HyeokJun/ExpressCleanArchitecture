const MissingParamError = require('../error/MissingParamError');
const InternalServerError = require('../error/InternalServerError');
const statusCode = require('../statusCode');

module.exports = class HttpResponse {
    static BadRequest (paramName) {
        return {
            statusCode: statusCode.BadRequest,
            body: new MissingParamError(paramName)
        };
    }

    static InternalServerError () {
        return {
            statusCode: statusCode.InternalServerError,
        };
    }
}