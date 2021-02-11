import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  it('Should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toHaveProperty('name', 'any_name')
    expect(account).toHaveProperty('email', 'any_email@mail.com')
    expect(account).toHaveProperty('password', 'any_password')
    expect(account).toHaveProperty('id')
  })

  it('Should return an account on loadByEmail success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toHaveProperty('name', 'any_name')
    expect(account).toHaveProperty('email', 'any_email@mail.com')
    expect(account).toHaveProperty('password', 'any_password')
    expect(account).toHaveProperty('id')
  })

  it('Should return an null on loadByEmail fails', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')
    expect(account).toBeNull()
  })

  it('Should update the account acessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const res = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const { _id } = res.ops[0]
    expect(res.ops[0].acessToken).toBeFalsy()
    await sut.updateAcessToken(_id, 'any_token')
    const account = await accountCollection.findOne({ _id })
    expect(account).toBeTruthy()
    expect(account).toHaveProperty('acessToken', 'any_token')
  })
})
