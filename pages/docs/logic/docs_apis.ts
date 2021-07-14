import axios from 'axios';
import { config } from 'helpers/get_config';
import { UserInfoType, Token } from 'helpers/type';
import { DocsValueType } from './docs_reducer';
import { convertToRaw } from 'draft-js';
import { updateDocs } from './docs_actions';
import { getDesiredChildrenIntoDesiredParents } from '../../../helpers/get_desired_children_into_desired_parents';
import { DocsRole, getProjectAccessOfUsers } from './get_folder_access';
import { getIDsParamsForAxios } from '../../../helpers/get_ids_params_for_axios';
import { getUsersInCompany } from './get_users_in_company';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { checkTrueInArray } from 'helpers/check_true_in_array';

export const createNewPage = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { userID }: UserInfoType = getState()?.userInfo;
    const {
      title,
      editorState,
      selectedDocProject,
      selectedPage,
      docProjectsMap,
      projectAccessOfUsers,
    }: DocsValueType = getState()?.docs;
    const companyID = selectedDocProject?.companyID?._id ?? selectedDocProject?.companyID;
    const docProjectID = selectedDocProject?._id ?? '';

    const invalidData = checkTrueInArray({
      conditionsArray: [
        !title,
        !docProjectID,
        selectedPage?._id,
        !token,
      ],
    });

    if (invalidData) {

      return;
    }

    dispatch(updateDocs({ loading: true }));

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());

    const res = await axios.post(
      `${config.BASE_URL}/docProjects/${docProjectID}/docPages`,
      {
        title,
        companyID,
        pageContent: rawBlocks?.blocks,
        entityMap: Object.values(rawBlocks.entityMap),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const newProjectsMap = docProjectsMap;
    const pageID = res?.data?._id;
    const pagesInProject = newProjectsMap?.[docProjectID]?.pages;

    if (!pagesInProject) {
      dispatch(updateDocs({ loading: false }));

      return;
    }

    pagesInProject[pageID] = {
      title: res?.data?.title,
      _id: res?.data?._id,
      content: JSON.parse(res?.data?.pageContent),
      entityMap: { ...(JSON.parse(res?.data?.entityMap) ?? []) },
      createdBy: {
        _id: userID,
      },
    };

    const accessForNewPage = projectAccessOfUsers?.[userID]?.[docProjectID]?.accessInPages ?? {};

    accessForNewPage[pageID] = [DocsRole.WRITE, DocsRole.READ];

    dispatch(updateDocs({ projectAccessOfUsers, loading: false, docProjectsMap: newProjectsMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const savePage = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const {
      title,
      editorState,
      selectedDocProject,
      selectedPage,
      docProjectsMap,
    }: DocsValueType = getState()?.docs;
    const docProjectID = selectedDocProject?._id;
    const selectedPageID = selectedPage?._id;

    if (!title || !docProjectID || !selectedPageID) {

      return;
    }

    dispatch(updateDocs({ loading: true }));

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());

    const res = await axios.put(
      `${config.BASE_URL}/docProjects/${docProjectID}/docPages/${selectedPageID}`,
      {
        title,
        pageContent: rawBlocks?.blocks,
        entityMap: Object.values(rawBlocks.entityMap),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const newProjectsMap = docProjectsMap;
    const pageID = res?.data?._id;
    const pagesInProject = newProjectsMap?.[docProjectID]?.pages;

    if (!pagesInProject) {
      dispatch(updateDocs({ loading: false }));

      return;
    }

    pagesInProject[pageID] = {
      title: res?.data?.title,
      _id: res?.data?._id,
      content: JSON.parse(res?.data?.pageContent),
      entityMap: { ...(JSON.parse(res?.data?.entityMap) ?? []) },
      createdBy: res?.data?.createdBy,
    };

    dispatch(updateDocs({ loading: false, docProjectsMap: newProjectsMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const deletePage = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const {
      title,
      selectedDocProject,
      selectedPage,
      docProjectsMap,
    }: DocsValueType = getState()?.docs;
    const docProjectID = selectedDocProject?._id;
    const selectedPageID = selectedPage?._id;

    if (!title || !docProjectID || !selectedPageID) {

      return;
    }

    dispatch(updateDocs({ loading: true }));

    await axios.delete(
      `${config.BASE_URL}/docProjects/${docProjectID}/docPages/${selectedPageID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const newDocProjectsMap = docProjectsMap;

    delete newDocProjectsMap[docProjectID]?.pages?.[selectedPageID];

    dispatch(updateDocs({ loading: false, docProjectsMap: newDocProjectsMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

function blendProjectWithoutPagesAndHavingPages(docProjects, docPagesIntoDocProjectsMap) {
  const newProjectsMap = docPagesIntoDocProjectsMap;

  docProjects?.data?.list?.forEach((docProject) => {
    if (!docProject) {

      return;
    }

    const projectID = docProject?._id;

    if (docPagesIntoDocProjectsMap[projectID] !== undefined) {

      return;
    }

    const invalidProject = !projectID || !docProject?.title || !docProject?.companyID;

    if (invalidProject) {

      return;
    }

    docPagesIntoDocProjectsMap[projectID] = {
      title: docProject.title,
      _id: projectID,
      companyID: docProject.companyID,
      pages: {},
      createdBy: docProject.createdBy,
    };
  });

  return newProjectsMap;
}

export const getDocProjects = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;

    if (!companyID) {
      return;
    }

    dispatch(updateDocs({ loading: true }));

    const docPages = await axios.get(`${config.BASE_URL}/docPages`,
      {
        params: {
          companyID,
          limit: 1000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const docProjects = await axios.get(`${config.BASE_URL}/docProjects`,
      {
        params: {
          companyID,
          limit: 200,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    let docPagesIntoDocProjectsMap = getDesiredChildrenIntoDesiredParents({
      children: docPages?.data?.list,
      fieldsOfParent: ['_id', 'title', 'companyID', 'createdBy'],
      fieldsOfChild: ['_id', 'title', 'pageContent', 'entityMap', 'createdBy'],
      parentFieldID: '_id',
      childFieldID: '_id',
      parentFieldInChild: 'docProjectID',
      childName: 'pages',
    });

    if (docProjects?.data?.list?.length) {
      docPagesIntoDocProjectsMap = blendProjectWithoutPagesAndHavingPages(
        docProjects?.data?.list,
        docPagesIntoDocProjectsMap,
      );
    }

    dispatch(updateDocs({
      loading: false,
      docProjectsMap: docPagesIntoDocProjectsMap,
    }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const createNewDocProject = ({ projectName }) => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { currentCompany, userID }: UserInfoType = getState()?.userInfo;
    const { docProjectsMap, projectAccessOfUsers, usersInCompanyMap }: DocsValueType = getState()?.docs;
    const companyID = currentCompany?._id;
    const validData = checkOnlyTrueInArray({
      conditionsArray: [
        !!companyID?.length,
        !!projectName?.length,
        !!token?.length,
      ],
    });

    if (!validData) {
      return;
    }

    dispatch(updateDocs({ loading: true }));

    const res = await axios.post(
      `${config.BASE_URL}/docProjects`,
      {
        companyID,
        title: projectName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const newCompanyID = res?.data?.companyID;
    const newProjectID = res?.data?._id;
    const newTitle = res?.data?.title;
    const validNewData = checkOnlyTrueInArray({
      conditionsArray: [
        !!newCompanyID?.length,
        !!newProjectID?.length,
        !!newTitle?.length,
      ],
    });

    if (!validNewData) {
      dispatch(updateDocs({ loading: false }));

      return;
    }

    const newDocProjectsMap = docProjectsMap;

    newDocProjectsMap[newProjectID] = {
      companyID: newCompanyID,
      _id: newProjectID,
      title: newTitle,
      pages: {},
      createdBy: userID,
    };

    const accessForNewDocProject = {
      ownerInfo: usersInCompanyMap[userID],
      roles: [DocsRole.WRITE, DocsRole.READ],
      accessInPages: {},
    };

    const accessOfUser = projectAccessOfUsers?.[userID] ?? { };

    accessOfUser[newProjectID] = accessForNewDocProject;

    projectAccessOfUsers[userID] = accessOfUser;

    dispatch(updateDocs({ projectAccessOfUsers, loading: false, docProjectsMap: newDocProjectsMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const deleteDocProject = ({ projectID }) => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { docProjectsMap }: DocsValueType = getState()?.docs;

    if (!token || !projectID) {
      return;
    }

    dispatch(updateDocs({ loading: true }));

    await axios.delete(
      `${config.BASE_URL}/docProjects/${projectID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const newDocProjectsMap = docProjectsMap;

    delete newDocProjectsMap[projectID];

    dispatch(updateDocs({ loading: false, docProjectsMap: newDocProjectsMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const getFolderAccessOfProjectIDs = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { docProjectsMap }: DocsValueType = getState()?.docs;

    const projectAccess =  await axios.get(`${config.BASE_URL}/folderAccesses?${
      getIDsParamsForAxios({ ids: Object.keys(docProjectsMap), fieldName: 'orFolderIDs' })}`,
      {
        params: {
          feature: 'DOCS',
          limit: 1000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const projectAccessOfUsers = getProjectAccessOfUsers({ projectAccess: projectAccess?.data?.list });

    dispatch(updateDocs({ projectAccessOfUsers }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const getUsersInCompanyApi = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { currentCompany }: UserInfoType = getState()?.userInfo;
    const companyID = currentCompany?._id;

    if (!token || !companyID) {
      return;
    }

    const usersInCompany = await axios.get(`${config.BASE_URL}/userAccesses`,
      {
        params: {
          companyID,
          limit: 1000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const usersMap = getUsersInCompany({ users: usersInCompany?.data?.list });

    dispatch(updateDocs({ usersInCompanyMap: usersMap }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

const roles = {
  READ: 'read',
  WRITE: 'write',
};

export const shareDocument = ({ role, userID }) => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { selectedDocProject, usersInCompanyMap, projectAccessOfUsers, selectedPage }: DocsValueType = getState()?.docs;
    const selectedProjectID =  selectedDocProject?._id;
    const selectedPageID = selectedPage?._id;

    if (!token || !selectedProjectID || roles[role] === undefined) {
      return;
    }

    dispatch(updateDocs({ loading: true }));

    const endpoint = roles[role];

    await axios.request(
      {
        method: 'POST',
        url: `${config.BASE_URL}/folderAccesses/${endpoint}/add`,
        data: {
          userID,
          feature: 'DOCS',
          folderID: selectedProjectID,
          pageID: selectedPageID ?? null,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const accessInProjectID = projectAccessOfUsers?.[userID]?.[selectedProjectID] ?? {
      ownerInfo: usersInCompanyMap[userID],
      roles: [],
      accessInPages: {},
    };

    accessInProjectID?.roles?.push(role);

    const accessOfUser = projectAccessOfUsers?.[userID] ?? { };

    accessOfUser[selectedProjectID] = accessInProjectID;

    projectAccessOfUsers[userID] = accessOfUser;

    dispatch(updateDocs({ projectAccessOfUsers, loading: false  }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const autoSavePage = ({ timestamp, projectID, selectedPageID  }) => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const {
      title,
      docProjectsMap,
    }: DocsValueType = getState()?.docs;
    const page = docProjectsMap?.[projectID]?.pages?.[selectedPageID];
    const invalidData = checkTrueInArray({
      conditionsArray: [
        !title,
        !projectID,
        !selectedPageID,
        !page,
        !page?.title,
        !page?.content,
      ],
    });

    if (invalidData) {
      dispatch(updateDocs({ shouldAutoSave: true }));

      return;
    }

    await axios.put(
      `${config.BASE_URL}/docProjects/${projectID}/docPages/${selectedPageID}`,
      {
        title: page?.title ?? null,
        pageContent: page?.content,
        entityMap: Object.values(page?.entityMap ?? []) ?? [],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    dispatch(updateDocs({ shouldAutoSave: true, lastUpdateEditTimestamp: timestamp }));
  } catch (error) {
    dispatch(updateDocs({ shouldAutoSave: true }));
  }
};
