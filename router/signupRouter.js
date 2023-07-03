import express from 'express';
import statusCode from '../statusCode';

const router = express.Router();

class SignUpRouter {
    async route (httpRequest) {
        const {email, password, repeatPassword} = req.body;
        new SignUpUseCase().signUp(email, password, repeatPassword);
        res.status(400).json({
            error: "password must be equal to repeatPassword",
        })
        return {
            statusCode: statusCode.OK,
            body: user,
        }
    }
}

class ExpressRouterAdapter {
    static adapt (router) {
        return async (req, res) => {
            const httpRequest = {
                body: req.body,
            }
            const httpResponse = await router.route(httpRequest);
            res.status(httpResponse.statusCode).json(httpResponse.body);
        }
    }
}

module.exports = () => {
    const router = new SignUpRouter();
    router.post('/signup', ExpressRouterAdapter.adapt(router));
}