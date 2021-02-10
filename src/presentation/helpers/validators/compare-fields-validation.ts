import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly filedToCompareName: string
  ) {}

  validate (input: any): null | Error {
    if (input[this.fieldName] !== input[this.filedToCompareName]) {
      return new InvalidParamError(this.filedToCompareName)
    }

    return null
  }
}
