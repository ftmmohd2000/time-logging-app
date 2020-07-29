import rp from "request-promise";
import { RegisterInputType } from "../modules/user/register/RegisterInputType";

const registerMutation = ({
  email,
  firstName,
  lastName,
  password
}: RegisterInputType) => `
  mutation{
    register(data:{firstName:"${firstName}",lastName:"${lastName}",email:"${email}",password:"${password}"})
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
    firstName,
    lastName,
    password
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: registerMutation({
          email,
          password,
          firstName,
          lastName
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
