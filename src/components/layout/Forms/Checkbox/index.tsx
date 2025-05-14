import React, { forwardRef } from 'react';
import classNames from 'classnames';

// import SimpleReactValidator from 'simple-react-validator';
import { Icon } from 'components';

import InputWrapper, { InnerWrapperProps } from '../InputWrapper';

import style from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'label'>, InnerWrapperProps {
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  // validator?: SimpleReactValidator;
  rule?: string;
  onChangeChecked?: (checked: boolean) => void;
  checked?: boolean;
  wrapperStyle?: string;
  showErrorBorder?: boolean;
  smallLabel?: boolean;
  reverse?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, forwardedRef) => {
  const {
    required = false,
    disabled = false,
    reverse = false,
    className,
    label,
    name,
    onChangeChecked,
    validator,
    rule,
    checked,
    wrapperStyle,
    id,
    showErrorBorder,
    smallLabel,
    ...rest
  } = props;

  let errorMessage;

  if (id && validator && rule) {
    errorMessage = validator.message(id, checked, rule);
  }

  const onChangeProxy = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeChecked) {
      onChangeChecked(e.target.checked);
    }
  };

  const classes = classNames(style.checkbox, {
    [style.checkbox__error]: errorMessage || showErrorBorder
  });

  const labelElement = (
    <label htmlFor={id}>
      <div className={classNames(style.label, { [style.small]: smallLabel })}>
        {label} 
        {required && <span className={style.star}> * </span>}
      </div>
    </label>
  );

  return (
    <InputWrapper
      wrapperStyle={wrapperStyle}
      checked={checked}
      validator={validator}
      rule={rule}
      errorMessage={errorMessage}
    >
      <div
        className={classNames(style.checkboxContainer, className, {
          [style.disabled]: disabled
        })}
      >
        {reverse && labelElement}
        <div className={style.checkboxWrapper}>
          <input
            ref={forwardedRef}
            className={classNames(style.checkbox, classes)}
            type={'checkbox'}
            id={id}
            name={name}
            onChange={onChangeProxy}
            disabled={disabled}
            checked={checked}
            required={required}
            {...rest}
          />
          <Icon
            name={'pawFilled'}
            className={classNames(style.icon, { [style.checked]: checked })}
          />
        </div>
        {!reverse && labelElement}
      </div>
    </InputWrapper>
  );
});

export default Checkbox;
