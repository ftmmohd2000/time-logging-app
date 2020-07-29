import moment from "moment";
import { Field, ID, ObjectType, Root } from "type-graphql";
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

@Entity("clocks", { orderBy: { start: "ASC" } })
@ObjectType()
export class Clock extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  payRate: number;

  @Field()
  @Column("bigint")
  start: number;

  @Field()
  @Column("bigint")
  end: number;

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
