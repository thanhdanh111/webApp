interface Check {
  variable?: string
  equalCondition?: string
  notEqualCondition?: string
}

export function checkStringCondition({ variable, equalCondition, notEqualCondition }: Check): boolean {
  if (!variable || typeof variable !== 'string') {
    return false
  }

  if (equalCondition) {
    return variable === equalCondition
  }

  if (notEqualCondition) {
    return variable !== notEqualCondition
  }

  return false
}
