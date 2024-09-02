import { IArticle } from 'src/constants/types';

export const articlesMock: IArticle[] = [
  {
    id: 2,
    slug: 'co-jest-wazne-dla-twojego-psa',
    created_at: '2024-08-07T12:00:00Z',
    title: 'Co jest ważne dla Twojego psa?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec libero nec libero rhoncus.',
    image: null
  },
  {
    id: 1,
    slug: 'czy-wiesz-czym-zywi-sie-twoj-pupil',
    created_at: '2024-08-07T12:00:00Z',
    title: 'Czy wiesz czym żywi się Twój pupil?',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec libero nec libero rhoncus.',
    image: 'https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg'
  }
];
