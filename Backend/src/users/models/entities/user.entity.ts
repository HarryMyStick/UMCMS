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

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  // @Column()
  // faculty_id: string;
}

