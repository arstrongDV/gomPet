import React, { ChangeEventHandler } from 'react';
import classNames from 'classnames';

// import SimpleReactValidator from 'simple-react-validator';
import InputWrapper, { InnerWrapperProps } from '../InputWrapper';

import style from './InputRadio.module.scss';

export interface RadioGroupProps extends InnerWrapperProps {
  value: string;
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  // validator?: SimpleReactValidator;
  id: string;
  rule?: string;
  disabled?: boolean;
  isGroupEmpty?: boolean;
  name?: string;
  showErrorBorder?: boolean;
  smallLabel?: boolean;
  colorDim?: boolean;
  className?: string;
}

const InputRadio = (props: RadioGroupProps) => {
  const {
    value,
    label,
    checked,
    onChange,
    validator,
    rule,
    isGroupEmpty,
    disabled = false,
    id,
    name,
    showErrorBorder,
    smallLabel = true,
    colorDim = true,
    className
  } = props;

  const classes = classNames(
    {
      [style.container]: true,
      [style.disabled]: disabled
    },
    className
  );

  const inputClasses = classNames(style.box, {
    [style.box__error]: isGroupEmpty || showErrorBorder
  });

  return (
    <InputWrapper
      checked={checked}
      validator={validator}
      rule={rule}
    >
      <div className={classes}>
        <input
          className={inputClasses}
          id={id}
          name={name}
          type={'radio'}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <label
          className={classNames(style.label, {
            [style.checked]: checked,
            [style.small]: smallLabel,
            [style.colorDim]: colorDim
          })}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    </InputWrapper>
  );
};

export default InputRadio;
