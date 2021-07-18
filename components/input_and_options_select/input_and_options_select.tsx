import { FunctionComponent } from 'react'
import { NativeSelect, InputBase, FormControl, IconButton, InputLabel } from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'

interface InputAndOptionsSelect {
  index: number
  defaultValues: (string | undefined)[]
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
          onChange={(event) => handleFillingInfo(event, index)}
          className='sub-input-base'
          type='email'
          defaultValue={defaultValues[0]}
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
          defaultValue={defaultValues[1]}
          onChange={(event) => handleFillingInfo(event, index)}
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
          defaultValue={defaultValues[2]}
          onChange={(event) => handleFillingInfo(event, index)}
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
        className='remove-icon'
        onClick={() => onClickCrossButton(index)}
      >
        <HighlightOffIcon />
      </IconButton>
    </div>)
}
