import { IOrganization, OrganizationType } from 'src/constants/types';

export const organizationsMock: IOrganization[] = [
  {
    id: 1,
    type: OrganizationType.ANIMAL_SHELTER,
    name: 'Ratujemy zwierzaki',
    email: 'ratujemyzwierzaki@gmail.com',
    image:
      'https://www.ratujemyzwierzaki.pl/assets/animals/ratujemyzwierzaki_obrys-17a8f72696c6e92b0c29d22d1309e54caf8b73c3fff0c24b2147df3eadf11c4f.svg',
    phone: '123456789',
    description: 'Organizacja zajmująca się ratowaniem zwierząt',
    rating: 5,
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
  }
];
