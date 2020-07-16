import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("time_periods")
export class TimePeriod extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("numeric", { default: -1 })
  startTime: number;

  @Column("numeric", { nullable: true, default: null })
  endTime: number | null;

  @Column("numeric")
  payRate: number;

  @Column("text")
  employeeId: string;

  @BeforeInsert()
  async generateId() {
    this.id = uuid();
  }
}
