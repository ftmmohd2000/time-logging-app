import faker from "faker";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  role: number;
}

export const createFakeUser = (role: number): IUser => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  lastName: faker.name.lastName(),
  firstName: faker.name.firstName(),
  age: faker.random.number(100),
  role
});
