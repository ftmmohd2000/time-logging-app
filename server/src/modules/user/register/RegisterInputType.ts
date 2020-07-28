import { IsEmail, IsPositive, Length } from "class-validator";
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

  @IsPositive()
  @Field()
  age: number;

  @Length(7)
  @Field()
  password: string;

  @Field({ nullable: true })
  role: string;
}
