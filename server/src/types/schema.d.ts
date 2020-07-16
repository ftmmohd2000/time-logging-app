// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IMutation {
__typename: "Mutation";
clockIn: Array<IError> | null;
forgotPassword: Array<IError> | null;
login: Array<IError> | null;
logout: boolean;
logoutAll: boolean;
register: Array<IError> | null;
}

interface IClockInOnMutationArguments {
payRate: number;
}

interface IForgotPasswordOnMutationArguments {
newPassword: string;
}

interface ILoginOnMutationArguments {
email: string;
password: string;
}

interface IRegisterOnMutationArguments {
email: string;
password: string;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}

interface IUser {
__typename: "User";
id: string;
email: string;
}

interface IQuery {
__typename: "Query";
me: IUser | null;
hello: string;
}

interface IHelloOnQueryArguments {
name?: string | null;
}
}

// tslint:enable
