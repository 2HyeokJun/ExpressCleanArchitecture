const MissingParamError = require('../error/MissingParamError');
const InternalServerError = require('../error/InternalServerError');
const UnauthorizedError = require('../error/UnauthorizedError');
const statusCode = require('../statusCode');

module.exports = class HttpResponse {
    static Ok (data) {
        return {
            statusCode: statusCode.Ok,
            body: data,
        }
    }

    static BadRequestError (paramName) {
        return {
            statusCode: statusCode.BadRequest,
            body: new MissingParamError(paramName)
        };
    }

    static UnauthorizedError () {
        return {
            statusCode: statusCode.Unauthorized,
            body: new UnauthorizedError(),
        }
    }

    static InternalServerError () {
        return {
            statusCode: statusCode.InternalServerError,
            body: new InternalServerError(),
        
        };
    }
}