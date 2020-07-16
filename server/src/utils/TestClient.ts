import * as rp from "request-promise";

const registerMutation = (email: string, password: string) => `
  mutation {
    register(email:"${email}", password:"${password}"){
      path
      message
    }
  }
`;

const loginMutation = (email: string, password: string) => `
  mutation {
    login(email:"${email}", password:"${password}"){
      path
      message
    }
  }
`;

const logoutAllMutation = () => `
  mutation {
    logoutAll
  }
`;

const logoutMutation = () => `
  mutation {
    logout
  }
`;

const meQuery = () => `
  query {
    me{
      email
      id
    }
  }
`;

const forgotPasswordMutation = (newPassword: string, key: string) => `
  mutation {
    forgotPassword(newPassword:${newPassword},key:${key}){
      path
      message
    }
  }
`;

const clockInMutation = (payRate: number) => `
  mutation {
    clockIn(payRate:${payRate}){
      path
      message
    }
  }
`;

const clockOutMutation = () => `
  mutation {
    clockOut{
      path
      message
    }
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

  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: registerMutation(email, password) }
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

  async forgotPassword(newPassWord: string, key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: forgotPasswordMutation(newPassWord, key) }
    });
  }

  async clockIn(payRate: number) {
    return rp.post(this.url, {
      ...this.options,
      body: { query: clockInMutation(payRate) }
    });
  }

  async clockOut() {
    return rp.post(this.url, {
      ...this.options,
      body: { query: clockOutMutation() }
    });
  }
  setCookies(newValue: boolean) {
    this.options.withCredentials = newValue;
  }
}
