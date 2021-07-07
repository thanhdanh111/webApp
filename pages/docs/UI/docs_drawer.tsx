import React, { useEffect } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createNewDocProject, getDocProjects, getFolderAccessOfProjectIDs, getUsersInCompanyApi } from '../logic/docs_apis';
import { RootState } from 'redux/reducers_registration';
import { updateDocsInDrawer } from '../logic/docs_actions';
import { convertFromRaw, EditorState, CompositeDecorator } from 'draft-js';
import CreateNewProjectDialog from './docs_new_project';
import { Tooltip, IconButton, List } from '@material-ui/core';
import DocsDrawerProjectUI from './docs_drawer_project_item';
import { docsLinkDecorator } from 'pages/docs/UI/decorator_link';
import { DocProject, DocProjectMap, PageContent } from '../logic/docs_reducer';
import { docsImageDecorator } from './decorator_image';

interface DocsDrawerData {
  docProjectsMap: DocProjectMap;
  loading: boolean;
  selectedDocProject: DocProject;
  selectedPage: PageContent;
}

type DocsDrawerDataType = DocsDrawerData;

const DocsDrawer = () => {
  const dispatch = useDispatch();
  const {
    docProjectsMap,
    loading,
    selectedDocProject,
    selectedPage,
  }: DocsDrawerDataType = useSelector((state: RootState) => {

    return {
      docProjectsMap: state?.docs?.docProjectsMap,
      loading: state?.docs?.loading,
      selectedDocProject: state?.docs?.selectedDocProject,
      selectedPage: state?.docs?.selectedPage,
    };
  }, shallowEqual);
  const router = useRouter();

  useEffect(() => {
    void initData();
  }, []);

  async function initData() {
    await Promise.resolve(dispatch(getDocProjects()));
    dispatch(getFolderAccessOfProjectIDs());
    dispatch(getUsersInCompanyApi());
  }

  function backToHome() {

    void router.push('/home');
  }

  function onClickProject(project) {
    const decorator = new CompositeDecorator([
      docsLinkDecorator,
      docsImageDecorator,
    ]);

    dispatch(updateDocsInDrawer({
      selectedDocProject: project,
      selectedPage: {},
      editorState: EditorState.createEmpty(decorator),
      title: '',
      needDisplay: false,
    }));
  }

  function onClickPage(props) {
    const convertedBlocks = JSON.parse(props?.page?.pageContent);
    const convertedEntityMap = JSON.parse(props?.page?.entityMap);
    const newContentState = convertFromRaw({ blocks: convertedBlocks, entityMap: convertedEntityMap });
    const decorator = new CompositeDecorator([
      docsLinkDecorator,
      docsImageDecorator,
    ]);

    dispatch(updateDocsInDrawer({
      editorState: EditorState.createWithContent(
        newContentState,
        decorator,
      ),
      selectedDocProject: props?.project,
      selectedPage: props?.page,
      title: props?.page?.title,
      needDisplay: false,
    }));
  }

  function handleCreate(name, handleClose) {
    if (!name || !name?.length) {
      return;
    }

    dispatch(createNewDocProject({ projectName: name }));
    handleClose();
  }

  function showListTreeOfDocProjects() {
    const projects = Object.values(docProjectsMap);
    const listTreeOfDocProjects: JSX.Element[] = projects?.map((project) => {

      const onSelectedProject = !selectedPage?._id &&
        selectedDocProject?._id === project?._id;

      return <DocsDrawerProjectUI
        key={project?._id}
        project={project}
        pages={project?.pages ?? {}}
        onClickPage={onClickPage}
        onClickProject={onClickProject}
        selected={onSelectedProject}
      />;
    });

    return listTreeOfDocProjects;
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
        {showListTreeOfDocProjects()}
      </List>
      <CreateNewProjectDialog loading={loading} handleCreate={handleCreate}/>
    </>
  );
};

export default React.memo(DocsDrawer, () => true);
