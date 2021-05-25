import axios from 'axios';
import { config } from 'helpers/get_config';
import { Token } from 'helpers/type';
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

export const saveDocument = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { title, editorState, selectedDocProject }: DocsValueType = getState()?.docs;
    const companyID = selectedDocProject?.companyID?._id;
    const docProjectID = selectedDocProject?._id;

    if (!title || !companyID || !docProjectID) {

      return;
    }

    dispatch(updateDocs({ loading: true }));

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());

    await axios.post(
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

    dispatch(updateDocs({ loading: false }));
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const projectsWithoutPages: object[] = [];

    const docPagesIntoDocProjects = getDesiredChildrenIntoDesiredParents({
      children: docPages?.data?.list,
      fieldsOfParent: ['_id', 'title', 'companyID'],
      fieldsOfChild: ['_id', 'title', 'pageContent'],
      parentFieldID: '_id',
      parentFieldInChild: 'docProjectID',
      childName: 'pages',
    });

    if (docProjects?.data?.list?.length) {
      const filteredProjectsHavePages = docPagesIntoDocProjects.desiredParentsIndice;

      for (const docProject of docProjects?.data?.list) {
        const projectID = docProject?._id;
        const invalidProject = !projectID || !docProject?.title || !docProject?.companyID;
        const cannotContinue = invalidProject || typeof filteredProjectsHavePages[projectID] === 'number';

        if (cannotContinue) {

          continue;
        }

        projectsWithoutPages.push({
          title: docProject.title,
          _id: projectID,
          companyID: docProject.companyID,
          pages: [],
        });
      }
    }

    dispatch(updateDocs({ loading: false, docProjects: [...docPagesIntoDocProjects?.desiredParents, ...projectsWithoutPages] }));
  } catch (error) {
    dispatch(updateDocs({ loading: false }));
  }
};
