'use client';

import React, { useMemo } from 'react';
import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';

import { Input, InputPlacesAutocomplete, InputWrapper } from 'src/components';
import { defaultMapPosition, defaultMapZoom } from 'src/constants/mapConfig';
import { Location } from 'src/constants/types';

import style from './LocationInput.module.scss';

type LocationInputProps = {
  value: Location;
  onChange: (value: Location) => void;
};

const LocationInput = ({ value, onChange }: LocationInputProps) => {
  const map = useMap();

  const handleSelect = (selected: any) => {
    console.log(selected);
    onChange({
      ...value,
      lat: selected.lat,
      lng: selected.lng,
      city: selected.city,
      street: selected.street,
      house_number: selected.house_number,
      zip_code: selected.zip_code
    });
  };

  const position = useMemo(() => {
    if (value.lat && value.lng) {
      return {
        lat: +value.lat,
        lng: +value.lng
      };
    }
    return null;
  }, [value.lat, value.lng]);

  return (
    <APIProvider apiKey={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}>
      <div className={style.container}>
        <div className={style.mapWrapper}>
          <InputWrapper label={'Wyszukaj adres'}>
            <InputPlacesAutocomplete
              setSelected={handleSelect}
              withDetails
              // preselected={preselected}
            />
          </InputWrapper>

          <Map
            className={style.map}
            mapId={'location-input-map'}
            zoom={position ? 16 : defaultMapZoom}
            center={
              position
                ? {
                    lat: position.lat,
                    lng: position.lng
                  }
                : defaultMapPosition
            }
          >
            {position && (
              <AdvancedMarker
                position={position}
                onClick={() => {
                  console.log('marker click');
                }}
              />
            )}
          </Map>
        </div>
        <div className={style.inputs}>
          <Input
            id='city'
            name='city'
            label={'Miasto'}
            placeholder={'Wpisz miasto'}
            required
            value={value.city}
            onChangeText={(city) => onChange({ ...value, city })}
          />
          <Input
            id='address'
            name='address'
            label={'Adres'}
            placeholder={'Wpisz ulicę i numer budynku'}
            value={value.street}
            onChangeText={(street) => onChange({ ...value, street })}
          />
          <Input
            id='zip-code'
            name='zip-code'
            label={'Kod pocztowy'}
            placeholder={'Wpisz kod pocztowy'}
            required
            value={value.zip_code}
            onChangeText={(zip_code) => onChange({ ...value, zip_code })}
          />
          <Input
            id='lat'
            name='lat'
            label={'Szerokość geograficzna'}
            placeholder={'np. 52.2297700'}
            required
            value={value.lat}
            onChangeText={(lat) => onChange({ ...value, lat: +lat })}
          />
          <Input
            id='lng'
            name='lng'
            label={'Długość geograficzna'}
            placeholder={'np. 21.0117800'}
            required
            value={value.lng}
            onChangeText={(lng) => onChange({ ...value, lng: +lng })}
          />
        </div>
      </div>
    </APIProvider>
  );
};

export default LocationInput;
