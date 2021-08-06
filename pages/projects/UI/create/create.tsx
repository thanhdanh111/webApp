import SelectOption from '@components/option_select/option_select'
import PrimaryButtonUI from '@components/primary_button/primary_button'
import { Box, TextareaAutosize, TextField } from '@material-ui/core'
import { ProjectsPage } from 'helpers/type'
import { useRouter } from 'next/router'
import { createProjectMiddleWare, getExtendedCompaniesMiddleWare } from 'pages/projects/logic/projects_reducer'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'

const CreateProject: FunctionComponent = () => {

  const dispatch = useDispatch()
  const {
    channels,
  }: ProjectsPage = useSelector((state: RootState) => state.projects)

  const [name, setName] = useState('')
  const [channelID, setChannel] = useState('')
  const [description, setDescription] = useState('')
  const [validFields, setValidFields] = useState({ name: true, channelID: true })
  const router = useRouter()

  useEffect(() => {
    void fetchData()
  }, [])

  const fetchData = () => {
    dispatch(getExtendedCompaniesMiddleWare())
  }

  const changeChannelID = (event) => {
    if (event.target.value === channelID) {

      return
    }
    setValidFields({ ...validFields, channelID: true })

    setChannel(event.target.value)
  }

  const onChangeNameProject = (event) => {
    setValidFields({ ...validFields, name: true })
    setName(event.target.value)

  }

  const onChangeDescription = (event) => {
    setDescription(event.target.value)
  }

  function createProjectBtn() {
    if (!name.trim() || !channelID){
      setValidFields({ name : !!name.trim(), channelID: !!channelID })

      return
    }

    dispatch(createProjectMiddleWare(name.trim(), channelID, description, router))
  }

  return (
    <Box className='create-project'>
      <h1 className='text-create-projects'>Create a new Project</h1>
      <div className='create-project-form'>
        <div className='create-project-form-grid'>
          <div className='create-project-form-card-item'>
            <div className='form-all'>
              <div className='project-name-input'>
                <img src='../../input.svg' className='img'/>
                <TextField
                  placeholder='Project name'
                  className='input-label-text'
                  error={!validFields.name}
                  value={name}
                  onChange={onChangeNameProject}
                  label='Project name'
                />
              </div>
            </div>
            <div className='form-all'>
              <div className='project-name-input'>
                <div className='form-select'>
                  <SelectOption
                    list={channels}
                    value={channelID}
                    required={!validFields.channelID}
                    handleChange={changeChannelID}
                    style='border'
                    label='Select Channel'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='des'>
          <div className='project-des-input'>
            <TextareaAutosize
              color='secondary'
              placeholder='Description'
              className='input-text'
              value={description}
              onChange={onChangeDescription}
              aria-label='description'
              rows={3}
            />
          </div>
        </div>
        <div className='btn'>
          <PrimaryButtonUI
            handleClick={() => createProjectBtn()}
            title='Create Project'
          />
        </div>
      </div>
    </Box>
  )
}

export default CreateProject
