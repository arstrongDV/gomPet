import React from 'react'; 

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationAnimals from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationAnimals';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { Card } from 'src/components';
import RichTextViewer from 'src/components/layout/Forms/RichTextViewer';
import PostComments from 'src/components/layout/PostCard/components/PostComments';
import { IOrganization } from 'src/constants/types';

import style from './Information.module.scss';

type InformationProps = {
  organization: IOrganization;
};

const Information = ({ organization }: InformationProps) => {
  if (!organization) return null;

  return (
    <div className={style.container}>
      <div className={style.row}>
        <BusinessCard organization={organization} />
        <div className={style.mapWrraper}>
          <OrganizationOnMap className={style.map} organizations={[organization]} />
        </div>
      </div>
      <Card>
        <RichTextViewer content={organization.description} />
      </Card>
      <PostComments 
        postId={organization.id} 
        isOrganizationPage={{
          averageRating: organization.rating
        }} 
        type='users.organization'
      />
      <OrganizationAnimals organizationId={organization.id} />

    </div>
  );
};

export default Information;
