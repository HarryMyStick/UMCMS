import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Role } from 'src/role/models/entities/role.entity';
import { Profile } from 'src/profile/models/entities/profile.entity';
import { RoleModule } from 'src/role/role.module';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile]),
    RoleModule,
    ProfileModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
