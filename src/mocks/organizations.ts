import { IOrganization, OrganizationType } from 'src/constants/types';

export const organizationsMock: IOrganization[] = [
  {
    id: 1,
    type: OrganizationType.FUND,
    name: 'Ratujemy zwierzaki',
    email: 'ratujemyzwierzaki@gmail.com',
    image:
      'https://www.ratujemyzwierzaki.pl/assets/animals/ratujemyzwierzaki_obrys-17a8f72696c6e92b0c29d22d1309e54caf8b73c3fff0c24b2147df3eadf11c4f.svg',
    phone: '123456789',
    description: 'Organizacja zajmująca się ratowaniem zwierząt',
    rating: 4.5,
    address: {
      city: 'Warszawa',
      street: 'Złota',
      house_number: '44',
      zip_code: '00-120'
    },
    location: {
      lat: 52.22977,
      lng: 21.01178
    },
    created_at: '2021-07-01T12:00:00Z'
  },
  {
    id: 2,
    type: OrganizationType.ANIMAL_SHELTER,
    name: 'Schronisko Dla Zwierząt Animalia',
    email: 'ratujemyzwierzaki@gmail.com',
    image: null,
    phone: '987654321',
    description: 'Schronisko dla zwierząt, które pomaga bezdomnym zwierzętom',
    rating: 3,
    address: {
      city: 'Poznań',
      street: 'Przeysłowa',
      house_number: '4',
      zip_code: '60-120'
    },
    location: {
      lat: 51.22977,
      lng: 21.01412
    },
    created_at: '2022-08-01T12:00:00Z'
  },
  {
    id: 3,
    type: OrganizationType.BREEDING,
    name: 'Hodowla Dla Zwierząt Animal Planet',
    email: 'hodowlaanimalplanet@gmail.com',
    image: null,
    phone: '789321423',
    description: 'Organizacja zajmująca się hodowlą zwierząt',
    rating: 5,
    address: {
      city: 'Ciechocinek',
      street: 'Klonowa',
      house_number: '8',
      zip_code: '87-720'
    },
    location: {
      lat: 51.12977,
      lng: 20.01412
    },
    created_at: '2022-02-27T12:00:00Z'
  }
];
