import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { IconNames } from 'src/assets/icons';
import { Button, Icon, LocationCityPin, StarRating } from 'src/components';
import { IOrganization, OrganizationType } from 'src/constants/types';

import style from './OrganizationCard.module.scss';

type OrganizationCardProps = {
  className?: string;
  organization: IOrganization;
};

const OrganizationCard = ({ organization, className }: OrganizationCardProps) => {
  const { id, name, type, image, address, rating = 0 } = organization;
  const t = useTranslations();

  const cardClasses = classNames(style.card, className);

  const organizationIcon: { [key: string]: IconNames } = {
    [OrganizationType.ANIMAL_SHELTER]: 'homeHeart',
    [OrganizationType.FUND]: 'shieldHeart',
    [OrganizationType.BREEDING]: 'buildingCottage'
  };

  return (
    <div className={cardClasses}>
      <div className={style.top}>
        <header className={style.orgType}>
          <Icon
            name={organizationIcon[type]}
            gray
          />
          <span>{t(`common.organization.${type}`)}</span>
        </header>

        <h2 className={style.name}>{name}</h2>

        {image && (
          <div className={style.logo}>
            <img
              src={image}
              alt={name}
            />
          </div>
        )}
      </div>

      <div className={style.bottom}>
        <StarRating
          rating={rating}
          readonly
        />

        <LocationCityPin city={address.city} />

        <Button
          label={t('pages.organizations.seeUs')}
          href={`/organizations/${organization.id}`}
          icon='paw'
          gray
          fullWidth
        />
      </div>
    </div>
  );
};

export default OrganizationCard;
