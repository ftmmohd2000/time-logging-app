import rp from "request-promise";
import { RegisterInputType } from "../modules/user/register/RegisterInputType";

const registerMutation = ({
  email,
  age,
  firstName,
  lastName,
  password,
  role
}: RegisterInputType) => `
  mutation{
    register(data:{role:"${role}",firstName:"${firstName}",lastName:"${lastName}",email:"${email}",password:"${password}", age:${age}})
  }
`;

const loginMutation = (email: string, password: string) => `
  mutation{
    login(email:"${email}", password:"${password}")
  }
`;

const logoutAllMutation = () => `
  mutation{
    logoutAll
  }
`;

const logoutMutation = () => `
  mutation {
    logout
  }
`;

const meQuery = () => `
  {
    me{
      id
      name
      lastName
      firstName
      email
      age
      role
    }
  }
`;

const forgotPasswordMutation = (email: string) => `
{
	forgotPassword(email:"${email}")  
}
`;

const changePasswordMutation = (password: string, token: string) => `
  mutation {
    changePassword(data:{token:"${token}",password:"${password}"})
  }
`;

export class TestClient {
  url: string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };
  constructor(url: string, withCredentials: boolean = true) {
    this.url = url;
    this.options = {
      withCredentials,
      jar: rp.jar(),
      json: true
    };
  }

  async register({
    email,
    age,
    firstName,
    lastName,
    password,
    role
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    age: number;
    role: string;
  }) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: registerMutation({
          role,
          email,
          password,
          firstName,
          lastName,
          age
        })
      }
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: loginMutation(email, password) }
    });
  }

  async me() {
    return rp.post(this.url, { ...this.options, body: { query: meQuery() } });
  }

  async logoutAll() {
    return rp.post(this.url, {
      ...this.options,
      body: { query: logoutAllMutation() }
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: { query: logoutMutation() }
    });
  }

  async forgotPassword(email: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: forgotPasswordMutation(email) }
    });
  }

  async changePassword(newPassword: string, token: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: changePasswordMutation(newPassword, token) }
    });
  }

  setCookies(newValue: boolean) {
    this.options.withCredentials = newValue;
  }
}
