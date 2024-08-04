import classNames from 'classnames';

import { Icon } from 'components';

import style from './Loader.module.scss';

type LoaderProps = {
  classNameIcon?: string;
  global?: boolean;
  contentIndicator?: boolean;
  prefix?: string;
  center?: boolean;
};

const Loader = (props: LoaderProps) => {
  const { contentIndicator, global, classNameIcon, prefix } = props;

  const classes = classNames(style.loader, {
    [style.contentIndicator]: contentIndicator,
    [style.global]: global
  });

  return (
    <div
      className={classes}
      data-testid='loader'
    >
      {!!prefix && prefix}
      <Icon
        className={classNameIcon}
        name='loader'
      />
    </div>
  );
};

export default Loader;
