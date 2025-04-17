export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  isCompany: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PasswordUpdate = {
  password: string;
  newPassword: string;
};
