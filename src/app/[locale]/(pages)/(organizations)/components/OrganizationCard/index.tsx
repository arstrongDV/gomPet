import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Button, LocationCityPin, OrganizationTypeName, StarRating } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IOrganization } from 'src/constants/types';
import { Link } from 'src/navigation';

import style from './OrganizationCard.module.scss';

type OrganizationCardProps = {
  className?: string;
  organization: IOrganization;
};

const OrganizationCard = ({ organization, className }: OrganizationCardProps) => {
  const { id, name, type, image, address, rating = 0 } = organization;
  const t = useTranslations();
  console.log(organization)
  const cardClasses = classNames(style.card, className);

  return (
    <div className={cardClasses}>
      <div className={style.top}>
        <OrganizationTypeName type={type} />
        <h2 className={style.name}>{name}</h2>

        {image && (
          <Link href={Routes.ORGANIZATION_PROFILE(id)}>
            <div className={style.logo}>
              <img
                src={image}
                alt={name}
              />
            </div>
          </Link>
        )}
      </div>

      <div className={style.bottom}>
        <StarRating
          rating={rating}
          readonly
        />

        {address ? (
          <LocationCityPin city={address.city} />
        ) : (
          <div className={style.noAddress}>
            {t('pages.organizations.noAddress')}
          </div>
        )}

        <Button
          label={t('pages.organizations.seeUs')}
          href={Routes.ORGANIZATION_PROFILE(id)}
          icon='paw'
          gray
          fullWidth
        />
      </div>
    </div>
  );
};

export default OrganizationCard;
