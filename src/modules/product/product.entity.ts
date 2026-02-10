// modules/product/product.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../common/base.entity";
import { User } from "../user/user.entity";

@Entity("products")
export class Product extends BaseEntity {
  @Column({ unique: true })
  title!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column()
  creator_id!: string;

  @ManyToOne(() => User, user => user.products)
  @JoinColumn({ name: "creator_id" })
  creator!: User;
}
