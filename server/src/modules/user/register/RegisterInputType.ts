import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { PasswordInputType } from "../shared/PasswordInputType";

@InputType()
export class RegisterInputType extends PasswordInputType {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @IsEmail()
  @Field()
  email: string;

  @Length(7)
  @Field()
  password: string;
}
