interface ValidDateTimeType {
  time: Date
  minDate: Date
  maxDate: Date
}

export const checkValidDateTime = (data: ValidDateTimeType) => {
  if (!data.time) {
    return true
  }

  const minYear = data?.minDate?.getFullYear()
  const maxYear = data?.maxDate?.getFullYear()
  const year = data?.time?.getFullYear()

  if (year >= minYear && year <= maxYear) {
    return true
  }

  return false
}
