const LoginRouter = require('./loginRouter');
const MissingParamError = require('../error/MissingParamError');
const UnauthorizedError = require('../error/UnauthorizedError');

const statusCode = require('../statusCode');
// const InternalServerError = require('../error/InternalServerError');

const makeSut = () => {
    class AuthUseCaseSpy {
        auth (email, password) {
            this.email = email;
            this.password = password;

            return this.accessToken;
        }
    }
    const authUseCaseSpy = new AuthUseCaseSpy();
    authUseCaseSpy.accessToken = 'valid_access_token';
    const sut = new LoginRouter(authUseCaseSpy);
    return {
        sut,
        authUseCaseSpy,
    }
}

describe('loginRouter', () => {
    test('should return 200 when valid credentials are provided', () => {
        const {sut, authUseCaseSpy} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        };
        const httpResponse = sut.route(httpRequest);
        authUseCaseSpy.accessToken = 'valid_access_token';
        expect(httpResponse.statusCode).toBe(statusCode.Ok);
        expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken);
    })


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

    test('should call authUseCaseSpy with correct params', () => {
        const {sut, authUseCaseSpy} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        };
        sut.route(httpRequest);

        expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
        expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
    })

    test('should call 401 when invalid credentials are provided', () => {
        const {sut, authUseCaseSpy} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        };
        const httpResponse = sut.route(httpRequest);
        authUseCaseSpy.accessToken = null;
        
        expect(httpResponse.statusCode).toBe(statusCode.Unauthorized);

    })

    test('should return 500 if no httpRequest is provided', () => {
        const {sut} = makeSut();
        const httpResponse = sut.route({});
        
        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
    })

    test('should return 500 if no AuthUseCase is provided', () => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        }
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
        expect(httpResponse.body).toEqual(new InternalServerError());
    })

    test('should return 500 if no AuthUseCase has no auth method', () => {
        const sut = new LoginRouter({});
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        }
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
        expect(httpResponse.body).toEqual(new InternalServerError());
    })

    test('should return 500 if AuthUseCase throws', () => {
        class AuthUseCaseSpy {
            auth () {
                throw new Error();
            }
        }
        const authUseCaseSpy = new AuthUseCaseSpy();
        authUseCaseSpy.accessToken = 'valid_access_token';
        const sut = new LoginRouter(authUseCaseSpy);
        const httpRequest = {
            body: {
                email: 'email@email.com',
                password: 'password',
            }
        }
        return {
            sut,
            authUseCaseSpy,
        }
    })
})