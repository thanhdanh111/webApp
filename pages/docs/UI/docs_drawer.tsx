import React, { useEffect } from 'react'
import HomeIcon from '@material-ui/icons/Home'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useRouter } from 'next/router'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { createNewDocProject, getDocProjects, getFolderAccessOfProjectIDs, getUsersInCompanyApi } from '../logic/docs_apis'
import { RootState } from 'redux/reducers_registration'
import { updateSelectedItemInDrawer } from '../logic/docs_actions'
import CreateNewProjectDialog from './docs_new_project'
import { Tooltip, IconButton, List } from '@material-ui/core'
import DocsDrawerProjectUI from './docs_drawer_project_item'
import { DocProject, DocProjectMap, PageContent } from '../logic/docs_reducer'

interface DocsDrawerData {
  docProjectsMap: DocProjectMap
  selectedDocProject: DocProject
  selectedPage: PageContent
}

type DocsDrawerDataType = DocsDrawerData

const DocsDrawer = () => {
  const dispatch = useDispatch()
  const {
    docProjectsMap,
    selectedDocProject,
    selectedPage,
  }: DocsDrawerDataType = useSelector((state: RootState) => {

    return {
      docProjectsMap: state?.docs?.docProjectsMap,
      drawerLoading: state?.docs?.drawerLoading,
      selectedDocProject: state?.docs?.selectedDocProject,
      selectedPage: state?.docs?.selectedPage,
    }
  }, shallowEqual)
  const router = useRouter()

  useEffect(() => {
    void initData()
  }, [])

  async function initData() {
    await Promise.resolve(dispatch(getDocProjects()))
    dispatch(getFolderAccessOfProjectIDs())
    dispatch(getUsersInCompanyApi())
  }

  function backToHome() {

    void router.push('/home')
  }

  function onClickProject(project) {

    dispatch(updateSelectedItemInDrawer({
      projectID: project?._id,
      displayInlineToolbar: false,
    }))
  }

  function onClickPage(props) {
    if (selectedPage?._id === props?.page?._id) {

      return
    }

    dispatch(updateSelectedItemInDrawer({
      pageID: props?.page?._id,
      projectID: props.project?._id,
      displayInlineToolbar: false,
    }))
  }

  function handleCreate(name, handleClose) {
    if (!name || !name?.length) {
      return
    }

    dispatch(createNewDocProject({ projectName: name }))
    handleClose()
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
        {
          Object.values(docProjectsMap)?.map((project) => {

            const onSelectedProject = !selectedPage?._id &&
              selectedDocProject?._id === project?._id
            const pages = Object.values(project?.pages ?? {}) as PageContent[]
            const pageIDs = Object.keys(project?.pages ?? {})
            const selectedPageInProject = pageIDs?.includes(selectedPage?._id ?? '')
            const pagesLength = pages?.length

            return <DocsDrawerProjectUI
              key={project?._id}
              project={project}
              pagesLength={pagesLength}
              selectedPageInProject={selectedPageInProject}
              pages={pages}
              onClickPage={onClickPage}
              onClickProject={onClickProject}
              selected={onSelectedProject}
              selectedPage={selectedPage}
            />
          })
        }
      </List>
      <CreateNewProjectDialog handleCreate={handleCreate}/>
    </>
  )
}

export default DocsDrawer
