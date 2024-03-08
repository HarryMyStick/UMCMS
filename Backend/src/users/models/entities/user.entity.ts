import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Role } from 'src/role/models/entities/role.entity';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' }) 
  role: Role;

  @OneToOne(() => Faculty)
  @JoinColumn({ name: 'faculty_id' })
  faculty_id: Faculty;
}

