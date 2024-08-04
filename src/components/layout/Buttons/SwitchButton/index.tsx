'use client';

import React from 'react';
import classnames from 'classnames';

import style from './SwitchButton.module.scss';

interface SwitchButtonProps {
  value: boolean;
  setValue?: (value: boolean) => void;
  onClick?: (value?: boolean) => void;
  reverse?: boolean;
  wrapperStyle?: string;
  label?: string;
  themeColors?: boolean;
}

const SwitchButton = (props: SwitchButtonProps) => {
  const { value = true, setValue, onClick, reverse, wrapperStyle, label, themeColors = true, ...rest } = props;

  const handleChange = () => {
    if (setValue) setValue(!value);
    if (onClick) onClick(value);
  };

  const wrapperClasses = classnames(wrapperStyle, {
    [style.withLabel]: !!label,
    [style.reverse]: reverse
  });

  return (
    <div className={wrapperClasses}>
      {!!label && <label>{label}</label>}
      <button
        onClick={handleChange}
        className={classnames(style.container, {
          [style.off]: !value,
          [style.themeColors]: themeColors
        })}
        {...rest}
      >
        <span className={classnames(style.switch, { [style.off]: !value, [style.themeColors]: themeColors })} />
      </button>
    </div>
  );
};

export default SwitchButton;
