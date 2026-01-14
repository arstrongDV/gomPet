import { IUser, Role } from 'src/constants/types';

export const UsersMock: IUser[] = [
  {
    id: 1,
    email: "sdefefe",
    image: null,
    first_name: "Uzytkownik",
    last_name: "AAA",
    phone: null,
    role: Role.USER,
    created_at: "2021-07-01T12:00:00Z"
  },
  {
    id: 2,
    email: "sdefefe",
    image: null,
    first_name: "Uzytkownik",
    last_name: "AAA",
    phone: null,
    role: Role.USER,
    created_at: "2021-07-01T12:00:00Z"
  },
];
