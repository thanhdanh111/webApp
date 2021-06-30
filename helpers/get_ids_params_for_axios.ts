export function getIDsParamsForAxios({ ids, fieldName }) {
  if (!ids?.length) {
    return '';
  }

  return ids.map((id, index) => `${fieldName}[${index}]=${id}`).join('&');
}
