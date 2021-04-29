import { FunctionComponent } from 'react';
import { NativeSelect, InputBase, FormControl, InputLabel } from '@material-ui/core';

interface OptionsSelect {
  index?: number;
  defaultValue?: string ;
  options: JSX.Element[];
  formName: string;
  handleFillingInfo: ({ event }) => void;
  inputLabel?: string;
  disabled?: boolean;
}

type OptionsSelectType = OptionsSelect;

export const OptionsSelect: FunctionComponent<OptionsSelectType> = ({
  defaultValue,
  options,
  formName,
  handleFillingInfo,
  inputLabel,
  disabled = false,
}) => {

  return (
    <FormControl key={`${formName}-${inputLabel}`} className={`form-control ${formName}`}>
    { inputLabel &&
      <InputLabel
        htmlFor='role-select'
        className='input-and-options-content--input-label'
      >
        {inputLabel}
      </InputLabel>
    }

    <NativeSelect
      disabled={disabled}
      name={formName}
      key={formName}
      defaultValue={defaultValue}
      onChange={(event) => handleFillingInfo({ event })}
      inputProps={{ 'aria-label': `${formName}-input` }}
      input={<InputBase className='sub-input-base' />}
    >
      {options}
    </NativeSelect>
  </FormControl>
  );
};
