import { Roles } from '../constants/roles';
import { compareAccesses } from '../helpers/compare_accesses';

interface ObjectMapOfRoles {
  [key: string]: Roles[];
}

interface GetIDsOfValidAccesses {
  objectMap: ObjectMapOfRoles;
  validAccesses: Roles[];
}

export function getIDsOfValidAccesses({
  objectMap,
  validAccesses,
}: GetIDsOfValidAccesses) {
  const ids: string[] = [];

  for (const id in objectMap) {
    if (!id) {

      continue;
    }

    const currentAccesses = objectMap[id];
    const haveValidAccess = compareAccesses({ currentAccesses, validAccesses });

    if (!haveValidAccess) {

      continue;
    }

    ids.push(id);
  }

  return ids;
}
