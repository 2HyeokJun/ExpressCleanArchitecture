class SignUpUseCase {
    async signUp(email, password, repeatPassword) {
        if (password === repeatPassword) {
            new AddAccountRepository.add(email, password)
        }
    }
}