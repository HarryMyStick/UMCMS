import { AcademicYear } from 'src/academic_year/models/entities/academic-year.entity';
import { User } from 'src/users/models/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Contribution extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  contribution_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) 
  user_id: User;

  @Column()
  article_title: string;

  @Column()
  article_description: string;

  @Column()
  article_content_url: string;

  @Column({ default: "default" })
  image_url: string;

  @Column({ default: "not comment" })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  edit_date: Date;

  @Column({ default: true })
  isEnable: boolean;

  @Column({ default: 'Pending' })
  status: string;

  @ManyToOne(() => AcademicYear)
  @JoinColumn({ name: 'academic_year_id' }) 
  academic_year_id: AcademicYear;
}