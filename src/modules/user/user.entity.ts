// modules/user/user.entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
import { Product } from "../product/product.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "moderator", "user"], default: "user" })
  role!: "admin" | "moderator" | "user";

  @Column({ nullable: true })
  creator_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "creator_id" })
  creator?: User;

  @OneToMany(() => Product, (product) => product.creator)
  products!: Product[];

  @OneToMany(() => User, (user) => user.creator)
  created_users!: User[];
}
