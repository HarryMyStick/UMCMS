import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  comment_id: string;

  @ManyToOne(() => Contribution, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contribution_id' }) 
  contribution_id: Contribution;

  @Column()
  comment_content: string;

  @Column({ nullable: true })
  student_reply: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true, default: null })
  student_submission_date: Date | null;
}