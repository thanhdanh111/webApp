import { FormControl, Grid, Input, MenuItem, Select } from '@material-ui/core';
import React from 'react';

const CreateProject = () => {

  return (
    <div className='create-project'>
      <h1 className='text-create-projects'>Create a new Project</h1>
      <h1 className='text-create-projects'>Give your project a name</h1>
      <div className='create-project-form'>
        <Grid className='create-project-form-grid' container>
          <Grid item xs={12} sm={3} className='create-project-form-card-item'>
            <div className='form-all'>
              <div className='form-label'>
                Project name
              </div>
              <div className='project-name-input'>
                <img src='../../input.svg' className='img'/>
                <Input type='text' name='new-name-project' placeholder='Project name' className='input-label-text'/>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid className='create-project-form-grid' container>
          <Grid item xs={12} sm={3} className='create-project-form-card-item'>
            <div className='form-all'>
              <div className='form-label'>
                Team
              </div>
              <div className='project-name-input'>
                <div className='form-select'>
                  <FormControl className='form-control'>
                    <Select
                      value='Select Team'
                      // onChange={handleChange}
                      className='select-empty'
                    >
                      <MenuItem value='all users'>Name Team</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid className='create-project-form-grid' container>
          <Grid item xs={12} sm={3} className='create-project-form-card-item'>
            <div className='form-all'>
              <button className='btn-create' >
                Create Project
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CreateProject;
