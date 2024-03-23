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
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Profile, Faculty]),
    RoleModule,
    ProfileModule,
    FacultyModule,
    JwtModule.register({
      secret: 'b7e6da353033657fbf8c02ba5e96ce1360dd0ec0964f3c899d31e0e657757e3d',
      signOptions: { expiresIn: '1h' }, // Optional: Define token expiration time
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
