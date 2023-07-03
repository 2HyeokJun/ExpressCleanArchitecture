import statusCode from '../statusCode';

class LoginRouter {
    route (httpRequest) {
        const {email, password} = httpRequest.body;
        if (!email || !password) {
            return {
                statusCode: statusCode.BadRequest,
            }
        }
    }
}