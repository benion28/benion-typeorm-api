// modules/product/product.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "@/common/base.entity";
import { User } from "@/modules/user/user.entity";

@Entity("products")
export class Product extends BaseEntity {
  @Column()
  title: string;

  @Column("decimal")
  price: number;

  @Column()
  created_by_id: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: "created_by_id" })
  created_by: User;
}
