export const passwordInputErrors = (value, label) => {
  let error = ''

  if (label.required && !value) {
    error = `${label.fieldName} is required`
  }

  if (label.checkLength && value.length && label.checkLength > value.length) {
    error = `Password must be at least ${label.checkLength} characters`
  }

  return error
}
