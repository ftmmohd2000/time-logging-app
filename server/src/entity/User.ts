import { hash } from "bcrypt";
import { Field, ID, ObjectType, Root } from "type-graphql";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm";
import { Clock } from "./Clock";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column("text", { nullable: true })
  password: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field(() => [Clock])
  async clocks(@Root() { id: userId }: User) {
    return Clock.find({ where: { userId } });
  }

  @Column("boolean", { default: false })
  clockedIn: boolean;

  @Column({ default: process.env.NODE_ENV === "development" })
  confirmed: boolean;

  private tempPassword: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password) this.password = await hash(this.password, 12);
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
