import React, { useEffect } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { createNewDocProject, getDocProjects } from '../logic/docs_apis';
import { RootState } from 'redux/reducers_registration';
import { DocsValueType } from '../logic/docs_reducer';
import { updateDocs } from '../logic/docs_actions';
import { convertFromRaw, EditorState } from 'draft-js';
import CreateNewProjectDialog from './docs_new_project';
import { Tooltip, IconButton, List } from '@material-ui/core';
import DocsProjectUI from './docs_project';

const DocsTreeView = () => {
  const dispatch = useDispatch();
  const { docProjects, shouldCallApi, loading }: DocsValueType = useSelector((state: RootState) => state.docs);
  const router = useRouter();

  useEffect(() => {
    if (!shouldCallApi) {

      return;
    }

    dispatch(getDocProjects());
    dispatch(updateDocs({ shouldCallApi: false }));
  }, [shouldCallApi]);

  async function backToHome() {

    await router.push('/home');
  }

  function onClickProject(project) {
    dispatch(updateDocs({
      selectedDocProject: project,
      selectedPage: {},
      editorState: EditorState.createEmpty(),
      title: '',
    }));
  }

  function onClickPage(page) {
    const convertedBlocks = JSON.parse(page?.pageContent);

    const newContentState = convertFromRaw({ blocks: convertedBlocks, entityMap: {} });

    dispatch(updateDocs({
      editorState: EditorState.push(
        EditorState.createEmpty(),
        newContentState,
      ),
      selectedPage: page,
      title: page?.title,
    }));
  }

  function handleCreate(name, handleClose) {
    if (!name || !name?.length) {
      return;
    }

    dispatch(createNewDocProject({ projectName: name }));
    handleClose();
  }

  function showListTreeOfDocProjects(project) {

    return <DocsProjectUI
      project={project}
      pages={project?.pages}
      onClickPage={onClickPage}
      onClickProject={onClickProject}
    />;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginBottom: '50px' }}>
        <Tooltip title='Back to home'>
          <IconButton
            style={{
              width: '15px',
              height: '15px',
              marginTop: '15px',
            }}
            onClick={() => backToHome()}
          >
            <ArrowBackIosIcon
              style={{
                width: '15px',
                height: '15px',
                marginLeft: '5px',
              }}
            />
          </IconButton>
        </Tooltip>
        <div className='docs-drawer--icon-layout'>
          <HomeIcon color='secondary'/>
        </div>
      </div>
      <List component='div'>
        {docProjects.map(showListTreeOfDocProjects)}

      </List>
      <CreateNewProjectDialog loading={loading} handleCreate={handleCreate}/>
    </>
  );
};

export default DocsTreeView;
