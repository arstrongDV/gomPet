type LocationPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type RegisterPayload = {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  location?: LocationPoint | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ResetPasswordRequestPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  token: string;
};
