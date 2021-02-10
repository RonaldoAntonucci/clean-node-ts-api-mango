import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation('field', 'fieldToCompare')

describe('RequiredField Validation', () => {
  it('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any', fieldToCompare: 'wrong' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any', fieldToCompare: 'any' })
    expect(error).toBeFalsy()
  })
})
