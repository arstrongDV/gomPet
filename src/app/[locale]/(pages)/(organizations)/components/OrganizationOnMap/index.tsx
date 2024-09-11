'use client';

import React, { Suspense } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

import { Loader } from 'src/components';
import { IOrganization } from 'src/constants/types';

import style from './OrganizationOnMap.module.scss';

type OrganizationOnMapProps = {
  className?: string;
  organization: IOrganization;
};

const OrganizationOnMap = ({ organization }: OrganizationOnMapProps) => {
  return (
    <Suspense fallback={<Loader />}>
      <APIProvider apiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}>
        <Map
          className={style.map}
          mapId={`location-organization-map-${organization.id}`}
          defaultZoom={16}
          defaultCenter={{
            lat: +organization.address.lat,
            lng: +organization.address.lng
          }}
        >
          <AdvancedMarker
            position={{
              lat: +organization.address.lat,
              lng: +organization.address.lng
            }}
            onClick={() => {
              console.log('marker click');
            }}
          />
        </Map>
      </APIProvider>
    </Suspense>
  );
};

export default OrganizationOnMap;
