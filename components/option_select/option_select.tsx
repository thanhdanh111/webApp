import React, { FunctionComponent } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

interface ListType {
  _id: string
  name: string
  description?: string
  value?: number
  departmentID?: string
  channelID?: string
  eventExpirationTime?: string
  companyID?: string
}

interface InitialProps {
  iconLabel?: JSX.Element
  list: ListType[]
  style?: string
  handleChange: (e) => void
  value: string | number
  disabled?: boolean
  required?: boolean
  label?: string
}

type SelectOptionType = InitialProps

const SelectOption: FunctionComponent<SelectOptionType> = (props: InitialProps) => {

  const { list, style, iconLabel, handleChange, value, disabled = false, required = false, label  }: InitialProps = props

  return (
    <FormControl className={`select-name-formcontrol ${style}`} variant='standard' color='secondary'>
      {iconLabel}
      { label &&
      <InputLabel
        htmlFor='role-select'
        className='options-content-label'
      >
        {label}
      </InputLabel>

      }
      <Select
        value={value}
        onChange={handleChange}
        className='select-list-user'
        disabled={disabled}
        error={required}
      >
        {Array.isArray(list) && list.map((item, index) => {

          return (
            <MenuItem key={item?._id ?? index} className='item' value={item?.value ?? item._id}>{item?.name ?? item}</MenuItem>
          )
        })}
        <MenuItem className='item' value='All'>All</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SelectOption
