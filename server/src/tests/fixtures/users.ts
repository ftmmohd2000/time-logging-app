import * as faker from "faker";

export interface IUser {
  email: string;
  password: string;
}

export const createFakeUser = (): IUser => ({
  email: faker.internet.email(),
  password: faker.internet.password()
});
