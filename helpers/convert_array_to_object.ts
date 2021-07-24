import { checkIfEmptyArray } from './check_if_empty_array'

export const convertArrayStringToObject = (array: string[], label: string) => {
  if (!checkIfEmptyArray(array)) {
    return { }
  }
  const obj = { }

  array.forEach((value, index) => obj[`${label}[${index}]`] = value)

  return obj
}

export function convertArrayObjectToObject<T>(array: T[], key: string){
  if (!checkIfEmptyArray(array)) {
    return { }
  }
  const obj = { }
  array.forEach((item) => obj[getValue(key, item)] = item)

  return obj
}

const getValue = (keys, obj) => {
  const splitedKeys = keys.split('.')

  return splitedKeys.reduce((accumulator, currentValue) => {
    return accumulator[currentValue]
  }, obj)
}
