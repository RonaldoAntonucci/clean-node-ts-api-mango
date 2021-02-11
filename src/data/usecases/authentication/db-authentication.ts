import {
  Authentication,
  LoadAccountByEmailRepository,
  HashComparer,
  AuthenticationModel,
  TokenGenerator,
  UpdateAcessTokenRepository
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    if (!account) {
      return null
    }
    const isValid = await this.hashComparer.compare(authenticationModel.password, account.password)
    if (!isValid) {
      return null
    }
    const acessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAcessTokenRepository.update(account.id, acessToken)
    return acessToken
  }
}
