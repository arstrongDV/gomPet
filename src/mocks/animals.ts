import { AnimalSize, AnimalStatus, Gender, IAnimal } from 'src/constants/types';

import { organizationsMock } from './organizations';
import { commentsMock } from './comments';

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
    characteristics: ['acceptsDogs'],

    city: "Uman",
    // new Mocks
    price: 2100,
    location: {
      type: "Point",
      coordinates: [
          20.673144511006825,
          51.59228169182775
      ]
    },
    images: [
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://i.playground.ru/e/MStMO1zVZFDNqVg5c-cytw.jpeg?1200x1200',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    ],

    characteristicBoard: [
      {title: 'akceptuje koty', bool: true},
      {title: 'sterylizacja/kastracja', bool: false},
      {title: 'szczepienia', bool: true},
      {title: 'szkolony', bool: true},
      {title: 'przyjazny dzieciom', bool: false},
      {title: 'uwielbia zabawę', bool: false},
      {title: 'uwielbia spacery', bool: false},
    ],

    comments: commentsMock,

    famillyTree: [
      {
        id: 1,
        name: 'Lobo',
        image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        children: [
          {
            id: 2,
            name: 'Lobo 2.0',
            image: '',
            parent: [
              {
                id: 4,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 5,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
          {
            id: 3,
            name: 'Lobo 2.1',
            image: '',
            parent: [
              {
                id: 6,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 7,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'LABA',
    image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    gallery: [],
    species: 'dog',
    breed: 'American Staffordshire Terrier',
    gender: Gender.MALE,
    size: AnimalSize.MEDIUM,
    age: 1,
    birth_date: null,
    created_at: '2021-07-01T12:00:00Z',
    owner: organizationsMock[0],
    parents: [],
    status: AnimalStatus.AVAILABLE,
    characteristics: ['acceptsDogs'],
    city: "Uman",
    // new Mocks
    price: 500,
    location: {
      type: "Point",
      coordinates: [
          20.673144511006825,
          51.59228169182775
      ]
    },
    images: [
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://i.playground.ru/e/MStMO1zVZFDNqVg5c-cytw.jpeg?1200x1200',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    ],

    characteristicBoard: [
      {title: 'akceptuje koty', bool: true},
      {title: 'sterylizacja/kastracja', bool: true},
      {title: 'szczepienia', bool: true},
      {title: 'szkolony', bool: true},
      {title: 'przyjazny dzieciom', bool: true},
      {title: 'uwielbia zabawę', bool: true},
      {title: 'uwielbia spacery', bool: false},
    ],

    comments: commentsMock,

    famillyTree: [
      {
        id: 1,
        name: 'Lobo',
        image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        children: [
          {
            id: 2,
            name: 'Lobo 2.0',
            image: '',
            children: [
              {
                id: 4,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 5,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
          {
            id: 3,
            name: 'Lobo 2.1',
            image: '',
            children: [
              {
                id: 6,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 7,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Sava',
    image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    gallery: [],
    species: 'dog',
    breed: 'American Staffordshire Terrier',
    gender: Gender.FEMALE,
    size: AnimalSize.MEDIUM,
    age: 1,
    birth_date: null,
    created_at: '2021-07-01T12:00:00Z',
    owner: organizationsMock[0],
    parents: [],
    status: AnimalStatus.AVAILABLE,
    characteristics: ['acceptsDogs'],
    city: "Uman",
    // new Mocks
    price: 800,
    location: {
      type: "Point",
      coordinates: [
          20.673144511006825,
          51.59228169182775
      ]
    },
    images: [
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://i.playground.ru/e/MStMO1zVZFDNqVg5c-cytw.jpeg?1200x1200',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    ],

    characteristicBoard: [
      {title: 'akceptuje koty', bool: false},
      {title: 'sterylizacja/kastracja', bool: true},
      {title: 'szczepienia', bool: true},
      {title: 'szkolony', bool: true},
      {title: 'przyjazny dzieciom', bool: true},
      {title: 'uwielbia zabawę', bool: true},
      {title: 'uwielbia spacery', bool: false},
    ],

    comments: commentsMock,

    famillyTree: [
      {
        id: 1,
        name: 'Lobo',
        image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        children: [
          {
            id: 2,
            name: 'Lobo 2.0',
            image: '',
            children: [
              {
                id: 4,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 5,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
          {
            id: 3,
            name: 'Lobo 2.1',
            image: '',
            children: [
              {
                id: 6,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 7,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Bob',
    image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    gallery: [],
    species: 'dog',
    breed: 'American Staffordshire Terrier',
    gender: Gender.FEMALE,
    size: AnimalSize.MEDIUM,
    age: 1,
    birth_date: null,
    created_at: '2021-07-01T12:00:00Z',
    owner: organizationsMock[0],
    parents: [],
    status: AnimalStatus.AVAILABLE,
    characteristics: ['acceptsDogs'],
    city: "Uman",
    // new Mocks
    price: 800,
    // location: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2443.8018508000296!2d21.01178047685647!3d52.22967547975814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669b2e4b15%3A0x6d1c63c9c8f9f2a3!2sWarszawa!5e0!3m2!1spl!2spl!4v1683300000000!5m2!1spl!2spl",
    location: {
      type: "Point",
      coordinates: [
          20.673144511006825,
          51.59228169182775
      ]
    },
    images: [
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://i.playground.ru/e/MStMO1zVZFDNqVg5c-cytw.jpeg?1200x1200',
      'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
      // 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    ],

    characteristicBoard: [
      {title: 'akceptuje koty', bool: false},
      {title: 'sterylizacja/kastracja', bool: true},
      {title: 'szczepienia', bool: true},
      {title: 'szkolony', bool: true},
      {title: 'przyjazny dzieciom', bool: false},
      {title: 'uwielbia zabawę', bool: true},
      {title: 'uwielbia spacery', bool: false},
    ],

    comments: commentsMock,

    famillyTree: [
      {
        id: 1,
        name: 'Lobo',
        image: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        children: [
          {
            id: 2,
            name: 'Lobo 2.0',
            image: '',
            children: [
              {
                id: 4,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 5,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
          {
            id: 3,
            name: 'Lobo 2.1',
            image: '',
            children: [
              {
                id: 6,
                name: 'Lobo 2.1',
                image: '',
                children: []
              },
              {
                id: 7,
                name: 'Lobo 2.1',
                image: '',
                children: []
              }
            ],
          },
        ]
      }
    ]
  }
];