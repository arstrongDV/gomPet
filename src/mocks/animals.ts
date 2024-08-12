import { AnimalSize, AnimalStatus, Gender, IAnimal } from 'src/constants/types';

import { organizationsMock } from './organizations';

export const animalsMock: IAnimal[] = [
  {
    id: 1,
    name: 'Lobo',
    image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    gallery: [],
    species: 'dog',
    breed: 'American Staffordshire Terrier',
    gender: Gender.MALE,
    size: AnimalSize.MEDIUM,
    age: 3,
    birth_date: null,
    created_at: '2021-07-01T12:00:00Z',
    owner: organizationsMock[0],
    parents: [],
    status: AnimalStatus.AVAILABLE,
    characteristics: ['acceptsDogs']
  }
];
