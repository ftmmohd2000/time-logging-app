import { InputType, Field } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class PasswordInputType {
  @Length(7)
  @Field()
  password: string;
}
