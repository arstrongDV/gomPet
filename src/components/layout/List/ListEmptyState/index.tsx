import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Icon, Loader, Tooltip } from 'components';

import { IconNames } from 'src/assets/icons';

import style from './ListEmptyState.module.scss';

type TooltipIconProps = {
  icon: IconNames;
  tooltip?: string;
};

const TooltipIcon = ({ icon, tooltip }: TooltipIconProps) => {
  if (!tooltip)
    return (
      <Icon
        name={icon}
        className={style.icon}
        currentColor
      />
    );

  return (
    <Tooltip content={tooltip}>
      <Icon
        name={icon}
        className={style.icon}
        currentColor
      />
    </Tooltip>
  );
};

type ListEmptyStateProps = {
  className?: string;
  text?: string | null;
  search?: string;
  icon?: IconNames;
  tooltip?: string;
  isLoading?: boolean;
  visible?: boolean;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
};

const ListEmptyState = (props: ListEmptyStateProps) => {
  const { className, visible, text, search = '', icon, isLoading, direction = 'row', tooltip } = props;
  const t = useTranslations();

  const classes = classNames(style.empty, className);

  if (!visible && !isLoading) return null;

  return (
    <div
      className={classes}
      key={'empty-state'}
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <div
          className={style.text}
          style={{ flexDirection: direction }}
        >
          {(icon || tooltip) && (
            <TooltipIcon
              icon={icon || 'infoCircle'}
              tooltip={tooltip}
            />
          )}

          {search?.length > 0 && (
            <p className='empty empty--dim'>{t('common.empty.searchResults', { query: search })}</p>
          )}
          {search?.length === 0 && <p className='empty empty--dim'>{text || t('common.empty.default')}</p>}
        </div>
      )}
    </div>
  );
};

export default ListEmptyState;
