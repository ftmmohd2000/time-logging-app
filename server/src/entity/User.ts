import { hash } from "bcrypt";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryColumn
} from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: process.env.NODE_ENV === "dev" })
  confirmed: boolean;

  @Column("boolean", { default: false })
  clockedIn: boolean;

  @BeforeInsert()
  async generateIdAndHashPassword() {
    this.id = uuid();
    this.password = await hash(this.password, 12);
  }
}
