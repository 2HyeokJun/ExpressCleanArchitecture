class AddAccountRepository {
    async add (email, password, repeatPassword) {
        const user = await AccountModel.create({email, password});
        return user;
    }
}