import { ILitter, LitterStatus } from 'src/constants/types';

export const littersMock: ILitter[] = [
  {
    id: 1,
    species: 'dog',
    breed: 'Pomeranian',
    title: 'Miot 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo ante non eros interdum, at feugiat turpis molestie. Pellentesque quis nisi ornare, pretium dui ac, vestibulum justo. In condimentum augue faucibus leo tincidunt, sed fermentum ligula egestas.',
    birth_date: '2024-07-01T12:00:00Z',
    status: LitterStatus.ALREADY_GIVEN,
    created_at: '2024-06-21T14:00:00Z',
    owner: null
  },
  {
    id: 2,
    species: 'dog',
    breed: 'Pomeranian',
    title: 'Miot 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo ante non eros interdum, at feugiat turpis molestie.',
    birth_date: '2024-07-01T12:00:00Z',
    status: LitterStatus.NO_RESERVE_SLOTS,
    created_at: '2024-06-21T14:00:00Z',
    owner: null
  },
  {
    id: 1,
    species: 'dog',
    breed: 'Pomeranian',
    title: 'Miot 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo ante non eros interdum, at feugiat turpis molestie. In condimentum augue faucibus leo tincidunt, sed fermentum ligula egestas.',
    birth_date: '2024-09-16T12:00:00Z',
    status: LitterStatus.CAN_RESERVE,
    created_at: '2024-06-21T14:00:00Z',
    owner: null
  }
];
