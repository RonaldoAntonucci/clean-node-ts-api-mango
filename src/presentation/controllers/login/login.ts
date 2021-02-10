import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../singup/signup-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return badRequest(new MissingParamError('password'))
    } catch (err) {
      return serverError(err)
    }
  }
}
