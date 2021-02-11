import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'hash'
  },

  async compare (): Promise<boolean> {
    return true
  }
}))

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a valid hash on hash success', async () => {
    const sut = makeSut()

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  it('Should throw if Bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      throw new Error()
    })

    await expect(sut.hash('any_value')).rejects.toThrow()
  })

  it('Should call compare with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')

    expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
