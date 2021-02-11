import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { ok, serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

const makeFakeRequest = (): HttpRequest => ({
  body: {}
})

const makeFakeReturn = (): {} => ({})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'

  return serverError(fakeError)
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = ok(makeFakeReturn())

      return httpResponse
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {}
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()

  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(handleSpy).toBeCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakeReturn()))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const logEpy = jest.spyOn(logErrorRepositoryStub, 'logError')

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => makeFakeServerError())

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(logEpy).toBeCalledWith('any_stack')
  })
})
