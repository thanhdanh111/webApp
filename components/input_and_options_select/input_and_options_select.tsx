import { FunctionComponent, useState, useEffect } from 'react'
import { NativeSelect, InputBase, FormControl, IconButton, InputLabel } from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

interface DefaultValues {
  departmentID?: string
  role?: string
  email?: string
}

interface InputAndOptionsSelect {
  index: number
  defaultValues: DefaultValues
  firstOptions: JSX.Element[]
  secondOptions: JSX.Element[]
  firstFormName: string
  secondFormName: string
  thirdFormName: string
  handleFillingInfo: (event, index) => void
  onClickCrossButton: (index) => void
  firstInputLabel?: string
  secondInputLabel?: string
  thirdInputLabel?: string
  disableButton?: boolean
  layoutClassName?: string
}

type InputAndOptionsSelectType = InputAndOptionsSelect

export const InputAndOptionsSelect: FunctionComponent<InputAndOptionsSelectType> = ({
  index,
  defaultValues,
  firstOptions,
  secondOptions,
  firstFormName,
  secondFormName,
  thirdFormName,
  handleFillingInfo,
  onClickCrossButton,
  firstInputLabel,
  secondInputLabel,
  thirdInputLabel,
  disableButton = false,
  layoutClassName,
}) => {
  const [values, setValues] = useState(defaultValues)

  useEffect(() => {

    setValues(defaultValues)
  }, [defaultValues])

  function handleOnChange(event) {
    const fieldName = event?.target?.name
    const value = event?.target?.value
    if (value === undefined || !fieldName) {

      return
    }

    handleFillingInfo(event, index)
    setValues({
      ...values,
      [fieldName]: value,
    })
  }

  return (
    <div className={`input-and-options-content ${layoutClassName}`}>
      <FormControl className='form-control form-control--email'>
        { firstInputLabel &&
          <InputLabel
            shrink={true}
            htmlFor='email-input'
            className='input-and-options-content--input-label'
          >
            {firstInputLabel}
          </InputLabel>
        }
        <InputBase
          name={firstFormName}
          onChange={(event) => handleOnChange(event)}
          className='sub-input-base'
          type='email'
          value={values?.[firstFormName]}
          placeholder='email@domain.com'
        />
      </FormControl>

      <FormControl className='form-control'>
        { secondInputLabel &&
          <InputLabel
            htmlFor='role-select'
            className='input-and-options-content--input-label'
          >
            {secondInputLabel}
          </InputLabel>
        }

        <NativeSelect
          name={secondFormName}
          key={`${secondFormName}-${index}`}
          value={values?.[secondFormName]}
          onChange={(event) => handleOnChange(event)}
          inputProps={{ 'aria-label': `${secondFormName}-input-${index}` }}
          input={<InputBase className='sub-input-base' />}
        >
          {firstOptions}
        </NativeSelect>
      </FormControl>

      <FormControl className='form-control'>
        { thirdInputLabel &&
          <InputLabel
            shrink={true}
            htmlFor='department-select'
            className='input-and-options-content--input-label'
          >
            {thirdInputLabel}
          </InputLabel>
        }

        <NativeSelect
          name={thirdFormName}
          key={`${thirdFormName}-${index}`}
          value={values?.[thirdFormName]}
          onChange={(event) => handleOnChange(event)}
          inputProps={{ 'aria-label': `${thirdFormName}-input-${index}` }}
          input={<InputBase className='sub-input-base'/>}
        >
          {secondOptions}
        </NativeSelect>
      </FormControl>

      <IconButton
        disabled={disableButton}
        disableRipple
        disableFocusRipple
        key={`remove-icon-${index}`}
        className={disableButton ? 'remove-icon-disable' : 'remove-icon'}
        onClick={() => onClickCrossButton(index)}
      >
        <HighlightOffIcon />
      </IconButton>
    </div>)
}
