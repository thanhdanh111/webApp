import { FunctionComponent } from 'react'
import { InputBase, FormControl, InputLabel, Select } from '@material-ui/core'

export enum SelectVariant {
  outlined = 'outlined',
  standard = 'standard',
  filled = 'filled',
}

export enum SelectColor {
  secondary = 'secondary',
  primary = 'primary',
}

interface OptionsSelect {
  index?: number
  defaultValue?: string
  options: JSX.Element[]
  formName: string
  handleFillingInfo: ({ event }) => void
  inputLabel?: string
  disabled?: boolean
  htmlFor?: string
  variant?: SelectVariant
  color?: SelectColor
  shouldNeedInputBase?: boolean
}

type OptionsSelectType = OptionsSelect

export const OptionsSelect: FunctionComponent<OptionsSelectType> = ({
  defaultValue,
  options,
  formName,
  handleFillingInfo,
  inputLabel,
  disabled = false,
  htmlFor,
  variant,
  color,
  shouldNeedInputBase = false,
}) => {

  return (
    <FormControl key={`${formName}-${inputLabel}`} variant={variant} className={`form-control ${formName}`}>
    { inputLabel &&
      <InputLabel
        htmlFor={htmlFor}
        className='input-and-options-content--input-label'
      >
        {inputLabel}
      </InputLabel>
    }

    <Select
      disabled={disabled}
      native
      name={formName}
      color={color}
      key={formName}
      defaultValue={defaultValue}
      label={formName}
      onChange={(event) => handleFillingInfo({ event })}
      inputProps={{
        id: htmlFor,
        name: formName,
      }}
      input={shouldNeedInputBase ? <InputBase className='sub-input-base' /> : undefined}
    >
      {options}
    </Select>
  </FormControl>
  )
}
