import React from 'react';
import classNames from 'classnames';

import { IconNames } from 'src/assets/icons';

import ListEmptyState from './ListEmptyState';

import style from './List.module.scss';

type ListProps = {
  className?: string;
  emptyText?: string | null;
  emptyIcon?: IconNames;
  isLoading?: boolean;
  search?: string;
  children: React.ReactNode;
  ref?: any;
  isEmpty?: boolean;
};

const List = (props: ListProps) => {
  const { className, emptyText, emptyIcon, isLoading, search, children, ref, isEmpty } = props;

  return (
    <ul ref={ref} className={classNames(style.list, className)}>
      <ListEmptyState
        key={'empty-state'}
        visible={isLoading || isEmpty || !children || React.Children.count(children) === 0}
        isLoading={isLoading}
        icon={emptyIcon}
        text={emptyText}
        search={search}
      />

      {!isLoading && children}
    </ul>
  );
};

export default List;
