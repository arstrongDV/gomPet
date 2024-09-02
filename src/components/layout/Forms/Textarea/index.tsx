import React, { Dispatch, SetStateAction } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

// import SimpleReactValidator from 'simple-react-validator';
import InputWrapper, { getWrapperProps, InnerWrapperProps } from '../InputWrapper';

import style from './Textarea.module.scss';

interface TextareaProps extends InnerWrapperProps {
  id?: string;
  className?: string;
  placeholder?: string | null;
  maxLength?: number;
  value?: string;
  name?: string;
  onChangeText?: Dispatch<SetStateAction<string>>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  isCounting?: boolean;
  // validator?: SimpleReactValidator;
  rule?: string;
  label?: string;
  hideLabel?: boolean;
  wrapperStyle?: string;
  altStyle?: boolean;
}

const Textarea = (props: TextareaProps) => {
  const wrapperProps = getWrapperProps(props);
  const {
    className,
    maxLength = 1000,
    placeholder,
    value,
    onChangeText,
    onBlur,
    isCounting = false,
    rule,
    label,
    hideLabel,
    wrapperStyle,
    id,
    name,
    altStyle = false,
    ...rest
  } = props;

  const onChangeProxy = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const classes = classNames(style.textarea, className, {
    [style.error]: wrapperProps.hasError,
    [style.alt]: altStyle
  });

  return (
    <InputWrapper
      rule={rule}
      errorMessage={wrapperProps.errorMessage}
      label={label}
      id={id}
      hideLabel={hideLabel}
      wrapperStyle={wrapperStyle}
    >
      <div className={style.wrapperArea}>
        <TextareaAutosize
          className={classes}
          placeholder={placeholder || ''}
          maxLength={maxLength}
          value={value}
          onChange={onChangeProxy}
          onBlur={onBlur}
          name={name}
          {...rest}
        />
        {isCounting && (
          <p className={style.counter}>
            {value?.length} / {maxLength}
          </p>
        )}
      </div>
    </InputWrapper>
  );
};

export default Textarea;
