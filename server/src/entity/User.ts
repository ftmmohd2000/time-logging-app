import { hash } from "bcrypt";
import { Field, ID, ObjectType, Root } from "type-graphql";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn
} from "typeorm";
import { v4 as uuid } from "uuid";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  private tempPassword: string;

  @Column("text", { nullable: true })
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field()
  @Column("int", { nullable: true })
  age: number;

  @Column({ default: process.env.NODE_ENV === "development" })
  confirmed: boolean;

  @BeforeInsert()
  async generatePasswordAndHash() {
    if (this.password) this.password = await hash(this.password, 12);
    this.id = uuid();
  }

  @AfterLoad()
  loadtemp() {
    this.tempPassword = this.password!;
  }

  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword !== this.password)
      this.password = await hash(this.password, 12);
  }
}
