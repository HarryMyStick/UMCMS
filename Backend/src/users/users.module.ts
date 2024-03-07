import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Role } from 'src/role/models/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';
import { FacultyModule } from 'src/faculty/faculty.module';
import { Profile } from 'src/profile/models/entities/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile, Faculty]),
    RoleModule,
    ProfileModule,
    FacultyModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
