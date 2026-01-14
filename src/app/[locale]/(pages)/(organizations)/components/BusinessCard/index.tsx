import React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

import { Button, Card, Icon, OrganizationTypeName } from 'src/components';
import { IOrganization } from 'src/constants/types';

import style from './BusinessCard.module.scss';

type BusinessCardProps = {
  organization: IOrganization;
  className?: string;
  variant?: 'horizontal' | 'vertical';
};

const BusinessCard = ({ organization, className, variant = 'horizontal' }: BusinessCardProps) => {
  const { name, image, phone, email, address } = organization;
  const t = useTranslations();

  const vertical = (
    <>
      <header className={style.header}>
        <OrganizationTypeName type={organization.type} />
        <h1 className={style.name}>{name}</h1>
      </header>

      {image && (
        <img
          src={image}
          alt={name}
          className={style.logo}
        />
      )}

      <div className={style.location}>
        <Icon
          className={style.icon}
          name='mapPin'
        />
        <span className={style.text}>
          {address?.street} {address?.house_number}, {address?.zip_code} {address?.city || t('common.noLocation')}
        </span>
      </div>

      <div className={style.contact}>
        {phone && (
          <Button
            icon='phone'
            label={'+48 213 713 370'}
            hrefOutside='tel:+48213713370'
          />
        )}
        {email && (
          <Button
            icon='mail'
            label={'Napisz do nas'}
            hrefOutside={`mailto:${email}`}
            empty
          />
        )}
      </div>
    </>
  );

  const horizontal = (
    <>
      <header className={style.header}>
        <OrganizationTypeName type={organization.type} />
        <h1 className={style.name}>{name}</h1>
      </header>

      <div className={style.row}>
        {image && (
          <img
            src={image}
            alt={name}
            className={style.logo}
          />
        )}

        <div className={style.contact}>
          {phone && (
            <Button
              icon='phone'
              label={'+48 213 713 370'}
              hrefOutside='tel:+48213713370'
            />
          )}
          {email && (
            <Button
              icon='mail'
              label={'Napisz do nas'}
              hrefOutside={`mailto:${email}`}
              empty
            />
          )}
        </div>
      </div>

      <div className={style.location}>
        <Icon
          className={style.icon}
          name='mapPin'
        />
        <span className={style.text}>
          {address?.street} {address?.house_number}, {address?.zip_code} {address?.city || t('common.noLocation')}
        </span>
      </div>
    </>
  );

  return (
    <Card className={classNames(style.container, style[variant])}>
      {variant === 'horizontal' && horizontal}
      {variant === 'vertical' && vertical}
    </Card>
  );
};

export default BusinessCard;
