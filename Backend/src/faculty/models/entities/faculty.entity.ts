import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity()
export class Faculty extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  faculty_id: string;

  @Column()
  faculty_name: string;
}
