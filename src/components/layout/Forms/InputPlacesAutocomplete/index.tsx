'use client';

import React, { useEffect } from 'react';
import classNames from 'classnames';
import Script from 'next/script';
import usePlacesAutocomplete, { getDetails, getGeocode, getLatLng, RequestOptions } from 'use-places-autocomplete';

import { Input } from 'components';

import { Location } from 'src/constants/types';

import style from './InputPlacesAutocomplete.module.scss';

type InputPlacesAutocompleteProps = {
  setSelected: (selected: Location) => void;
  requestOptions?: RequestOptions;
  className?: string;
  withDetails?: boolean;
  preselected?: Location;
};

const InputPlacesAutocomplete = ({
  setSelected,
  requestOptions = {},
  className,
  withDetails = false,
  preselected
}: InputPlacesAutocompleteProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    callbackName: 'initPlacesAutocomplete',
    requestOptions: {
      ...requestOptions,
      componentRestrictions: { country: 'pl' }
    },
    debounce: 300
  });
  const round6 = (value: number) => Math.round(value * 1e6) / 1e6;
  const handleSelect = async (suggestion: any) => {
    const { description } = suggestion;
    let location = {
      lat: 0,
      lng: 0,
      city: '',
      street: '',
      house_number: '',
      zip_code: '',
      country: ''
    };

    try {
      const geocode = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(geocode[0]);
      location = {
        ...location,
        lat: round6(lat),
        lng: round6(lng),
      };

      if (withDetails) {
        const details: any = await getDetails({ placeId: suggestion.place_id, fields: ['address_components'] });
        const city =
          details.address_components.find((component: any) => component.types.includes('locality'))?.long_name || '';
        const street =
          details.address_components.find((component: any) => component.types.includes('route'))?.long_name ||
          city ||
          '';
        const house_number =
          details.address_components.find((component: any) => component.types.includes('street_number'))?.long_name ||
          details.address_components.find((component: any) => component.types.includes('premise'))?.long_name ||
          '';
        const zip_code =
          details.address_components.find((component: any) => component.types.includes('postal_code'))?.long_name || '';
        const country =
          details.address_components.find((component: any) => component.types.includes('country'))?.long_name || '';

        location = {
          ...location,
          city,
          street,
          house_number,
          zip_code,
          country
        };
      }

      setSelected(location);
      setValue(description, false);
    } catch (e) {
      console.log(e);
    } finally {
      clearSuggestions();
    }
  };

  const getLocationByGeocode = async (geocode: { lat: number; lng: number }) => {
    const data = await getGeocode({ location: geocode });
    const placeId = data[0]?.place_id;

    if (!placeId) return;

    const details = await getDetails({ placeId, fields: ['formatted_address'] });
  };

  const getPreselected = async () => {
    if (!preselected) return;
    setValue(`${preselected.street} ${preselected.house_number}, ${preselected.zip_code} ${preselected.city}, Polska`);
  };

  useEffect(() => {
    getPreselected();
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initPlacesAutocomplete`}
      />

      <div className={classNames(style.wrapper, className)}>
        <Input
          className={style.input}
          value={value}
          onChangeText={setValue}
          disabled={!ready}
          placeholder={'Znajdź adres'}
        />

        {status === 'OK' && data.length > 0 && (
          <ul className={style.suggestions}>
            {data.map((suggestion) => (
              <button
                type='button'
                className={style.suggestion}
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.description}
              </button>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default InputPlacesAutocomplete;
