import React from 'react';
import { useTranslations } from 'next-intl';

import { Icon } from 'components';

import { IconNames } from 'src/assets/icons';
import { OrganizationType } from 'src/constants/types';

import style from './OrganizationTypeName.module.scss';

type OrganizationTypeNameProps = {
  type: OrganizationType;
};

const OrganizationTypeName = ({ type }: OrganizationTypeNameProps) => {
  const t = useTranslations();

  const organizationIcon: { [key: string]: IconNames } = {
    [OrganizationType.ANIMAL_SHELTER]: 'homeHeart',
    [OrganizationType.FUND]: 'shieldHeart',
    [OrganizationType.BREEDING]: 'buildingCottage'
  };

  return (
    <div className={style.type}>
      <Icon
        name={organizationIcon[type]}
        gray
      />
      <span>{t(`common.organization.${type}`)}</span>
    </div>
  );
};

export default OrganizationTypeName;
