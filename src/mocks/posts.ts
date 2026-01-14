import { IPost } from 'src/constants/types';

import { organizationsMock } from './organizations';
import { UsersMock } from './user';

export const postsMock: IPost[] = [
  {
    id: 2,
    created_at: '2024-08-11T18:00:00Z',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus efficitur eu lacus vel tincidunt. Suspendisse interdum leo sed justo pulvinar luctus. Fusce mi sapien, lobortis sollicitudin condimentum a, placerat rhoncus velit. Suspendisse ut tristique sem, et euismod mi. Nunc a nisi id quam tincidunt vehicula at in felis. Aliquam rutrum tortor ac elit ultricies, eget feugiat risus consectetur. Aenean vel consectetur dui. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris venenatis turpis eu mauris imperdiet scelerisque. Mauris facilisis consequat eros, eget volutpat lorem efficitur id. Integer vitae nunc eu urna aliquet pretium ut at sapien. Vivamus non euismod leo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    image: null,
    author: organizationsMock[0],
    comments: [],
    reactions: []
  },
  {
    id: 1,
    created_at: '2024-08-07T12:00:00Z',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec libero nec libero rhoncus.',
    image: 'https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg',
    author: organizationsMock[0],
    comments: [
      {
        id: 1,
        text: "Yes, cool!",
        created_at: '2024-08-07T12:00:00Z',
        updated_at: '2024-08-07T12:00:00Z',
        author: UsersMock[0],
      },
      {
        id: 2,
        text: "Nice dog",
        created_at: '2025-08-07T12:00:00Z',
        updated_at: '2025-08-07T12:00:00Z',
        author: UsersMock[1],
      } 
    ],
    reactions: [
      {
        author: UsersMock[0],
        author_type: 'user',
        type: 'like'
      },
      {
        author: UsersMock[1],
        author_type: 'user',
        type: 'like'
      },
    ]
  }
];
