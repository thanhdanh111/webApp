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
import DocsDrawerProjectUI from './docs_drawer_project_item';

const DocsTreeView = () => {
  const dispatch = useDispatch();
  const {
    docProjects,
    shouldCallApi,
    loading,
    selectedDocProject,
    selectedPage,
  }: DocsValueType = useSelector((state: RootState) => state?.docs);
  const router = useRouter();

  useEffect(() => {
    if (!shouldCallApi) {

      return;
    }

    dispatch(getDocProjects());
    dispatch(updateDocs({ shouldCallApi: false }));
  }, [shouldCallApi]);

  function backToHome() {

    void router.push('/home');
  }

  function onClickProject(project) {
    dispatch(updateDocs({
      selectedDocProject: project,
      selectedPage: {},
      editorState: EditorState.createEmpty(),
      title: '',
    }));
  }

  function onClickPage(props) {
    const convertedBlocks = JSON.parse(props?.page?.pageContent);

    const newContentState = convertFromRaw({ blocks: convertedBlocks, entityMap: {} });

    dispatch(updateDocs({
      editorState: EditorState.push(
        EditorState.createEmpty(),
        newContentState,
      ),
      selectedDocProject: props?.project,
      selectedPage: props?.page,
      title: props?.page?.title,
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
    const onSelectedProject = !selectedPage?._id && selectedDocProject?._id === project?._id;

    return <DocsDrawerProjectUI
      key={project?._id}
      project={project}
      pages={project?.pages}
      onClickPage={onClickPage}
      onClickProject={onClickProject}
      selected={onSelectedProject}
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
      <List component='nav'>
        {docProjects.map(showListTreeOfDocProjects)}
      </List>
      <CreateNewProjectDialog loading={loading} handleCreate={handleCreate}/>
    </>
  );
};

export default DocsTreeView;
