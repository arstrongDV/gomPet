import React from 'react';
import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationAnimals from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationAnimals';
import OrganizationComments from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationComments';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { Card } from 'src/components';

import style from './Information.module.scss';
import { IOrganization } from 'src/constants/types';

type InformationProps = {
  organization: IOrganization;
};

const Information = ({ organization }: InformationProps) => {
  if (!organization) return null;
  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <OrganizationOnMap organization={organization} />
      </div>
      <Card>
        <p className={style.description}>{organization.description}</p>
      </Card>
      <OrganizationComments
        organizationId={organization.id}
        averageRating={4.2}
      />
      <OrganizationAnimals organizationId={organization.id} />
    </div>
  );
};

export default Information;
