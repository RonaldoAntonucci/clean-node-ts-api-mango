import {
  Authentication,
  LoadAccountByEmailRepository,
  HashComparer,
  AuthenticationModel,
  Encrypter,
  UpdateAcessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadAccountByEmail(authenticationModel.email)
    if (!account) {
      return null
    }
    const isValid = await this.hashComparer.compare(authenticationModel.password, account.password)
    if (!isValid) {
      return null
    }
    const acessToken = await this.encrypter.encrypt(account.id)
    await this.updateAcessTokenRepository.updateAcessToken(account.id, acessToken)
    return acessToken
  }
}
