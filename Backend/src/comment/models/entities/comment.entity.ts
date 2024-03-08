import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  comment_id: string;

  @ManyToOne(() => Contribution)
  @JoinColumn({ name: 'contribution_id' }) 
  contribution: Contribution;

  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_submmit_comment: Date;
}
