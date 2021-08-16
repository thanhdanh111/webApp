import { checkIfEmptyArray } from './check_if_empty_array'

export const checkIfNotEmpty = ({ fields }) => {
  if (!fields) {
    return
  }

  return fields.some((field) => {
    if (Array.isArray(field)) {
      return checkIfEmptyArray(field)
    }

    return true
  })
}
