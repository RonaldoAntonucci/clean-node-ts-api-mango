import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate (input: any): Error | null {
        return new MissingParamError('field')
      }
    }
    const sut = new ValidationComposite([new ValidationStub()])
    const error = sut.validate({ field: 'any_valute' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
