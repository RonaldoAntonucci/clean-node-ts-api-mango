import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidation: EmailValidator
  ) {}

  validate (input: any): null | Error {
    if (!this.emailValidation.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
