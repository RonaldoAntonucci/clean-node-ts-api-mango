import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../singup/signup-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }

    return badRequest(new MissingParamError('password'))
  }
}
