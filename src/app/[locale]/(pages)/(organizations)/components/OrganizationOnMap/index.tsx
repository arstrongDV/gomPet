'use client';

import React, { Suspense } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

import { Avatar, Loader } from 'src/components';
import { IOrganization } from 'src/constants/types';

import classNames from 'classnames';
import style from './OrganizationOnMap.module.scss';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';

type OrganizationOnMapProps = {
  className?: string;
  organizations?: IOrganization[];
};

type OrganizationWithAddress = IOrganization & {
  address: {
    lat: string | number;
    lng: string | number;
  };
};

const hasValidAddress = (organization: IOrganization): organization is OrganizationWithAddress => {
  const address = (organization as any).address;
  if (!address) return false;

  const lat = Number(address.lat);
  const lng = Number(address.lng);

  return Number.isFinite(lat) && Number.isFinite(lng);
};

const OrganizationOnMap = ({ organizations=[], className }: OrganizationOnMapProps) => {
  const router = useRouter();
  const { push } = router;
  const session = useSession();
  const user = session.data?.user;

  const organizationsWithAddress = organizations.filter(hasValidAddress);

  if (!organizationsWithAddress.length) {
    return null;
  }

    const center = user?.location && organizationsWithAddress.length >= 2 ? {
      lat: +user?.location.coordinates[1],
      lng: +user?.location.coordinates[0],
    } : {
        lat: +organizationsWithAddress[0].address.lat,
        lng: +organizationsWithAddress[0].address.lng,
    }

  return (
    <Suspense fallback={<Loader />}>
      <APIProvider apiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}>
        <Map
          className={classNames(style.map, className)}
          mapId="location-organization-map"
          defaultZoom={6}
          defaultCenter={center}
        >
          {user?.location && (
          <AdvancedMarker
          key={user?.id}
          position={{
            lat: +user?.location.coordinates[1],
            lng: +user?.location.coordinates[0],
          }}
          onClick={() => {
            // console.log(`Marker clicked for organization ID: ${user.id}`);
          }}
        >
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid green',
          }}>
          <Avatar
            className={style.image}
            profile={session.data?.user}
            src={session.data?.user.image ? session.data?.user.image : undefined}
          />
        </div>
        <div style={{
          position: 'absolute',
          top: '52px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '13px solid transparent',
          borderRight: '13px solid transparent',
          borderTop: '14px solid green',
        }} />
        {/* <Pin
          scale={2} 
          background="red"
          borderColor="#fff"
        /> */}
      </AdvancedMarker>
          )}

          {organizationsWithAddress.map((org) => (
              <AdvancedMarker
                key={org.id}
                position={{
                  lat: +org.address.lat,
                  lng: +org.address.lng,
                }}
                onClick={() => {
                  // console.log(`Marker clicked for organization ID: ${org.id}`);
                  push(Routes.ORGANIZATION_PROFILE(org.id));
                }}
              >
              <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '55px',
                  height: '55px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid green',
                }}>
                {org.image ? (
                  <img
                    src={org.image}
                    alt={org.name || 'organization'}
                    style={{
                      width: '60px',
                      height: '60px',
                    }}
                  />
                ) : null}
              </div>
              <div style={{
                position: 'absolute',
                top: '52px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '13px solid transparent',
                borderRight: '13px solid transparent',
                borderTop: '14px solid green',
              }} />
              {/* <Pin
                scale={2} 
                background="red"
                borderColor="#fff"
              /> */}
              </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </Suspense>
  );
};

export default OrganizationOnMap;
