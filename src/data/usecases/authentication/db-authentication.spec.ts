import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptograph/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptograph/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAcessTokenRepository } from '../../protocols/db/update-acess-token-repository'
import { DbAuthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | undefined> {
      const account: AccountModel = makeFakeAccount()
      return account
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return 'any_token'
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAcessTokenRepositoryStub = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    async update (id: string, token: string): Promise<void> {}
  }

  return new UpdateAcessTokenRepositoryStub()
}

const makeFakeAuthRequest = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepositoryStub()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAcessTokenRepositoryStub
  )

  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAcessTokenRepositoryStub }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepositorywith correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(sut.auth(makeFakeAuthRequest())).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepositorywith returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(undefined))
    const acessToken = await sut.auth(makeFakeAuthRequest())
    expect(acessToken).toBeNull()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthRequest())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(sut.auth(makeFakeAuthRequest())).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const acessToken = await sut.auth(makeFakeAuthRequest())
    expect(acessToken).toBe(null)
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthRequest())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(sut.auth(makeFakeAuthRequest())).rejects.toThrow()
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut } = makeSut()
    const acessToken = await sut.auth(makeFakeAuthRequest())
    expect(acessToken).toBe('any_token')
  })

  it('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthRequest())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('Should throw if UpdateAcessTokenRepository throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAcessTokenRepositoryStub, 'update').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(sut.auth(makeFakeAuthRequest())).rejects.toThrow()
  })
})
