import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { Tag } from "./Tag";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @Index()
  url: string;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @Index()
  @CreateDateColumn()
  created_at: Date;

  @Index()
  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
