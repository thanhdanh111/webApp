import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginValueType, Token } from 'helpers/type';
import { DocsValueType } from './docs_reducer';
import { convertToRaw } from 'draft-js';
import { updateDocs } from './docs_actions';
import { getDesiredChildrenIntoDesiredParents } from '../../../helpers/get_desired_children_into_desired_parents';

const blockApiModel = (props) => {
  return {
    ...props,
    data: '',
  };
};

export const createNewPage = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const {
      title,
      editorState,
      selectedDocProject,
      selectedPage,
      storeProjectsIndice,
      docProjects,
    }: DocsValueType = getState()?.docs;
    const companyID = selectedDocProject?.companyID?._id ?? selectedDocProject?.companyID;
    const docProjectID = selectedDocProject?._id;

    if (!title || !docProjectID || selectedPage?._id || !token) {

      return;
    }

    dispatch(updateDocs({ loading: true }));

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());

    const res = await axios.post(
      `${config.BASE_URL}/docProjects/${docProjectID}/docPages`,
      {
        title,
        companyID,
        pageContent: rawBlocks?.blocks?.map((block) => blockApiModel(block)),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const projectIndex = storeProjectsIndice[docProjectID];

    if (typeof projectIndex !== 'number') {
      dispatch(updateDocs({ loading: false, shouldCallApi: true }));

      return;
    }

    const newProjects  = docProjects;
    newProjects[projectIndex]?.pages?.push({
      title: res?.data?.title,
      _id: res?.data?._id,
      pageContent: res?.data?.pageContent,
    });

    dispatch(updateDocs({ loading: false, docProjects: [...newProjects] }));
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
      storeProjectsIndice,
      docProjects,
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
        pageContent: rawBlocks?.blocks?.map((block) => blockApiModel(block)),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const projectIndex = storeProjectsIndice[docProjectID];

    if (typeof projectIndex !== 'number') {
      dispatch(updateDocs({ loading: false, shouldCallApi: true }));

      return;
    }

    const newProjects  = docProjects;
    newProjects[projectIndex].pages = newProjects[projectIndex]?.pages?.map((page) => {
      if (page?._id === res?.data._id) {
        return {
          pageContent: res?.data?.pageContent,
          title: res?.data?.title,
          _id: res?.data?._id,
        };
      }

      return page;
    });

    dispatch(updateDocs({ loading: false, docProjects: [...newProjects] }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const getDocProjects = () => async (dispatch) => {
  try {
    const token: Token =  localStorage.getItem('access_token');

    dispatch(updateDocs({ loading: true }));

    const docPages = await axios.get(`${config.BASE_URL}/docPages`,
      {
        params: {
          limit: 1000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!docPages?.data?.list?.length) {
      dispatch(updateDocs({ loading: false }));

      return;
    }

    const docProjects = await axios.get(`${config.BASE_URL}/docProjects`,
      {
        params: {
          limit: 1000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const projects: object[] = [];

    const docPagesIntoDocProjects = getDesiredChildrenIntoDesiredParents({
      children: docPages?.data?.list,
      fieldsOfParent: ['_id', 'title', 'companyID'],
      fieldsOfChild: ['_id', 'title', 'pageContent'],
      parentFieldID: '_id',
      parentFieldInChild: 'docProjectID',
      childName: 'pages',
    });

    const storeNewParentsIndice = docPagesIntoDocProjects.desiredParentsIndice;

    if (docProjects?.data?.list?.length) {

      for (const [index, docProject] of docProjects?.data?.list.entries()) {
        const projectID = docProject?._id;

        if (typeof storeNewParentsIndice[projectID] === 'number') {
          projects.push(docPagesIntoDocProjects.desiredParents[storeNewParentsIndice[projectID]]);
          storeNewParentsIndice[projectID] = index;

          continue;
        }

        const invalidProject = !projectID || !docProject?.title || !docProject?.companyID;
        const cannotContinue = invalidProject;

        if (cannotContinue) {

          continue;
        }

        storeNewParentsIndice[projectID] = index;

        projects.push({
          title: docProject.title,
          _id: projectID,
          companyID: docProject.companyID,
          pages: [],
        });
      }
    }

    dispatch(updateDocs({ loading: false, docProjects: projects, storeProjectsIndice: storeNewParentsIndice }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};

export const createNewDocProject = ({ projectName }) => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { extendedCompany }: LoginValueType = getState()?.auth;
    const { docProjects }: DocsValueType = getState()?.docs;
    const companyID = extendedCompany?.companyID?._id;

    if (!companyID || !projectName || !token) {
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

    if (!newCompanyID || !newProjectID || !newTitle) {
      dispatch(updateDocs({ loading: false }));

      return;
    }

    const newDocProject = {
      companyID: newCompanyID,
      _id: newProjectID,
      title: newTitle,
    };

    dispatch(updateDocs({ loading: false, docProjects: [...docProjects, newDocProject] }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};
