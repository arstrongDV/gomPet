/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { Dispatch, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
const ReactSelect = dynamic(() => import('react-select'), { ssr: false });

import { Loader } from 'components';
import InputWrapper, { getWrapperProps, InnerWrapperProps } from 'components/layout/Forms/InputWrapper';

import { selectStyles } from './styles';

export type OptionType = {
  label: string;
  value: string | number;
} | null;

interface SelectProps extends InnerWrapperProps {
  options: any;
  value: OptionType;
  onChange: Dispatch<SetStateAction<OptionType>> | ((value: OptionType) => void);
  wrapperStyle?: string;
  noOptionsMessage?: string;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  defaultFirstValue?: boolean;
  isSearchable?: boolean;
  icon?: string;
  closeMenuOnSelect?: boolean;
  showValue?: boolean;
  isClearable?: boolean;
}

const Select = (props: SelectProps) => {
  const t = useTranslations();

  const {
    wrapperStyle,
    noOptionsMessage = 'Brak wyników',
    isLoading,
    placeholder = 'Wybierz...',
    options,
    isSearchable = false,
    value,
    onChange,
    showValue = true,
    closeMenuOnSelect = true,
    isClearable = false
  } = props;
  const wrapperProps = getWrapperProps(props);

  return (
    <InputWrapper {...wrapperProps}>
      <div className={wrapperStyle}>
        <ReactSelect
          placeholder={placeholder}
          menuPlacement={'auto'}
          onChange={onChange as any}
          styles={selectStyles(!!wrapperProps.errorMessage)}
          loadingMessage={() => <Loader center />}
          noOptionsMessage={() => (isLoading ? <Loader center /> : noOptionsMessage)}
          options={options}
          value={value}
          controlShouldRenderValue={showValue}
          isSearchable={isSearchable}
          closeMenuOnSelect={closeMenuOnSelect}
          isClearable={isClearable}
        />
      </div>
    </InputWrapper>
  );
};

export default Select;
