'use client';

import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

// import SimpleReactValidator from 'simple-react-validator';
import { VisibilityButton } from 'components';

import InputWrapper, { getWrapperProps, InnerWrapperProps } from '../InputWrapper';

import style from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InnerWrapperProps {
  label?: string;
  hideLabel?: boolean;
  description?: string;
  className?: string;
  //validator?: SimpleReactValidator;
  rule?: string;
  value?: number | string;
  onChangeText?: (value: string) => void;
  icon?: 'email' | 'lock' | 'edit' | 'user' | 'zl';
  style?: React.CSSProperties;
  wrapperStyle?: string;
  type?: string;
  showError?: boolean;
  transparentBg?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const wrapperProps = getWrapperProps(props);
  const {
    onChangeText,
    placeholder,
    className,
    id,
    icon,
    type = 'text',
    onClick,
    readOnly,
    disabled,
    showError,
    transparentBg,
    ...rest
  } = props;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const onChangeProxy = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const otherProps = _.omit(rest, ['wrapperStyle', 'hideLabel', 'onClick']);
  const wrapperClasses = icon ? classNames(style.inputWrapper, style[`inputWrapper__${icon}`]) : '';
  const inputClasses = classNames(style.input, className, {
    [style.error]: wrapperProps.hasError || showError,
    [style.readOnlyInput]: readOnly,
    [style.passwordInput]: type === 'password',
    [style.transparentBg]: transparentBg
  });

  const input = (
    <div
      className={wrapperClasses}
      onClick={onClick}
    >
      <input
        id={id}
        ref={ref}
        className={inputClasses}
        placeholder={placeholder}
        onChange={onChangeProxy}
        type={type === 'password' ? (isVisible ? 'text' : 'password') : type}
        disabled={disabled || readOnly}
        {...otherProps}
      />
    </div>
  );

  return (
    <InputWrapper {...wrapperProps}>
      {type === 'password' ? (
        <div className={style.passwordWrapper}>
          {input}
          <VisibilityButton
            isVisible={isVisible}
            onChange={setIsVisible}
          />
        </div>
      ) : (
        input
      )}
    </InputWrapper>
  );
});

export default Input;
