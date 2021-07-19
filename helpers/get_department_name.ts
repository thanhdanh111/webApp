import { Department } from './type'
import { checkIfEmptyArray } from './check_if_empty_array'

export const getDepartmentsName = (departments) => {

  if (!checkIfEmptyArray(departments)) {
    return
  }

  const newArray: string[] = []

  departments.map((item: Department) => {
    newArray.push(item?.name ?? '')
  })

  return newArray
}
