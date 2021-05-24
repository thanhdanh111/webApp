import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginValueType, Token } from 'helpers/type';
import { DocsValueType } from './docs_reducer';
import { convertToRaw } from 'draft-js';
import { updateDocs } from './docs_actions';

const blockApiModel = (props) => {
  return {
    ...props,
    key: '',
    data: '',
  };
};

export const saveDocument = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const { title, editorState, selectedDocProject }: DocsValueType = getState()?.docs;
    const { extendedCompany }: LoginValueType = getState()?.auth;
    const companyID = extendedCompany?.companyID?._id;

    if (!title || !companyID) {

      return;
    }

    dispatch(updateDocs({ data: { loading: true } }));

    let newDocProject;

    if (!selectedDocProject || !selectedDocProject?._id) {
      newDocProject = await axios.post(
        `${config.BASE_URL}/docProjects`,
        {
          title,
          companyID,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
    }

    const newDocProjectID = newDocProject?.data?._id;

    if (newDocProject && !newDocProjectID) {
      dispatch(updateDocs({ data: { loading: false } }));

      return;
    }

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());

    await axios.post(
      `${config.BASE_URL}/docProjects/${newDocProjectID ?? selectedDocProject?._id}/docPages`,
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

    dispatch(updateDocs({ data: { loading: false } }));
  } catch (error) {
    dispatch(updateDocs({ data: { loading: false } }));
  }
};

export const getDocProjects = () => async (dispatch) => {
  try {
    const token: Token =  localStorage.getItem('access_token');

    dispatch(updateDocs({ data: { loading: true } }));

    const docProjects = await axios.get(`${config.BASE_URL}/docProjects`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (!docProjects?.data?.list?.length) {
      dispatch(updateDocs({ data: { loading: false } }));

      return;
    }

    dispatch(updateDocs({ data: { loading: false, docProjects: docProjects.data.list } }));
  } catch (error) {
    dispatch(updateDocs({ data: { loading: false } }));
  }
};
