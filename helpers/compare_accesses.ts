export function compareAccesses({ validAccesses, currentAccesses }) {
  if (!validAccesses?.length || !currentAccesses?.length) {

    return false;
  }

  return currentAccesses.some((role) => validAccesses.includes(role));
}
