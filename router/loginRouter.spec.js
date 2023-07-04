const LoginRouter = require('./loginRouter');
const MissingParamError = require('../error/MissingParamError');
const UnauthorizedError = require('../error/UnauthorizedError');
const InternalServerError = require('../error/InternalServerError');

const statusCode = require('../statusCode');


const makeSut = () => {
    const authUseCaseSpy = makeAuthUseCase();
    authUseCaseSpy.accessToken = 'valid_access_token';
    const sut = new LoginRouter(authUseCaseSpy);
    return {
        sut,
        authUseCaseSpy,
    }
}

const makeAuthUseCase = () => {
    class AuthUseCaseSpy {
        auth (email, password) {
            this.email = email;
            this.password = password;

            return this.accessToken;
        }
    }
    return new AuthUseCaseSpy();
}

const makeAuthUseCaseWithError = () => {
    class AuthUseCaseSpy {
        auth () {
            throw new Error();
        }
    }
    return new AuthUseCaseSpy();
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
                email: 'invalid_email@email.com',
                password: 'invalid_password',
            }
        };
        authUseCaseSpy.accessToken = null;
        const httpResponse = sut.route(httpRequest);
        
        expect(httpResponse.statusCode).toBe(statusCode.Unauthorized);
        expect(httpResponse.body).toEqual(new UnauthorizedError());

    })

    test('should return 500 if no httpRequest is provided', () => {
        const {sut} = makeSut();
        const httpResponse = sut.route({});
        
        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
        expect(httpResponse.body).toEqual(new InternalServerError());
    })

    test('should return 500 if httpRequest has no body', () => {
        const sut = new LoginRouter();
        const httpResponse = sut.route({});

        expect(httpResponse.statusCode).toBe(statusCode.InternalServerError);
        expect(httpResponse.body).toEqual(new InternalServerError());
    })

    test('should return 500 if no AuthUseCase is provided', () => {
        // const {sut} = makeSut();
        const sut = new LoginRouter();
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
        const authUseCaseSpy = makeAuthUseCaseWithError();
        const sut = new LoginRouter(authUseCaseSpy);
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
})