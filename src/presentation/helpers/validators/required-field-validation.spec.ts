import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  it('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
