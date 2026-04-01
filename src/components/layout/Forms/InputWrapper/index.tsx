import React from 'react';
import classNames from 'classnames';
import { Moment } from 'moment';

// import SimpleReactValidator from 'simple-react-validator';
import style from './InputWrapper.module.scss';

export type InputWrapperProps = {
  label?: string;
  hideLabel?: boolean;
  value?: string | number | object | null;
  date?: Moment | null;
  description?: string;
  validator?: any; //SimpleReactValidator;
  rule?: string;
  wrapperStyle?: string;
  checked?: boolean;
  id?: string;
};

export interface InnerWrapperProps {
  id?: string;
  label?: React.ReactNode;
  hideLabel?: boolean;
  description?: string;
  date?: Moment | null;
  children?: React.ReactNode;
  validator?: any; //SimpleReactValidator;
  rule?: string;
  wrapperStyle?: string;
  errorMessage?: string;
  checked?: boolean;
}

const InputWrapper = ({
  id,
  label,
  description,
  children,
  wrapperStyle,
  hideLabel = false,
  errorMessage,
  rule
}: InnerWrapperProps) => {
  return (
    <div className={wrapperStyle}>
      {label && (
        <div className={style.wrapper}>
          <label
            htmlFor={id}
            className={classNames({
              [style.label]: !hideLabel,
              [style.visuallyHidden]: hideLabel
            })}
          >
            {label}
            {rule?.includes('required') && !hideLabel && <span className={style.required}>&nbsp;*</span>}
          </label>
        </div>
      )}
      {description && <p className={style.descriptionField}>{description}</p>}
      {children}
      {errorMessage && <div className={style.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export const getWrapperProps = (props: InputWrapperProps) => {
  const { id, validator, rule, value, checked, date } = props;

  let errorMessage;
  if (validator && rule) {
    errorMessage = validator.message(id || '', value || checked || date, rule);
  }

  return {
    id: props.id,
    label: props.label,
    hideLabel: props.hideLabel,
    description: props.description,
    validator: props.validator,
    rule: props.rule,
    wrapperStyle: props.wrapperStyle,
    errorMessage: errorMessage,
    hasError: !!errorMessage
  };
};

export default InputWrapper;
