import { User } from 'src/users/models/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  profile_id: string;

  @Column({ default: '' }) 
  first_name: string;

  @Column({ default: '' }) 
  last_name: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone_number: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user_id: User;

  toJSON() {
    const { user_id, ...rest } = this;
    return rest;
  }

}
