import { InputType, Field } from "type-graphql";
import { PasswordInputType } from "../shared/PasswordInputType";

@InputType()
export class ChangePasswordInputType extends PasswordInputType {
  @Field()
  token: string;
}
