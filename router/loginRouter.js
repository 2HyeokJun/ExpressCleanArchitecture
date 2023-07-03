const HttpResponse = require('../response/HttpResponse')

module.exports = class LoginRouter {
    route (httpRequest) {
        if (!httpRequest || !httpRequest.body) {
            return HttpResponse.InternalServerError();
        }
        const {email, password} = httpRequest.body;
        if (!email) {
            return HttpResponse.BadRequest('email');
        }
        if (!password) {
            return HttpResponse.BadRequest('password');
        }
    }
}