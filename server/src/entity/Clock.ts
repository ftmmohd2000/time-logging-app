import moment from "moment";
import { Field, ID, ObjectType, Root, Int } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne
} from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "./User";

@Entity("clocks")
@ObjectType()
export class Clock extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  payRate: number;

  @Column("bigint")
  start: number;

  @Column("bigint", { nullable: true, default: null })
  end: number | undefined;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.clocks)
  user: User;

  @Field(() => String)
  startTime(@Root() { start }: Clock) {
    return moment(parseInt(start + "", 10)).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
  }

  @Field(() => String)
  endTime(@Root() { end }: Clock) {
    return moment(parseInt(end + "", 10)).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
  }

  @BeforeInsert()
  generateId() {
    this.id = uuid();
  }
}
