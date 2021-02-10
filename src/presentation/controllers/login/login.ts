import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Validation } from '../singup/signup-protocols'
import { Controller, HttpRequest, HttpResponse, Authentication } from './login-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body

      const acessToken = await this.authentication.auth(email, password)
      if (!acessToken) {
        return unauthorized()
      }

      return ok({ acessToken })
    } catch (err) {
      return serverError(err)
    }
  }
}
