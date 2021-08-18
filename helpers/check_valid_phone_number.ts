export const checkValidPhonenumber = (inputtxt?: string) => {
  if (!inputtxt) {
    return true
  }

  if (inputtxt.length > 10) {
    return false
  }

  const phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

  return phoneno.test(inputtxt)
}
