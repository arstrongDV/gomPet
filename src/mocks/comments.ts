import { IComment } from 'src/constants/types';

import { UsersMock } from './user';

export const commentsMock: IComment[] = [
    {
      id: 2,
      created_at: '2024-08-11T18:00:00Z',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc porttitor vel sapien eu laoreet. Donec dapibus justo ac porta vestibulum. Sed tincidunt elit mauris, at interdum mi sollicitudin a.',
      author: UsersMock[0],
      rating: 3,
    },
    {
      id: 1,
      created_at: '2024-08-07T12:00:00Z',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      author: UsersMock[1],
      rating: 4,
    }
];