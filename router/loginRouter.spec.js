const LoginRouter = require('./loginRouter');
const MissingParamError = require('../error/MissingParamError');
const statusCode = require('../statusCode');
// const InternalServerError = require('../error/InternalServerError');

const makeSut = () => {
    class AuthUseCase {
        auth (email, password) {
            this.email = email;
            this.password = password;
        }
    }
    const authUseCase = new AuthUseCase();
    const sut = new LoginRouter(authUseCase);
    return {
        sut,
        authUseCase,
    }
}

describe('loginRouter', () => {
    test('should return 400 if no email is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                password: 'password',
            }
        };

        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(statusCode.BadRequest);
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should return 400 if no password is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
            }
        };
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(statusCode.BadRequest);
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should return 500 if no httpRequest is provided', () => {
        const {sut} = makeSut();
        const httpResponse = sut.route({});
        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
    })
})