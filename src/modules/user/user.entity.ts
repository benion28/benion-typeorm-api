// modules/user/user.entity.ts
import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "@/common/base.entity";
import { Product } from "@/modules/product/product.entity";

@Entity("users")
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Product, product => product.created_by)
  posts: Product[];
}
