import React, { useEffect } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getDocProjects } from '../logic/docs_apis';
import { RootState } from 'redux/reducers_registration';
import { DocsValueType } from '../logic/docs_reducer';
import { updateDocs } from '../logic/docs_actions';
import { convertFromRaw, EditorState } from 'draft-js';

const DocsTreeView = () => {
  const dispatch = useDispatch();
  const { docProjects }: DocsValueType = useSelector((state: RootState) => state.docs);
  const router = useRouter();

  useEffect(() => {
    dispatch(getDocProjects());
  }, []);

  async function backToHome() {

    await router.push('/home');
  }

  function onClickProject(project) {
    dispatch(updateDocs({ selectedDocProject: project }));
  }

  function onClickPage(page) {
    const convertedBlocks = JSON.parse(page?.pageContent)?.map((block) => {
      return { ...block, data: {} };
    });

    const newContentState = convertFromRaw({ blocks: convertedBlocks, entityMap: {} });

    dispatch(updateDocs({
      editorState: EditorState.push(
        EditorState.createEmpty(),
        newContentState,
      ),
      title: page?.title,
    }));
  }

  function showListTreeOfDocProjects(project, index) {
    let treeItemPages = null;

    if (typeof project?.pages !== 'string' && project?.pages?.length) {
      treeItemPages = project?.pages?.map((page) =>
        <TreeItem
          key={page?._id}
          onClick={() => onClickPage(page)}
          className='doc-project-item'
          nodeId={page?._id ?? `doc-project-item-${index}`}
          label={page?.title}
        />,
      );
    }

    return <TreeItem
      key={project?._id}
      onClick={() => onClickProject(project)}
      className='doc-project-item'
      nodeId={project?._id ?? `doc-project-item-${index}`}
      label={project?.title}
    >
      {treeItemPages}
    </TreeItem>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', marginBottom: '50px' }}>
        <ArrowBackIosIcon onClick={backToHome} style={{ width: '15px', height: '15px' }}  />
        <HomeIcon style={{ width: '25px', height: '25px' }} color='secondary'/>
      </div>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
      >
        {docProjects.map(showListTreeOfDocProjects)}
      </TreeView>
    </>
  );
};

export default DocsTreeView;
