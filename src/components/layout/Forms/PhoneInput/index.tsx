'use client';

import React from 'react';
import Input from 'react-phone-number-input';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import InputWrapper, { getWrapperProps, InnerWrapperProps } from '../InputWrapper';

import 'react-phone-number-input/style.css';
import style from './PhoneInput.module.scss';

interface PhoneInputProps extends InnerWrapperProps {
  value: string;
  onChange: (value: any) => void;
  disabled?: boolean;
  placeholder?: string | null;
  name?: string;
  label?: string;
}

const PhoneInput = (props: PhoneInputProps) => {
  const { value, onChange, disabled, ...rest } = props;
  const wrapperProps = getWrapperProps(props);
  const t = useTranslations();

  return (
    <InputWrapper {...wrapperProps}>
      <Input
        addInternationalOption={false}
        value={value}
        onChange={onChange}
        defaultCountry={'PL'}
        placeholder={'Wpisz numer'}
        disabled={disabled}
        limitMaxLength
        countrySelectProps={{
          tabIndex: -1
        }}
        countries={['PL']}
        className={classNames(style.phoneFormatter, {
          [style.error]: wrapperProps.hasError
        })}
        {...rest}
      />
    </InputWrapper>
  );
};

export default PhoneInput;
