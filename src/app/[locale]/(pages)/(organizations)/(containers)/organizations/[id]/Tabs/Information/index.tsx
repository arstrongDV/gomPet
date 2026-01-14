import React from 'react';
import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationAnimals from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationAnimals';
import OrganizationComments from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationComments';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { Button, Card } from 'src/components';

import style from './Information.module.scss';
import { IOrganization } from 'src/constants/types';
import DescriptionTranslate from './OrganizationDescription';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type InformationProps = {
  organization: IOrganization;
};

const Information = ({ organization }: InformationProps) => {
  const router = useRouter();
  const { push } = router;
  if (!organization) return null;
  console.log("organization: ", organization);
  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <div className={style.mapWrraper}>
          <OrganizationOnMap className={style.map} organizations={[organization]} />
        </div>
      </div>
      <Card>
        <DescriptionTranslate text={organization.description} />
        {/* <p className={style.description}>{organization.description}</p> */}
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
