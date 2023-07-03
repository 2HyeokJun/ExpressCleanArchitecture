const HttpResponse = require('../response/HttpResponse');
const statusCode = require('../statusCode');

module.exports = class LoginRouter {
    constructor (authUseCase) {
        this.authUseCase = authUseCase;
    }
    
    route (httpRequest) {
        try {
            const {email, password} = httpRequest.body;
            if (!email) {
                return HttpResponse.BadRequestError('email');
            }
            if (!password) {
                return HttpResponse.BadRequestError('password');
            }
            this.authUseCase.auth(email, password);

            const accessToken = this.authUseCase.auth(email, password);
            if (!accessToken) {
                return HttpResponse.UnauthorizedError(); 
            }
            return HttpResponse.Ok({accessToken});
        } catch (error) {
            return HttpResponse.InternalServerError();
        }
    }
}