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
    description:
      'RatujemyZwierzaki.pl to największy serwis zbiórkowy dla Fundacji i Stowarzyszeń, które ratują bezdomne zwierzęta. Mamy jeden cel - pomóc jak największej liczbie zwierząt! Bo miarą człowieczeństwa jest nasz stosunek do bezbronnych istot. Niestety, one cierpią głównie z ręki człowieka...\n\nJesteśmy nie tylko serwisem internetowym, ale przestrzenią, w której Pomagacze spotykają się z Organizacjami, walczącymi o zwierzęta. Efektem tego wirtualnego spotkania jest niesamowita pomoc, jaka płynie do tych najsłabszych, a my jesteśmy pośrednikiem, który to umożliwia. Dzięki temu możemy działać na wielu płaszczyznach jednocześnie. Poza rozwijaniem serwisu oraz wspieraniem merytorycznym i marketingowym Organizacji dla zwierząt prowadzimy też zbiórki 1,5% podatku. \n\nWesprzyj działania Fundacji Ratujemy.pl:\n\nKRS Fundacja Ratujemy.pl: 0000819398\n\nRazem zbudowaliśmy społeczność miłośników i obrońców zwierząt, którzy troszczą się o ich los. Dzięki wsparciu Darczyńców możemy pomagać wielu Organizacjom jednocześnie - każda Fundacja i Stowarzyszenie, niezależnie od swojej rozpoznawalności czy wielkości, otrzyma u nas pomoc. Od kilku lat, dzięki zbiórkom procenta podatku, prowadzimy nietypowe akcje, wspierające Organizacje dla zwierząt. Dzięki 1% podatku mogliśmy kupić samochody interwencyjne - Zwierzkobusy, które od kilku lat pomagają Fundacjom i Stowarzyszeniom docierać z ratunkiem wszędzie tam, gdzie jest on najbardziej potrzebny.\n\nOd 2 lat organizujemy akcję "Łap dotacje na Organizacje!", w ramach której przeznaczyliśmy ponad 1 000 000 zł na wsparcie współpracujących z nami Organizacji. W ten sposób stworzyliśmy jedyny w Polsce fundusz pomocy zwierzętom. Wiemy, że Fundacje i Stowarzyszenia zwierzęce nie mają możliwości ubiegania się o dotacje czy granty, nie są też wspierane przez publiczne instytucje. Postanowiliśmy więc wyjść naprzeciw potrzebom Organizacji, z którymi współpracujemy, i dać im możliwość uzyskania dotacji od RatujemyZwierzaki.pl na ratowanie zwierząt. Mogliśmy stworzyć tę akcję tylko i wyłącznie dzięki hojności Darczyńców, którzy przekazali nam swój 1% podatku.',
    rating: 4,
    address: {
      city: 'Warszawa',
      street: 'Złota',
      house_number: '44',
      zip_code: '00-120',
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
      zip_code: '60-120',
      lat: 52.22977,
      lng: 21.01178
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
      zip_code: '87-720',
      lat: 52.22977,
      lng: 21.01178
    },
    created_at: '2022-02-27T12:00:00Z'
  }
];
