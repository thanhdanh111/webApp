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
        {
          docProjects.map((project, index) => {
            return <TreeItem
              key={project?._id}
              className='doc-project-item'
              nodeId={project?._id ?? `doc-project-item-${index}`}
              label={project?.title}
            />;
          })
        }
      </TreeView>
    </>
  );
};

export default DocsTreeView;
