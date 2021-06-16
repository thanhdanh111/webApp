import React, { useEffect } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createNewDocProject, getDocProjects } from '../logic/docs_apis';
import { RootState } from 'redux/reducers_registration';
import { updateDocs } from '../logic/docs_actions';
import { convertFromRaw, EditorState } from 'draft-js';
import CreateNewProjectDialog from './docs_new_project';
import { Tooltip, IconButton, List } from '@material-ui/core';
import DocsDrawerProjectUI from './docs_drawer_project_item';

const DocsDrawer = () => {
  const dispatch = useDispatch();
  const ownComponentState = useSelector((state: RootState) => {

    return {
      docProjects: state?.docs?.docProjects,
      loading: state?.docs?.loading,
      selectedDocProject: state?.docs?.selectedDocProject,
      selectedPage: state?.docs?.selectedPage,
      companyID: state?.auth?.extendedCompany?.companyID?._id,
    };
  }, shallowEqual);
  const router = useRouter();

  useEffect(() => {
    dispatch(getDocProjects({ companyID: ownComponentState?.companyID }));
  }, [ownComponentState?.companyID]);

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
    const onSelectedProject = !ownComponentState?.selectedPage?._id &&
      ownComponentState?.selectedDocProject?._id === project?._id;

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
      <div className='docs-drawer-back-home-layout'>
        <Tooltip title='Back to home'>
          <IconButton className='arrow-back-home' onClick={() => backToHome()}>
            <ArrowBackIosIcon style={{ marginLeft: '5px', width: '15px', height: '15px' }} />
          </IconButton>
        </Tooltip>
        <div className='docs-drawer--icon-layout'>
          <HomeIcon color='secondary'/>
        </div>
      </div>
      <List component='nav'>
        {ownComponentState?.docProjects.map(showListTreeOfDocProjects)}
      </List>
      <CreateNewProjectDialog loading={ownComponentState?.loading} handleCreate={handleCreate}/>
    </>
  );
};

export default DocsDrawer;
