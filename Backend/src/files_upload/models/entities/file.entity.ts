import { Contribution } from 'src/contribution/models/entities/contribution.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  file_id: string;

  @ManyToOne(() => Contribution)
  @JoinColumn({ name: 'contribution_id' }) 
  contribution: Contribution;

  @Column()
  image_url: string;
}
