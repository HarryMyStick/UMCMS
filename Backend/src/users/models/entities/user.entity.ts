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
import { Profile } from 'src/profile/models/entities/profile.entity';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'user_id' }) 
  profile: Profile;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' }) 
  role: Role;

  @OneToOne(() => Faculty)
  @JoinColumn({ name: 'faculty_id' })
  faculty_id: Faculty;
}

