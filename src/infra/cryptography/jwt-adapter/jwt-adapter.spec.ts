import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign: async (): Promise<string> => {
    return 'any_token'
  }
}))

describe('Jwt Adapter', () => {
  it('Should call sign  with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_id')
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })
})
