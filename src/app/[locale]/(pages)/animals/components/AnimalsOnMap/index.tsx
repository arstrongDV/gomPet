'use client';

import React, { Suspense } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

import { Avatar, Loader } from 'src/components';
import { IAnimal } from 'src/constants/types';

import classNames from 'classnames';
import style from './OrganizationOnMap.module.scss';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Routes } from 'src/constants/routes';

type OrganizationOnMapProps = {
  className?: string;
  animals?: IAnimal[];
};

type AnimalWithLocation = IAnimal & {
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
};

const hasValidLocation = (animal: IAnimal): animal is AnimalWithLocation =>
  Boolean(
    animal.location &&
      Array.isArray(animal.location.coordinates) &&
      animal.location.coordinates.length === 2
  );

const AnimalsOnMap = ({ animals=[], className }: OrganizationOnMapProps) => {
  const router = useRouter();
  const { push } = router;
  const session = useSession();
  const user = session.data?.user;
  const animalsWithLocation = animals.filter(hasValidLocation);

  if (!animalsWithLocation.length) {
    return null;
  }

    const center = user?.location && animalsWithLocation.length >= 2 ? {
      lat: +user?.location.coordinates[1],
      lng: +user?.location.coordinates[0],
    } : {
        lat: +animalsWithLocation[0].location.coordinates[1],
        lng: +animalsWithLocation[0].location.coordinates[0],
    }

  return (
    <Suspense fallback={<Loader />}>
      <APIProvider apiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}>
        <Map
          className={classNames(style.map, className)}
          mapId="location-animal-map"
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

          {animalsWithLocation.map((animal) => (
              <AdvancedMarker
                key={animal.id}
                position={{
                  lat: +animal.location.coordinates[1],
                  lng: +animal.location.coordinates[0],
                }}
                onClick={() => {
                  push(Routes.ANIMAL_PROFILE(animal.id));
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
                {animal.image ? (
                  <img
                    src={animal.image}
                    alt={animal.name || 'animal'}
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

export default AnimalsOnMap;
