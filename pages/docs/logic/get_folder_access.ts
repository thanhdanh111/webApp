import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { User } from 'helpers/type';
import { CreatedBy } from './docs_reducer';

export enum DocsRole {
  READ = 'READ',
  WRITE = 'WRITE',
}

interface ProjectAccessApi {
  pageID?: string;
  _id?: string;
  userID?: User;
  folderID?: string;
  role?: DocsRole;
  feature?: string;
  createdBy?: CreatedBy;
}

interface AccessInPages {
  [pageID: string]: DocsRole[];
}

interface ProjectAccess {
  roles: DocsRole[];
  accessInPages: AccessInPages;
  ownerInfo: User;
}

export interface ProjectAccessMap {
  [projectID: string]: ProjectAccess;
}

export interface ProjectAccessMapOfUsers {
  [userID: string]: ProjectAccessMap;
}

interface GetProjectAccess {
  projectAccess: ProjectAccessApi[] | [];
}

function checkValidData({ access }) {
  if (!access) {

    return false;
  }

  const userID = access?.userID?._id ?? '';
  const folderID = access?.folderID ?? '';
  const role = access?.role ?? '';
  const validData = checkOnlyTrueInArray({
    conditionsArray: [
      !!userID,
      !!folderID,
      !!role,
    ],
  });

  if (!validData) {
    return false;
  }

  return true;
}

function updateAccessForBothUsers({ folderAccessOfUsers, access }) {
  const userCreatedID = access?.createdBy?._id ?? '';
  const userID = access?.userID?._id ?? '';
  const folderID = access?.folderID ?? '';
  const pageID = access?.pageID ?? '';
  const role = access?.role ?? '';

  if (!userCreatedID || !userID) {
    return folderAccessOfUsers;
  }

  const folderAccessOfCreatedUser = folderAccessOfUsers?.[userCreatedID]?.[folderID] ??  {
    roles: [],
    accessInPages: { },
    ownerInfo: access.createdBy,
  };

  const folderAccessOfUser = folderAccessOfUsers?.[userID]?.[folderID] ?? {
    roles: [],
    accessInPages: { },
    ownerInfo: access.userID,
  };

  if (!pageID) {
    folderAccessOfCreatedUser.roles = [DocsRole.WRITE, DocsRole.READ];

    folderAccessOfUser.roles.push(role);
  }

  const createdPageAccessOfUser = folderAccessOfUser.accessInPages[pageID] ?? [];

  if (pageID) {
    folderAccessOfCreatedUser.accessInPages = {
      ...folderAccessOfCreatedUser.accessInPages,
      [pageID]: [DocsRole.WRITE, DocsRole.READ],
    };

    folderAccessOfUser.accessInPages[pageID] = [...createdPageAccessOfUser, role];
  }

  folderAccessOfUsers[userCreatedID] = {
    ...(folderAccessOfUsers?.[userCreatedID]  ?? {}),
    [folderID]: folderAccessOfCreatedUser,
  };

  folderAccessOfUsers[userID] = {
    ...(folderAccessOfUsers?.[userID] ?? {}),
    [folderID]: folderAccessOfUser,
  };

  return folderAccessOfUsers;
}

function updateAccessForOneUser({ folderAccessOfUsers, access }) {
  const userID = access?.userID?._id ?? '';
  const folderID = access?.folderID ?? '';
  const role = access?.role ?? '';
  const pageID = access?.pageID ?? '';

  const folderAccessOfUser = folderAccessOfUsers?.[userID]?.[folderID] ?? {
    roles: [],
    accessInPages: { },
    ownerInfo: access.userID,
  };

  if (!pageID) {
    folderAccessOfUser.roles.push(role);

    folderAccessOfUsers[userID] = {
      ...(folderAccessOfUsers[userID] ?? { }),
      [folderID]: folderAccessOfUser,
    };

    return folderAccessOfUsers;
  }

  const createdPageAccess = folderAccessOfUser?.accessInPages?.[pageID] ?? [];

  createdPageAccess.push(role);

  folderAccessOfUsers[userID][folderID].accessInPages[pageID] = createdPageAccess;

  return folderAccessOfUsers;
}

export function getProjectAccessOfUsers({ projectAccess }: GetProjectAccess): ProjectAccessMapOfUsers {
  let folderAccessOfUsers = { };

  if (!projectAccess?.length) {
    return folderAccessOfUsers;
  }

  projectAccess.forEach((access) => {
    if (!checkValidData({ access })) {
      return;
    }

    const userID = access?.userID?._id ?? '';
    const createdUserID = access?.createdBy?._id ?? '';

    if (userID !== createdUserID) {
      folderAccessOfUsers = updateAccessForBothUsers({ folderAccessOfUsers, access });

      return;
    }

    folderAccessOfUsers = updateAccessForOneUser({ folderAccessOfUsers, access });

    return;
  });

  return folderAccessOfUsers;
}
