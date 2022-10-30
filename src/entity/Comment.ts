import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  user_id: number;

  @Column({ nullable: true })
  post_id: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({
    name: "post_id",
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  update_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
