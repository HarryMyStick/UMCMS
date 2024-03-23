// chat.module.ts
import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/models/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { RoleModule } from 'src/role/role.module';
import { ProfileModule } from 'src/profile/profile.module';
import { FacultyModule } from 'src/faculty/faculty.module';
import { Role } from 'src/role/models/entities/role.entity';
import { Profile } from 'src/profile/models/entities/profile.entity';
import { Faculty } from 'src/faculty/models/entities/faculty.entity';
import { ProfileService } from 'src/profile/profile.service';
import { RoleService } from 'src/role/role.service';
import { FacultyService } from 'src/faculty/faculty.service';
import { MessageService } from './message.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Role, Profile, Faculty]), // Import UserRepository into TypeOrmModule
      JwtModule.register({
        secret: 'your-secret-key-here',
        signOptions: { expiresIn: '1h' },
      }),
    ],
    providers: [
      MessageGateway,
      UsersService,
      ProfileService,
      RoleService,
      FacultyService,
      UsersModule,
      RoleModule,
      ProfileModule,
      FacultyModule,
      MessageService,
    ],
    exports: [MessageService],
  })
  export class MessageModule {}
