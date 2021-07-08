import { DocsRole } from './get_folder_access';

export function getItemSelectedRolesOfUser({ userID, selectedPageID, selectedProjectID, projectAccessOfUsers }): DocsRole[] {
  let rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.roles ?? [];

  if (rolesOfUser.includes(DocsRole.WRITE)) {

    return [DocsRole.WRITE, DocsRole.READ];
  }

  if (rolesOfUser.includes(DocsRole.READ)) {
    return [DocsRole.READ];
  }

  if (selectedPageID?.length) {
    rolesOfUser = projectAccessOfUsers?.[userID]?.[selectedProjectID]?.accessInPages?.[selectedPageID] ?? [];
  }

  return rolesOfUser;
}
