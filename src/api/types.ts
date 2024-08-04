export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
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
