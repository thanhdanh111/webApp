import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { User } from 'helpers/type';

enum Role {
  READ = 'READ',
  WRITE = 'WRITE',
}

interface ProjectAccessApi {
  pageID?: string;
  _id?: string;
  userID?: User;
  folderID?: string;
  role?: Role;
  feature?: string;
}

interface AccessInPages {
  [pageID: string]: Role[];
}

interface ProjectAccess {
  roles: Role[];
  accessInPages: AccessInPages;
  ownerInfo: User;
}

export interface ProjectAccessMap {
  [projectID: string]: ProjectAccess;
}

interface GetProjectAccess {
  projectAccess: ProjectAccessApi[] | [];
}

export interface ProjectAccessMapOfUsers {
  [userID: string]: ProjectAccessMap;
}

export function getProjectAccessOfUsers({ projectAccess }: GetProjectAccess): ProjectAccessMapOfUsers {
  const projectAccessOfUsers = { };

  if (!projectAccess?.length) {
    return projectAccessOfUsers;
  }

  projectAccess.forEach((access) => {
    if (!access) {

      return;
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
      return;
    }

    let projectAccessOfUser = projectAccessOfUsers?.[userID]?.[folderID];
    const pageID = access?.pageID ?? '';

    if (projectAccessOfUser && !pageID) {
      projectAccessOfUser.roles.push(role);
    }

    if (projectAccessOfUser === undefined) {
      projectAccessOfUser =  {
        roles: [role],
        accessInPages: { },
        ownerInfo: access.userID,
      };
    }

    const createdPageAccess = projectAccessOfUser.accessInPages[pageID];

    if (createdPageAccess) {
      projectAccessOfUser.accessInPages[pageID].push(role);
    }

    if (pageID && createdPageAccess === undefined) {
      projectAccessOfUser.accessInPages[pageID] = [role];
    }

    projectAccessOfUsers[userID] = {
      ...(projectAccessOfUsers[userID] ?? { }),
      [folderID]: projectAccessOfUser,
    };

    return;
  });

  return projectAccessOfUsers;
}
