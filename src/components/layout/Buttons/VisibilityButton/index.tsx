import React from 'react';

import { Icon } from 'components';

import style from './VisibilityButton.module.scss';

type VisibilityButtonProps = {
  isVisible: boolean;
  onChange: (visibility: boolean) => void;
};

const VisibilityButton = (props: VisibilityButtonProps) => {
  const { isVisible, onChange } = props;

  const onClick = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(!isVisible);
  };

  return (
    <button
      type='button'
      onClick={onClick}
      className={style.visibilityButton}
    >
      {isVisible ? (
        <Icon
          name='eye'
          noPointerEvents
        />
      ) : (
        <Icon
          name='eyeOff'
          noPointerEvents
        />
      )}
    </button>
  );
};

export default VisibilityButton;
